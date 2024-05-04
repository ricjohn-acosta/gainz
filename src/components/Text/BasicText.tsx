import React from "react";
import { Text } from "react-native";

const BasicText = (props) => {
  const { style } = props;

  let fontFamily = "Poppins-Regular";

  if (style) {
    if (style.fontWeight === "bold") {
      fontFamily = "Poppins-Bold";
    }

    if (style.fontWeight === "500") {
      fontFamily = "Poppins-Medium";
    }

    if (style.fontWeight === "600") {
      fontFamily = "Poppins-SemiBold";
    }

    if (style.fontWeight === "bold" && style.fontStyle === 'italic') {
      fontFamily = "Poppins-BoldItalic"
    }
  }

  const mergedStyle = [{ fontFamily }, style];

  return (
    <Text style={mergedStyle}>
      {props.children}
    </Text>
  );
};

export default BasicText;
