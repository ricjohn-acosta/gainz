import React from "react";
import { StyleSheet, View } from "react-native";
import { DeleteRewardList } from "./components/DeleteRewardList";

export const DeleteRewardScreen = () => {
  return (
    <View style={styles.container}>
      <DeleteRewardList />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 12,
  },
});
