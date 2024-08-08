import { StyleSheet, TouchableOpacity, View } from "react-native";
import BasicText from "../Text/BasicText.tsx";
import { Entypo } from "@expo/vector-icons";
import React, { FC } from "react";
import { useNavigation } from "@react-navigation/native";

interface ActionButtonProps {
  onPress?: any;
  label: string;
  labelStyle?: any;
  iconContainerStyle?: any;
  to?: string;
  icon?: any;
}

export const MenuActionButton: FC<ActionButtonProps> = (props) => {
  const { to, label, onPress, labelStyle, iconContainerStyle, icon } = props;

  const navigation = useNavigation<any>();
  const handleNavigate = () => {
    navigation.navigate(to);
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        if (to) {
          handleNavigate();
          return;
        }

        onPress();
      }}
    >
      <View style={styles.optionContainer}>
        <View style={styles.labelContainer}>
          <View style={[iconContainerStyle]}>{icon && icon}</View>
          <BasicText style={[styles.label, labelStyle]}>{label}</BasicText>
        </View>
        {to && (
          <Entypo name="chevron-small-right" size={30} color={"#1f30fb"} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  optionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#d9d9d9",
  },
  label: {
    fontSize: 16,
    color: "#000000",
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});
