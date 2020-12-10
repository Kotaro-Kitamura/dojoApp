import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView, 
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  FlatList,
  Platform,
  StatusBar,
} from "react-native";
import { useNavigation, RouteProp } from "@react-navigation/native";
import firebase from "firebase";
import { ChatItem } from "../ChatItem";

type ChatScreenRouteProps = RouteProp<RootStackParamList, "Chat">;
type Props = {
  route: ChatScreenRouteProps;
};

export function ChatScreen(props: Props) {
  const currentUser = props.route.params.user;
  const navigation = useNavigation();
  const back = () => {
    navigation.goBack();
  };

  const [text, setText] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);

  const getMessageDocRef = async () => {
    return await firebase.firestore().collection("messages").doc();
  };

  const sendMessage = async (value: string, user: signedInUser) => {
    if (value != "") {
      const docRef = await getMessageDocRef();
      const newMessage = {
        text: value,
        createdAt: firebase.firestore.Timestamp.now(),
        userId: user.uid,
      } as Message;
      await docRef.set(newMessage);
      setText("");
    } else {
      Alert.alert("エラー", "メッセージを入力してください");
    }
  };

  const getMessages = async () => {
    const messages = [] as Message[];
    await firebase
      .firestore()
      .collection("messages")
      .orderBy("createdAt")
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            messages.unshift(change.doc.data() as Message);
            // } else if (change.type === "removed") {
            //   console.log("【modified data】");
            // } else if (change.type === "modified") {
            //   console.log("【deleted some data】");
          }
          setMessages(messages);
        });
      });
  };

  const unsubscribe = () => {
    firebase
      .firestore()
      .collection("messages")
      .orderBy("createdAt")
      .onSnapshot((snapshot) => {});
  };
  const pressedSignOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        unsubscribe();
        console.log("サインアウトしました");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            pressedSignOut();
            back();
          }}
        >
          <Text>ログアウト</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    getMessages();
  }, []);

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={90}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.keyboardAvoidingView}
    >
      <SafeAreaView style={styles.container}>
        <Text style={{ fontSize: 20, height: 40, width: "98%" }}>
          {`${currentUser.email}`}でログイン中
        </Text>
        <View style={styles.flatlistCotainer}>
          <FlatList
            style={styles.messagesContainer}
            data={messages}
            inverted={true}
            renderItem={({ item }: { item: Message }) => (
              <ChatItem userId={currentUser.uid} item={item} />
            )}
            keyExtractor={(_, index) => index.toString()}
          />
        </View>

        <View style={styles.inputTextContainer}>
          <TextInput
            style={styles.inputText}
            onChangeText={(value) => {
              setText(value);
            }}
            value={text}
            placeholder="メッセージを入力してください"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="done"
          />
          <TouchableOpacity
            style={styles.sendButtonContainer}
            onPress={() => {
              sendMessage(text, currentUser);
            }}
          >
            <Text style={styles.sendButton}>送信</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    width: "100%",
  },
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  flatlistCotainer: {
    flex: 14,
  },
  messagesContainer: {
    minWidth: "100%",
    padding: 10,
  },
  inputTextContainer: {
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  inputText: {
    flex: 4,
    borderWidth: 1,
    borderColor: "#999",
    color: "white",
    height: 32,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  sendButtonContainer: {
    flex: 1,
    marginLeft: 10,
  },
  sendButton: {
    backgroundColor: "purple",
    color: "#ffff",
    textAlign: "center",
    padding: 5,
    borderRadius: 5,
    overflow: "hidden",
  },
});