import { FlatList, Image, StyleSheet, Text, View } from "react-native";

import images from "../../../assets";
import Avatar from "../../components/Avatar/Avatar";
import BasicText from "../../components/Text/BasicText";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";

interface HypeNotificationProps {
  donor: string;
  recipient: string;
  time: string;
  donorMessage: string;
  hypeReceived: number;
}

export default function HypeNotification(props: HypeNotificationProps) {
  const { donor, recipient, time, donorMessage, hypeReceived } = props;

  return (
    <>
      <View style={{ flexDirection: "row" }}>
        <View>
          <Avatar url={images.mockProfilePic1} sm />
        </View>

        <View style={{marginTop: 2}}>
          <View>
            <BasicText
              style={{
                color: "grey",
                marginRight: 4,
                fontSize: 10,
              }}
            >
              {" "}
              {time}
            </BasicText>
          </View>

          <View
            style={{
              ...styles.container,
              marginBottom: !donorMessage ? 24 : 0,
            }}
          >
            <View style={styles.detailsContainer}>
              <BasicText
                style={{
                  fontWeight: "bold",
                  fontSize: 12,
                  color: "#1f30fb",
                }}
              >
                {donor}
                {/*<BasicText*/}
                {/*  style={{*/}
                {/*    color: "grey",*/}
                {/*    marginRight: 4,*/}
                {/*    fontWeight: "normal",*/}
                {/*  }}*/}
                {/*>*/}
                {/*  {" "}*/}
                {/*  {time}*/}
                {/*</BasicText>*/}
              </BasicText>
              <BasicText style={{ fontSize: 12 }}> hyped </BasicText>
              <BasicText
                style={{
                  fontWeight: "bold",
                  fontSize: 12,
                  color: "#1f30fb",
                }}
              >
                {recipient}{" "}
              </BasicText>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: -2 }}
              >
                <BasicText
                  style={{ color: "red", fontWeight: "600", fontSize: 12 }}
                >
                  {" "}
                  {hypeReceived}{" "}
                </BasicText>
                <MaterialIcons
                  name="local-fire-department"
                  size={14}
                  color="#ff046d"
                />
              </View>
            </View>
          </View>
        </View>
      </View>

      {donorMessage && (
        <View style={styles.donorMessageContainer}>
          <View style={styles.donorMessagePointer} />
          <BasicText style={styles.donorMessage}>"{donorMessage}"</BasicText>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailsContainer: {
    flexDirection: "row",
    marginLeft: 2,
    width: "100%",
    flexGrow: 1,
  },
  hypeComboContainer: {
    marginLeft: 4,
  },
  displayName: {
    fontWeight: "bold",
    color: "#1f30fb",
  },
  defaultMessage: {},
  donorMessageContainer: {
    position: "relative",
    padding: 10,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    alignItems: "center",
    marginTop: 14,
    marginBottom: 16,
    marginLeft: 40,
    marginRight: 40,
  },
  donorMessage: {
    marginLeft: 6,
    fontSize: 12,
    fontStyle: "italic",
  },
  combo: {
    width: 34,
    height: 34,
  },
  donorMessagePointer: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderTopWidth: 0,
    borderRightWidth: 16,
    borderBottomWidth: 20,
    borderLeftWidth: 16,
    borderTopColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "white",
    borderLeftColor: "transparent",
    position: "absolute",
    bottom: 26,
    left: -1,
  },
});
