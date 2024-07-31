import React from "react";
import { Pressable } from "react-native";

interface IconButtonProps {
  IconComponent: any;
  iconProps: any;
  onPress?: () => void;
  disabled?: boolean;
  hitSlop?: number;
}

export const IconButton = (props: IconButtonProps) => {
  const { IconComponent, iconProps, onPress, disabled, hitSlop } = props;

  const getIconColor = (pressed) => {
    if (disabled) {
      return "grey";
    }

    if (pressed) {
      return iconProps.pressedColor;
    }

    return iconProps.defaultColor;
  };

  return (
    <Pressable hitSlop={hitSlop} onPress={onPress} disabled={disabled}>
      {({ pressed }) => (
        <IconComponent {...iconProps} color={getIconColor(pressed)} />
      )}
    </Pressable>
  );
};
