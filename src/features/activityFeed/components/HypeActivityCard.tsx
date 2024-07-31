import React from "react";
import { StyleSheet, View } from "react-native";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import BasicText from "../../../components/Text/BasicText";
import Divider from "../../../components/Divider/Divider.tsx";

interface HypeActivityCardProps {
  senderUsername: string;
  recipientUsername: string;
  hypeReceived: number;
  hypeMessage: string;
}

export const HypeActivityCard = (props: HypeActivityCardProps) => {
  const { senderUsername, recipientUsername, hypeReceived, hypeMessage } =
    props;

  return (
    <View style={styles.container}>
      <View style={styles.announcementContainer}>
        <Entypo
          style={{ marginRight: 10 }}
          name="megaphone"
          size={25}
          color={"#be4b4b"}
        />
        <BasicText style={{ fontSize: 12 }}>
          <BasicText style={{ color: "#ff046d", fontFamily: "Poppins-Bold" }}>
            {senderUsername}
          </BasicText>
          <BasicText style={{ color: "#ff046d" }}> hyped </BasicText>
          <BasicText style={{ color: "#ff046d", fontFamily: "Poppins-Bold" }}>
            {recipientUsername}!
          </BasicText>
        </BasicText>
        <View style={styles.hypeReceivedContainer}>
          <BasicText style={{ color: "#ff046d", fontFamily: "Poppins-Bold" }}>
            {" "}
            {hypeReceived}
          </BasicText>
          <MaterialIcons
            name="local-fire-department"
            size={16}
            color={"#ff046d"}
          />
        </View>
      </View>

      {hypeMessage && (
        <View style={styles.messageContainer}>
          <Divider
            dividerStyle={{
              backgroundColor: "red",
              marginLeft: 14,
              marginRight: 14,
              marginTop: 4,
              marginBottom: 4,
              height: 0.3,
            }}
          />
          <BasicText
            style={{
              color:"#ff046d",
              fontSize: 14,
              textAlign: "center",
              paddingTop: 2,
            }}
          >
            "{hypeMessage}"
          </BasicText>
        </View>
      )}
    </View>
  );
};

export default HypeActivityCard;

const styles = StyleSheet.create({
  container: {
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
  announcementContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  messageContainer: {
    borderRadius: 20,
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: "center",
  },
});
