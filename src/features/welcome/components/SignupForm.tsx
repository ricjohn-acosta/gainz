import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, {useEffect, useState} from "react";
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

interface SignupFormProps {
  setForm?: (form: string) => void;
}

export const SignupForm = (props: SignupFormProps) => {
  const navigation = useNavigation<any>();

  const { signUp } = useAuthStore();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [user, setUser] = useState(null);

  useEffect(() => {
    if (user) {
      navigation.reset({
        index: 0,
        routes: [{ name: "AuthStack" }],
      })
    }
  }, [user]);


  const handleSignup = async () => {
    try {
      signUp(username, email, password).then(user => setUser(user));
    } catch (e) {
      console.error(e);
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
          <TextInput
            onChangeText={setUsername}
            style={styles.input}
            placeholder="Name"
          />
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.icon}>
            <MaterialCommunityIcons
              name="email-outline"
              size={18}
              color="grey"
            />
          </View>
          <TextInput
            onChangeText={setEmail}
            style={styles.input}
            placeholder="Email"
          />
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.icon}>
            <MaterialCommunityIcons
              name="lock-outline"
              size={18}
              color="grey"
            />
          </View>
          <TextInput
            secureTextEntry
            onChangeText={setPassword}
            style={styles.input}
            placeholder="Password"
          />
        </View>

        <View style={styles.ctaBtn}>
          <PrimaryButton onPress={handleSignup} text="Sign up" />
        </View>
      </View>

      <View style={styles.dividerContainer}>
        <Divider title="or continue with" titleStyle={styles.dividerLabel} />
        <View style={styles.thirdPartyAuthContainer}>
          <Image style={styles.thirdPartyIcon} source={images.fbIcon} />
          <Image style={styles.thirdPartyIcon} source={images.googleIcon} />
        </View>
      </View>
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
    marginTop: 40,
    marginBottom: 70,
  },
  logo: {
    borderRadius: 20,
    width: 80,
    height: 80,
  },
  title: {
    fontWeight: "bold",
    fontSize: 40,
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 10
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
    fontFamily: 'Poppins-Regular',
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
});
