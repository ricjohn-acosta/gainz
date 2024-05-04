import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import BasicText from "../../../components/Text/BasicText";

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
      <BasicText style={{fontSize: 12}}>
        <BasicText style={{ color: "#c5a70a", fontWeight: "bold" }}>
          {redeemerUsername}
        </BasicText>
        <BasicText style={{ color: "#c5a70a" }}> redeemed </BasicText>
        <BasicText style={{ color: "#c5a70a", fontWeight: "bold" }}>
          {rewardName}!
        </BasicText>
      </BasicText>
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
