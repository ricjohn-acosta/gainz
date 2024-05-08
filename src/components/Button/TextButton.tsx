import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import BasicText from "../Text/BasicText";

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
      <BasicText style={{...styles.btnText, ...textStyle, ...(disabled && styles.disabled)}}>
        {text}
      </BasicText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btnText: {
    fontFamily: "Poppins-Bold",
    fontSize: 13,
    color: "#1f30fb",
  },
  disabled: {
    color: "#858585",
  },
});
