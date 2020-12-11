import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Alert,
  StatusBar,
} from "react-native";
import { RouteProp, useNavigation } from "@react-navigation/native";
import firebase from "firebase";
import { fireConfig } from "../Fire";
import logo from "../../assets/ojigi.png"; 
import { StackNavigationProp } from "@react-navigation/stack";

type Props = {
  route: RouteProp<RootStackParamList, "Register">
  navigation: StackNavigationProp<RootStackParamList, "Register">
}

export function RegisterScreen(props: Props) {  
  const [name, setName] = useState<string>("");
  const currentUser = props.route.params.user;
  const navigation = props.navigation;
  
  const toChat = () => {
    navigation.navigate("Chat");
  };

  const getUsersDocRef = async () => {
    return await firebase.firestore().collection("users").doc();
  };
  const registerUserInfo = async () => {
    if (name !== "") {
      const docRef = await getUsersDocRef();
      const newUser: RegisteredUser = {
        name: name,
        uid: currentUser.uid,
      };
      await docRef.set(newUser);
      toChat();
    } else {
      Alert.alert("エラー", "名前を入力してください");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.spacer1}></View>
      <Image
        source={logo}
        style={{
          width: 200,
          height: 200,
          resizeMode: "contain",
        }}
      />
      <KeyboardAvoidingView style={styles.container}>
        <View style={styles.titleAndFieldView}>
          <Text style={styles.screenTitle}>お名前登録</Text>
          <TextInput
            style={styles.inputField}
            placeholder="氏名を入力ください"
            onChangeText={(name) => {
              setName(name);
            }}
            returnKeyType="done"
          />
          <ExpoStatusBar style="auto" />
        </View>
        <View style={styles.includeButtons}>
          <Button
            title="登録"
            onPress={registerUserInfo}
          />
          <View style={styles.spacer2}></View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 10,
    resizeMode: "contain",
  },
  titleAndFieldView: {
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
    flex: 3,
  },
  screenTitle: {
    fontSize: 30,
    marginBottom: 50,
  },
  inputField: {
    width: "80%",
    marginBottom: 20,
    height: 35,
    backgroundColor: "lightgray",
  },
  includeButtons: {
    flex: 4,
    marginVertical: 10,
  },
  spacer1: {
    height: 110,
  },
  spacer2: {
    height: 10,
  },
});