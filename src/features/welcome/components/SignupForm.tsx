import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
  Image,
  SafeAreaView,
} from "react-native";

import images from "../../../../assets";
import { PrimaryButton } from "../../../components/Button/PrimaryButton";
import { TextButton } from "../../../components/Button/TextButton";
import Divider from "../../../components/Divider/Divider";
import useAuthStore from "../../../stores/authStore";
import BasicText from "../../../components/Text/BasicText";
import { useForm } from "react-hook-form";
import { BasicTextInput } from "../../../components/Input/BasicTextInput.tsx";
import { GoogleSignUpButton } from "../../../components/Auth/GoogleSignUpButton.tsx";

interface SignupFormProps {
  setForm?: (form: string) => void;
}

export const SignupForm = (props: SignupFormProps) => {
  const navigation = useNavigation<any>();

  const { signUp } = useAuthStore();
  const {
    getValues,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<any>();

  const [user, setUser] = useState(null);

  useEffect(() => {
    if (user) {
      navigation.reset({
        index: 0,
        routes: [{ name: "AuthStack" }],
      });
    }
  }, [user]);

  const handleSignup = () => {
    if (
      getValues() &&
      getValues("username") &&
      getValues("email") &&
      getValues("password")
    ) {
      const username = getValues("username");
      const email = getValues("email");
      const password = getValues("password");

      signUp(username, email, password).then((user) => setUser(user));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.subContainer}>
        <View style={styles.logoContainer}>
          <Image style={styles.logo} source={images.kapaiiSquareLogo} />
        </View>
        <BasicText style={styles.title}>Sign up!</BasicText>
        <View style={styles.inputContainer}>
          <View style={styles.icon}>
            <MaterialCommunityIcons
              name="account-circle-outline"
              size={18}
              color="grey"
            />
          </View>
          <BasicTextInput
            style={styles.input}
            name={"username"}
            control={control}
            rules={{ required: "Username required" }}
            placeholder="Enter username"
          />
        </View>
        {errors && errors["username"] && (
          <BasicText style={styles.errorMsg}>
            {errors["username"].message}
          </BasicText>
        )}

        <View style={styles.inputContainer}>
          <View style={styles.icon}>
            <MaterialCommunityIcons
              name="email-outline"
              size={18}
              color="grey"
            />
          </View>
          <BasicTextInput
            keyboardType={"email-address"}
            style={styles.input}
            name={"email"}
            control={control}
            rules={{ required: "Email required" }}
            placeholder="Enter email"
          />
        </View>
        {errors && errors["email"] && (
          <BasicText style={styles.errorMsg}>
            {errors["email"].message}
          </BasicText>
        )}

        <View style={styles.inputContainer}>
          <View style={styles.icon}>
            <MaterialCommunityIcons
              name="lock-outline"
              size={18}
              color="grey"
            />
          </View>
          <BasicTextInput
            password
            style={styles.input}
            name={"password"}
            control={control}
            rules={{ required: "Password required" }}
            placeholder="Enter password"
          />
        </View>
        {errors && errors["password"] && (
          <BasicText style={styles.errorMsg}>
            {errors["password"].message}
          </BasicText>
        )}

        <View style={styles.ctaBtn}>
          <PrimaryButton onPress={handleSubmit(handleSignup)} text="Sign up" />
        </View>
      </View>

      {/*<View style={styles.dividerContainer}>*/}
      {/*  <Divider title="or continue with" titleStyle={styles.dividerLabel} />*/}
      {/*  <View style={styles.thirdPartyAuthContainer}>*/}
      {/*    <GoogleSignUpButton />*/}
      {/*  </View>*/}
      {/*</View>*/}
      <View style={styles.signupContainer}>
        <BasicText>Already have an account? </BasicText>
        <TextButton
          onPress={() => {
            navigation.navigate("Login");
          }}
          textStyle={{ color: "#1f30fb" }}
          text="Log in!"
        />
      </View>
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
    marginTop: 15,
    marginBottom: 70,
  },
  logo: {
    borderRadius: 20,
    width: 80,
    height: 80,
  },
  title: {
    fontFamily: "Poppins-Bold",
    fontSize: 40,
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 10,
    marginTop: 10,
  },
  icon: {
    backgroundColor: "#ffffff",
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 16,
    height: 50,
    borderBottomLeftRadius: 20,
    borderTopLeftRadius: 20,
  },
  input: {
    fontFamily: "Poppins-Regular",
    flex: 1,
    backgroundColor: "#ffffff",
    height: 50,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  ctaBtn: {
    marginTop: 20,
  },
  forgotPasswordBtn: {
    alignItems: "flex-end",
    marginTop: 10,
  },
  forgotPasswordText: {
    color: "#1f30fb",
    fontWeight: "normal",
  },
  signupContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  dividerContainer: {
    marginTop: 10,
    marginLeft: 26,
    marginRight: 26,
  },
  dividerLabel: {
    fontWeight: "normal",
    fontSize: 10,
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
  errorMsg: {
    color: "red",
    marginLeft: 10,
  },
});
