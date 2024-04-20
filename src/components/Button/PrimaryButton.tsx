import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface PrimaryButtonProps {
  text?: string;
  onPress?: () => void;
  style?: any;
  textStyle?: any;
  disabled?: boolean;
}

export const PrimaryButton = (props: PrimaryButtonProps) => {
  const { text, onPress, style, textStyle, disabled } = props;
  return (
    <TouchableOpacity disabled={disabled} onPress={onPress}>
      <View
        style={[
          styles.btnContainer,
          style,
          disabled && { backgroundColor: "grey" },
        ]}
      >
        <Text style={{ ...styles.btnText, ...textStyle }}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btnContainer: {
    backgroundColor: "#1f30fb",
    borderRadius: 20,
    padding: 14,
  },
  btnText: {
    textAlign: "center",
    color: "white",
    fontWeight: "900",
    fontSize: 16,
  },
});
