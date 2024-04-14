import React from "react";
import { Pressable } from "react-native";

interface IconButtonProps {
  IconComponent: any;
  iconProps: any;
  onPress?: () => void;
}

export const IconButton = (props: IconButtonProps) => {
  const { IconComponent, iconProps, onPress } = props;

  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <IconComponent
          {...iconProps}
          color={pressed ? iconProps.pressedColor : iconProps.defaultColor}
        />
      )}
    </Pressable>
  );
};
