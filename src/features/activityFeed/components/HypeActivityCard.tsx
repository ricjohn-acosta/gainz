import React from "react";
import { StyleSheet, Text, View } from "react-native";
import {Entypo, MaterialIcons} from "@expo/vector-icons";
import BasicText from "../../../components/Text/BasicText";

interface HypeActivityCardProps {
  senderUsername: string;
  recipientUsername: string;
  hypeReceived: number;
}

export const HypeActivityCard = (props: HypeActivityCardProps) => {
  const { senderUsername, recipientUsername, hypeReceived } = props;

  return (
    <View style={styles.container}>
      <Entypo style={{marginRight: 10}} name="megaphone" size={25} color={"#be4b4b"} />
      <BasicText style={{fontSize: 12}}>
        <BasicText style={{ color: "#ff046d", fontWeight: "bold" }}>
          {senderUsername}
        </BasicText>
        <BasicText style={{ color: "#ff046d" }}> hyped </BasicText>
        <BasicText style={{ color: "#ff046d", fontWeight: "bold" }}>
          {recipientUsername}!
        </BasicText>
      </BasicText>
      <View style={styles.hypeReceivedContainer}>
          <BasicText style={{ color: "#ff046d", fontWeight: "bold" }}> {hypeReceived}</BasicText>
        <MaterialIcons
          name="local-fire-department"
          size={16}
          color={"#ff046d"}
        />
      </View>
    </View>
  );
};

export default HypeActivityCard;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#ffebf3",
    borderRadius: 20,
    padding: 14,
  },
  hypeReceivedContainer: {
    marginLeft: 4,
    alignItems: "center",
    flexDirection: "row",
  },
});
