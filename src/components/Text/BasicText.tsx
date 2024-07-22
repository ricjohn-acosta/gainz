import React from "react";
import { Text, PixelRatio } from "react-native";

const BasicText = (props) => {
  const { style } = props;

  let fontFamily = "Poppins-Regular";
  let fontSize;

  if (style) {
    // android doesnt support fontweight
    if (style.fontWeight === "bold") {
      fontFamily = "Poppins-Bold";
    }

    if (style.fontWeight === "500") {
      fontFamily = "Poppins-Medium";
    }

    if (style.fontWeight === "600") {
      fontFamily = "Poppins-SemiBold";
    }

    if (style.fontWeight === "bold" && style.fontStyle === "italic") {
      fontFamily = "Poppins-BoldItalic";
    }
  }

  if (style && style.fontSize && PixelRatio.get() <= 3) {
    console.log(style.fontSize)

    fontSize = style.fontSize * 0.9;
  }

  const mergedStyle = [{ fontFamily }, style, { fontSize }];

  return <Text style={mergedStyle}>{props.children}</Text>;
};

export default BasicText;
