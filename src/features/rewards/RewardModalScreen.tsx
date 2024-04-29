import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Entypo } from "@expo/vector-icons";

export const RewardModalScreen = () => {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <View style={styles.messageContainer}>
        <Text style={styles.messageTitle}>Manage rewards</Text>
        <Text style={styles.subtitle}>
          Leaders can create or delete rewards here!
        </Text>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate("AddReward")}>
        <View style={styles.optionContainer}>
          <Text style={styles.title}>Create a reward</Text>
          <Entypo name="chevron-small-right" size={30} color={"#1f30fb"} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("DeleteReward")}>
        <View style={styles.optionContainer}>
          <Text style={styles.title}>Delete a reward</Text>
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
    fontWeight: "bold",
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
    fontSize: 18,
    color: "#000000",
    marginBottom: 8,
  },
  subtitle: {
    color: "grey",
    marginBottom: 6,
  },
});
