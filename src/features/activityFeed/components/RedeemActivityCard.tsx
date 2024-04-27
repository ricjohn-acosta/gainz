import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Entypo, MaterialIcons } from "@expo/vector-icons";

interface RedeemActivityCardProps {
  redeemerUsername: string;
  rewardName: string;
  amount: number;
}

export const RedeemActivityCard = (props: RedeemActivityCardProps) => {
  const { redeemerUsername, rewardName, amount } = props;

  return (
    <View style={styles.container}>
      <Entypo
        style={{ marginRight: 10 }}
        name="megaphone"
        size={25}
        color={"#9b8722"}
      />
      <Text>
        <Text style={{ color: "#c5a70a", fontWeight: "bold" }}>
          {redeemerUsername}
        </Text>
        <Text style={{ color: "#c5a70a" }}> redeemed </Text>
        <Text style={{ color: "#c5a70a", fontWeight: "bold" }}>
          {rewardName}!
        </Text>
      </Text>
    </View>
  );
};

export default RedeemActivityCard;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#fffcdc",
    borderRadius: 20,
    padding: 14,
  },
  hypeReceivedContainer: {
    marginLeft: 4,
    alignItems: "center",
    flexDirection: "row",
  },
});
