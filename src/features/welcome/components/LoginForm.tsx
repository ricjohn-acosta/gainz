import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import images from "../../../../assets";
import { PrimaryButton } from "../../../components/Button/PrimaryButton";
import { TextButton } from "../../../components/Button/TextButton";
import Divider from "../../../components/Divider/Divider";
import useAuthStore from "../../../stores/authStore";
import useProfileStore from "../../../stores/profileStore";
import { Loading } from "../../../components/Progress/Loading";
import BasicText from "../../../components/Text/BasicText";

interface LoginFormProps {
  setForm?: (form: string) => void;
}

export const LoginForm = (props: LoginFormProps) => {
  const navigation = useNavigation<any>();
  const { login, session, notLoaded } = useAuthStore();
  const {
    data: { me },
  } = useProfileStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (user) {
      navigation.reset({
        index: 0,
        routes: [{ name: "Invitation" }],
      });
    }
  }, [user]);

  const handleLogin = () => {
    login(email, password).then((user) => setUser(user));
  };

  if (notLoaded && (!session || !me)) return <Loading />;

  if (!session) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.subContainer}>
          <View style={styles.logoContainer}>
            <Image style={styles.logo} source={images.kapaiiSquareLogo} />
          </View>

          <BasicText style={styles.title}>Log in!</BasicText>
          <View style={styles.inputContainer}>
            <View style={styles.icon}>
              <MaterialCommunityIcons
                name="email-outline"
                size={18}
                color="grey"
              />
            </View>
            <TextInput
              onChangeText={(val) => setEmail(val)}
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
              onChangeText={(val) => setPassword(val)}
              style={styles.input}
              placeholder="Password"
            />
          </View>
          <View style={styles.forgotPasswordBtn}>
            <TextButton
              textStyle={styles.forgotPasswordText}
              text="Forgot password?"
            />
          </View>

          <View style={styles.ctaBtn}>
            <PrimaryButton onPress={handleLogin} text="Log in" />
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
          <BasicText>Don't have an account? </BasicText>
          <TextButton
            onPress={() => navigation.navigate("Signup")}
            textStyle={{ color: "#1f30fb" }}
            text="Sign up!"
          />
        </View>
      </SafeAreaView>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f4ff",
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
    flex: 1,
    backgroundColor: "#ffffff",
    height: 50,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    fontFamily: 'Poppins-Regular'
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
    fontFamily: 'Poppins-Regular',
  },
});
