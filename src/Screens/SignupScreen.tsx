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
import { useNavigation } from "@react-navigation/native";
import firebase from "firebase";
import { fireConfig } from "../Fire";
import logo from "../../assets/kids_karate.png";

export function SignupScreen() {
  if (firebase.apps.length === 0) {
    firebase.initializeApp(fireConfig);
  }

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const navigation = useNavigation();
  const toRegister = (user: signedUpUser) => {
    navigation.navigate("Register", { user: user });
  };
  const back = () => {
    navigation.goBack();
  };

  const pressedSubmit = (email: string, password: string) => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((user) => {
        if (!user) throw new Error("user is empty");
        if (!user.user) throw new Error("user.user is empty");
　　　　　if (!user.user.email) throw new Error("user.user.email is empty");
        //登録成功したらログイン画面に戻る
        Alert.alert("登録成功！", "続いてお名前を登録してください");
        const currentUser: signedUpUser = {
          email: user.user.email,
          uid: user.user.uid,
        };
        toRegister(currentUser);

      })
      .catch((error) => {
        //エラーが返ってきたらその内容をアラートで表示
        console.log(error);
        Alert.alert("エラー", `${error}`);
      });
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
          <Text style={styles.screenTitle}>新規登録</Text>
          <TextInput
            style={styles.inputField}
            placeholder="メールアドレスを入力"
            onChangeText={(email) => {
              setEmail(email);
            }}
            keyboardType="email-address"
            // ↓自動でアルファベットを大文字にしないようにするやつ
            autoCapitalize="none"
          />
          <TextInput
            style={styles.inputField}
            placeholder="パスワードを入力"
            onChangeText={(password) => {
              setPassword(password);
            }}
            keyboardType="visible-password"
            // ↓パスワードを隠すコード
            secureTextEntry={true}
          />
          <ExpoStatusBar style="auto" />
        </View>
        <View style={styles.includeButtons}>
          <Button
            title="登録"
            onPress={() => {
              pressedSubmit(email, password);
              toRegister;
            }}
          />
          <View style={styles.spacer2}></View>
          <Button
            title="ログイン画面に戻る"
            onPress={() => {
              back();
            }}
          />
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
    marginBottom: 20,
    color: "white",
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
    height: 150,
  },
  spacer2: {
    height: 10,
  },
});
