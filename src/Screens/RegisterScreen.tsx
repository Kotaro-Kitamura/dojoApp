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
import logo from "../../assets/ojigi.png";

export function RegisterScreen() {
  if (firebase.apps.length === 0) {
    firebase.initializeApp(fireConfig);
  }


  const [name, setName] = useState("");
  const [users, setUsers] =useState("");

  const navigation = useNavigation();
  const back = () => {
    navigation.goBack();
  };

  const getUsersDocRef = async () => {
    return await firebase.firestore().collection("users").doc();
  };
  const sendUsers = async (value: string, user: signedInUser) => {
    if (value != "") {
      const docRef = await getUsersDocRef();
      const newName = {
        name: value,
        createdAt: firebase.firestore.Timestamp.now(),
        userId: user.uid,
      } as Users;
      await docRef.set(newName);
      setName("");
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
            onPress={() => {}}
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