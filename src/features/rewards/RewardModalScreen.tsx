import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Entypo } from "@expo/vector-icons";
import BasicText from "../../components/Text/BasicText";

export const RewardModalScreen = () => {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <View style={styles.messageContainer}>
        <BasicText style={styles.messageTitle}>Manage rewards</BasicText>
        <BasicText style={styles.subtitle}>
          Leaders can create or delete rewards here!
        </BasicText>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate("AddReward")}>
        <View style={styles.optionContainer}>
          <BasicText style={styles.title}>Create a reward</BasicText>
          <Entypo name="chevron-small-right" size={30} color={"#1f30fb"} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("DeleteReward")}>
        <View style={styles.optionContainer}>
          <BasicText style={styles.title}>Delete a reward</BasicText>
          <Entypo name="chevron-small-right" size={30} color={"#1f30fb"} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 12,
  },
  messageContainer: {
    marginBottom: 30,
  },
  messageTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 22,
    color: "#000000",
    marginBottom: 8,
  },
  optionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#d9d9d9"
  },
  title: {
    fontSize: 16,
    color: "#000000",
    marginBottom: 8,
  },
  subtitle: {
    color: "grey",
    marginBottom: 6,
  },
});
