import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { InvitationForm } from "./components/InvitationForm";
import { LoginForm } from "./components/LoginForm";
import { SignupForm } from "./components/SignupForm";
import images from "../../../assets";
import { PrimaryButton } from "../../components/Button/PrimaryButton";
import { TextButton } from "../../components/Button/TextButton";
import Divider from "../../components/Divider/Divider";

export const WelcomeScreen = () => {
  const [form, setForm] = useState("login-form");

  const showSkipBtn = () => {
    if (form === "login-form" || form === "signup-form") return null;

    return (
      <View style={styles.skipBtnContainer}>
        <TextButton textStyle={styles.skipBtn} text="Skip" />
      </View>
    );
  };

  const showAccountCreationMessage = () => {
    if (form === "login-form") {
      return (
        <View style={styles.signupContainer}>
          <Text>Don't have an account? </Text>
          <TextButton
            onPress={() => setForm("signup-form")}
            textStyle={{ color: "#1f30fb", marginTop: 10}}
            text="Sign up!"
          />
        </View>
      );
    }

    if (form === "signup-form") {
      return (
        <View style={styles.signupContainer}>
          <Text>Already have an account? </Text>
          <TextButton
            onPress={() => setForm("login-form")}
            textStyle={{ color: "#1f30fb" }}
            text="Log in!"
          />
        </View>
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.subContainer}>
        {showSkipBtn()}
        <View style={styles.logoContainer}>
          <Image style={styles.logo} source={images.kapaiiSquareLogo} />
        </View>
        {form === "login-form" && <LoginForm setForm={setForm} />}
        {form === "signup-form" && <SignupForm setForm={setForm} />}
        {form === "invitation-form" && <InvitationForm />}
      </View>
      {form !== "invitation-form" && (
        <View style={styles.dividerContainer}>
          <Divider title="or continue with" titleStyle={styles.dividerLabel} />
          <View style={styles.thirdPartyAuthContainer}>
            <Image style={styles.thirdPartyIcon} source={images.fbIcon} />
            <Image style={styles.thirdPartyIcon} source={images.googleIcon} />
          </View>
        </View>
      )}
      {showAccountCreationMessage()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f4ff",
  },
  subContainer: {
    margin: 20,
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    marginBottom: 70,
  },
  logo: {
    borderRadius: 20,
    width: 80,
    height: 80,
  },
  skipBtnContainer: {
    alignItems: "flex-end",
  },
  skipBtn: {
    color: "grey",
    fontFamily: "Poppins-Bold",
    fontSize: 13,
  },
  dividerContainer: {
    marginTop: 10,
    marginLeft: 26,
    marginRight: 26,
  },
  dividerLabel: {
    fontWeight: "normal",
    fontSize: 12,
    color: "grey",
    marginLeft: 10,
    marginRight: 10,
  },
  thirdPartyAuthContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
  },
  thirdPartyIcon: {
    width: 50,
    height: 50,
    marginLeft: 10,
    marginRight: 10,
  },
  signupContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
