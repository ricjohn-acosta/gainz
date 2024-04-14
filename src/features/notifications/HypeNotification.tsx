import { FlatList, Image, StyleSheet, Text, View } from "react-native";

import images from "../../../assets";
import Avatar from "../../components/Avatar/Avatar";

interface HypeNotificationProps {
  donor: string;
  recipient: string;
  time: string;
  donorMessage: string;
}

export default function HypeNotification(props: HypeNotificationProps) {
  const { donor, recipient, time, donorMessage } = props;

  return (
    <>
      <View
        style={{ ...styles.container, marginBottom: !donorMessage ? 24 : 0 }}
      >
        <Avatar url={images.mockProfilePic1} sm />
        <View style={styles.detailsContainer}>
          <Text
            style={{
              fontWeight: "bold",
              color: "#1f30fb",
            }}
          >
            {donor}
            <Text style={{ color: "black", fontWeight: "normal" }}>
              {" "}
              hyped up{" "}
            </Text>
            {recipient}
            <Text
              style={{
                color: "grey",
                marginRight: 4,
                fontWeight: "normal",
              }}
            >
              {" "}
              {time}
            </Text>
          </Text>
        </View>
      </View>
      {donorMessage && (
        <View style={styles.donorMessageContainer}>
          <Text style={styles.donorMessage}>{donorMessage}</Text>
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
    marginLeft: 2,
    width: 0,
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
    marginTop: 10,
    marginBottom: 24,
  },
  donorMessage: {
    marginLeft: 6,
    fontSize: 14,
    fontStyle: "italic",
  },
  combo: {
    width: 34,
    height: 34,
  },
});
