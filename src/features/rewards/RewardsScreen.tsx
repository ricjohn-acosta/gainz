import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

import { RewardCard } from "./RewardCard";

export default function RewardsScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.screenTitleContainer}>
        <Text style={styles.screenTitle}>Claim rewards!</Text>
      </View>
      <View>
        <RewardCard />
        <RewardCard />
        <RewardCard />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 12,
  },
  screenTitleContainer: {
    backgroundColor: "#f2f4ff",
    marginBottom: 30,
    marginLeft: 4,
  },
  screenTitle: {
    fontWeight: "bold",
    fontSize: 22,
    color: "#000000",
  },
});
