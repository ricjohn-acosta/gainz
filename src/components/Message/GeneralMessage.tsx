import React from "react";
import { Image, StyleSheet, View } from "react-native";
import images from "../../../assets/index.ts";
import BasicText from "../Text/BasicText.tsx";

interface GeneralMessageProps {
  title: string;
  subtitle?: string;
  imageStyle: any;
}

export const GeneralMessage = (props) => {
  const { title, subtitle, imageStyle } = props;
  return (
    <View style={styles.container}>
      <Image style={[styles.image, imageStyle]} source={images.team} />
      <BasicText style={styles.title}>{title}</BasicText>
      <BasicText style={styles.subtitle}>{subtitle}</BasicText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 300,
    height: 300,
  },
  title: {
    textAlign: 'center',
    fontFamily: "Poppins-Bold",
    fontSize: 18,
    color: "#1f30fb"
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: 'grey'
  },
});
