import React from "react";
import {Pressable, StyleSheet} from "react-native";

interface IconButtonProps {
  IconComponent: any;
  iconProps: any;
  onPress?: () => void;
  disabled?: boolean
}

export const IconButton = (props: IconButtonProps) => {
  const { IconComponent, iconProps, onPress, disabled } = props;

  const getIconColor = (pressed) => {
    if (disabled) {
      return 'grey'
    }

    if (pressed) {
      return iconProps.pressedColor
    }

    return iconProps.defaultColor
  }

  return (
    <Pressable onPress={onPress} disabled={disabled}>
      {({ pressed }) => (
        <IconComponent
          {...iconProps}
          color={getIconColor(pressed)}
        />
      )}
    </Pressable>
  );
};
