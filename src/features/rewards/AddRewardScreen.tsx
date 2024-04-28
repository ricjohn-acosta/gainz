import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { AddRewardForm } from "./components/AddRewardForm";
import { useNavigation } from "@react-navigation/native";
import { TextButton } from "../../components/Button/TextButton";

export const AddRewardScreen = () => {

  return (
    <View style={styles.container}>
      <AddRewardForm />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 12,
  },
});
