import { StyleSheet, TouchableOpacity, View } from "react-native";
import BasicText from "../Text/BasicText.tsx";
import { Entypo } from "@expo/vector-icons";
import { FC } from "react";
import { useNavigation } from "@react-navigation/native";

interface ActionButtonProps {
  onPress?: any;
  label: string;
  labelStyle?: any;
  to?: string;
}

export const MenuActionButton: FC<ActionButtonProps> = (props) => {
  const { to, label, onPress, labelStyle } = props;

  const navigation = useNavigation<any>();
  const handleNavigate = () => {
    navigation.navigate(to);
  };

  return (
    <TouchableOpacity
      onPress={() => {
        if (to) {
          handleNavigate();
          return;
        }

        onPress();
      }}
    >
      <View style={styles.optionContainer}>
        <BasicText style={[styles.label, labelStyle]}>{label}</BasicText>
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
    marginBottom: 8,
  },
});
