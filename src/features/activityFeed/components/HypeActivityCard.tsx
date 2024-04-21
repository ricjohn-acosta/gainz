import React from "react";
import { StyleSheet, Text, View } from "react-native";
import {Entypo, MaterialIcons} from "@expo/vector-icons";

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
      <Text>
        <Text style={{ color: "#ff046d", fontWeight: "bold" }}>
          {senderUsername}
        </Text>
        <Text style={{ color: "#ff046d" }}> hyped up </Text>
        <Text style={{ color: "#ff046d", fontWeight: "bold" }}>
          {recipientUsername}!
        </Text>
      </Text>
      <View style={styles.hypeReceivedContainer}>
          <Text style={{ color: "#ff046d", fontWeight: "bold" }}> {hypeReceived}</Text>
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
