import React from "react";
import { StyleSheet, View } from "react-native";
import BasicText from "./BasicText.tsx";

interface DescriptiveTextProps {
  title: string;
  titleStyle: string;
  subtitle?: string;
  subtitleStyle: string;
}

export const DescriptiveText = (props: DescriptiveTextProps) => {
  const { title, titleStyle, subtitle, subtitleStyle } = props;

  return (
    <View style={styles.messageContainer}>
      <BasicText style={[styles.title, titleStyle]}>{title}</BasicText>
      {subtitle && (
        <BasicText style={[styles.subtitle, subtitleStyle]}>
          {subtitle}
        </BasicText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    marginBottom: 24,
  },
  title: {
    fontFamily: "Poppins-Bold",
    fontSize: 22,
    color: "#000000",
    marginBottom: 8,
  },
  subtitle: {
    color: "grey",
    marginBottom: 6,
  },
});
