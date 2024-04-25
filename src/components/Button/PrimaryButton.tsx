import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface PrimaryButtonProps {
  text?: string;
  onPress?: () => void;
  style?: any;
  textStyle?: any;
  disabled?: boolean;
  disablePadding?: any;
  endAdornment?: any;
}

export const PrimaryButton = (props: PrimaryButtonProps) => {
  const {
    text,
    onPress,
    style,
    textStyle,
    disabled,
    disablePadding,
    endAdornment,
  } = props;
  return (
    <TouchableOpacity disabled={disabled} onPress={onPress}>
      <View
        style={[
          !disablePadding ? styles.btnContainer : styles.btnContainerNoPadding,
          style,
          disabled && { backgroundColor: "grey" },
        ]}
      >
        <Text style={{ ...styles.btnText, ...textStyle }}>
          {text}
        </Text>
        {endAdornment}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btnContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1f30fb",
    borderRadius: 20,
    padding: 14,
  },
  btnContainerNoPadding: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1f30fb",
    borderRadius: 20,
  },
  btnText: {
    textAlign: "center",
    color: "white",
    fontWeight: "900",
    fontSize: 16,
  },
});
