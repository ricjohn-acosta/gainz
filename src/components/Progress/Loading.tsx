import React from "react";
import { Image, StyleSheet, View, Text, ActivityIndicator } from "react-native";

import images from "../../../assets";

export const Loading = () => {
  return (
    <View>
      <View style={styles.logoContainer}>
        <Image style={styles.logo} source={images.kapaiiSquareLogo} />
      </View>
      <Text style={styles.brand}>kapaii</Text>
      <Text style={styles.slogan}>We see your hardwork!</Text>
      <View style={styles.activityIndicator}>
        <ActivityIndicator size="large" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 200,
    marginBottom: 10,
  },
  logo: {
    borderRadius: 20,
    width: 80,
    height: 80,
  },
  brand: {
    textAlign: "center",
    fontFamily: "Poppins-Bold",
  },
  slogan: {
    textAlign: "center",
  },
  activityIndicator: {
    marginTop: 50,
  },
});
