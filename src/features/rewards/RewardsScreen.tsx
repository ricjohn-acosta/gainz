import React, { useCallback, useRef } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";

import { RewardCard } from "./components/RewardCard";
import { useFocusEffect } from "@react-navigation/native";
import useRewardStore from "../../stores/rewardStore";

export default function RewardsScreen() {
  const {
    data: { rewards },
    operations: { getRewards },
  } = useRewardStore();

  useFocusEffect(
    useCallback(() => {
      getRewards();
    }, []),
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.screenTitleContainer}>
        <Text style={styles.screenTitle}>Claim rewards!</Text>
      </View>
      <FlatList
        numColumns={2}
        columnWrapperStyle={{
          gap: 10,
          justifyContent: "center",
          marginBottom: 20,
        }}
        data={rewards}
        renderItem={(data: any) => {
          return (
            <RewardCard
              rewardId={data.item.id}
              amount={data.item.amount}
              description={data.item.description}
              imageUrl={data.item.image_url}
              name={data.item.name}
              quantity={data.item.quantity}
              sponsor={data.item.sponsor}
            />
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenTitleContainer: {
    backgroundColor: "#f2f4ff",
    marginTop: 10,
    marginBottom: 20,
    marginLeft: 15,
  },
  screenTitle: {
    fontWeight: "bold",
    fontSize: 28,
    color: "#000000",
  },
});
