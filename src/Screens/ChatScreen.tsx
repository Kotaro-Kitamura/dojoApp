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
  const [text, setText] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const currentUser = props.route.params.user;
  const navigation = useNavigation();
  const back = () => {
    navigation.goBack();
  };

  //データベースを参照
  const getMessageDocRef = async () => {
    return await firebase.firestore().collection("messages").doc();
  };

  //send押した時に実行する関数…参照しているデータベースに追加
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
      Alert.alert("エラー", "メッセージを入力してください！");
    }
  };

  //この関数を削除
  // const getMessages = /*async*/ () => {
  //   const messages = [] as Message[];
  //   /*** const unsubscribe = の部分を追加 ***/
  //   const unsubscribe = /* await*/ firebase
  //     .firestore()
  //     .collection("messages")
  //     .orderBy("createdAt", "desc")
  //     .onSnapshot((snapshot) => {
  //       snapshot.docChanges().forEach((change) => {
  //         //変化の種類が"added"だったときの処理
  //         if (change.type === "added") {
  //           //今アプリにもっているmessagesに取得した差分を追加
  //           messages.unshift(change.doc.data() as Message);
  //           // } else if (change.type === "removed") {
  //           //   console.log("【modified data】");
  //           // } else if (change.type === "modified") {
  //           //   console.log("【deleted some data】");
  //         }
  //         setMessages(messages);
  //       });
  //     });
  //   /**この部分を追加 **/
  //   return unsubscribe; //(removeListener = unsubscribe); // 変更!
  // };

  //サインアウトの処理
  const pressedSignOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        console.log("ログアウトしました");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //ナビゲーションヘッダーの左側に配置
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            // unsubscribe();   <--- 削除
            pressedSignOut();
            back();
          }}
        >
          <Text>Sign Out</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    //この中をまるまる変更(関数getMessagesの中身をここに記述)
    const messages = [] as Message[];
    /* const unsubscribe = の部分を追加 */
    const unsubscribe = firebase
      .firestore()
      .collection("messages")
      .orderBy("createdAt", "desc")
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          //変化の種類が"added"だったときの処理
          if (change.type === "added") {
            //今アプリにもっているmessagesに取得した差分を追加
            messages.unshift(change.doc.data() as Message);
          }
          setMessages(messages);
        });
      });
    /* この部分を追加 */
    return unsubscribe; //リスナーのデタッチ
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingView}
      keyboardVerticalOffset={90}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <SafeAreaView style={styles.container}>
        <Text style={{ fontSize: 20, height: 40, width: "98%" }}>
          {currentUser.email}でログイン中
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
    backgroundColor: "#fff",
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
