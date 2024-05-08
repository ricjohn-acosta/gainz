import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React from "react";
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

export const InvitationForm = () => {
  const navigation = useNavigation<any>();

  // const handleSkipInviteCode = async () => {
  //     await AsyncStorage.setItem('has_skipped_invite_code', 'true')
  // }

  const continueWithInviteCode = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "AuthStack" }],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.subContainer}>
        <View style={styles.logoContainer}>
          <Image style={styles.logo} source={images.kapaiiSquareLogo} />
        </View>

        <View>
          <Text style={styles.welcomeMessage}>Welcome!</Text>
          <Text style={styles.subtitle}>
            Enter an invite code if you have one.
          </Text>
          <TextInput style={styles.input} placeholder="e.g: F6152" />
        </View>
        <View style={styles.ctaBtn}>
          <PrimaryButton onPress={continueWithInviteCode} text="Enter" />
        </View>
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
  welcomeMessage: {
    fontFamily: "Poppins-Bold",
    fontSize: 40,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 16,
    color: "grey",
  },
  input: {
    backgroundColor: "#ffffff",
    padding: 20,
    marginTop: 20,
    borderRadius: 20,
  },
  ctaBtn: {
    marginTop: 20,
  },
});
