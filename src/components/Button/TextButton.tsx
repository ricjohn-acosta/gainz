import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface PrimaryButtonProps {
  text: string;
  onPress?: () => void;
  textStyle?: any;
  disabled?: boolean;
}

export const TextButton = (props: PrimaryButtonProps) => {
  const { text, onPress, textStyle, disabled } = props;

  return (
    <TouchableOpacity disabled={disabled} onPress={onPress}>
      <Text style={[styles.btnText, textStyle, disabled && styles.disabled]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btnText: {
    fontWeight: "bold",
    fontSize: 13,
    color: "#1f30fb",
  },
  disabled: {
    color: "#858585",
  },
});
