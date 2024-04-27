import React, { useCallback, useRef } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";

import { RewardCard } from "./components/RewardCard";
import { useFocusEffect } from "@react-navigation/native";
import useRewardStore from "../../stores/rewardStore";
import { MaterialIcons } from "@expo/vector-icons";
import useTeamStore from "../../stores/teamStore";

export default function RewardsScreen() {
  const {
    data: { rewards },
    operations: { getRewards },
  } = useRewardStore();
  const {
    data: { meTeamData },
  } = useTeamStore();

  useFocusEffect(
    useCallback(() => {
      getRewards();
    }, []),
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.screenTitleContainer}>
        <Text style={styles.screenTitle}>Claim rewards!</Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginRight: 16,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontWeight: "bold",
              fontSize: 16,
              marginTop: 4,
            }}
          >
            {meTeamData.hype_redeemable}
          </Text>
          <MaterialIcons
            name="local-fire-department"
            size={24}
            color="#ff046d"
          />
        </View>
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
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f2f4ff",
    marginTop: 10,
    marginBottom: 20,
    marginLeft: 15,
  },
  screenTitle: {
    fontWeight: "bold",
    fontSize: 22,
    color: "#000000",
  },
});
