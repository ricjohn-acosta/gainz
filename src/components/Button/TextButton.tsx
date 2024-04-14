import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface PrimaryButtonProps {
  text: string;
  onPress?: () => void;
  textStyle?: any;
}

export const TextButton = (props: PrimaryButtonProps) => {
  const { text, onPress, textStyle } = props;
  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={[styles.btnText, textStyle]}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btnText: {
    fontWeight: "bold",
    fontSize: 13,
  },
});
