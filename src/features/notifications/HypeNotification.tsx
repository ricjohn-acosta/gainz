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
      <View style={styles.container}>
        <Avatar url={images.mockProfilePic1} sm />
        <Text style={styles.time}>{time}</Text>
        <View style={styles.container}>
          <Text style={styles.displayName}>{donor}</Text>
          <Text style={styles.defaultMessage}> hyped up </Text>
          <Text style={styles.displayName}>{recipient}!</Text>
        </View>
        <View style={styles.hypeComboContainer}>
          <Image style={styles.combo} source={images.x5Combo} />
        </View>
      </View>
      <View style={styles.donorMessageContainer}>
        <Text style={styles.donorMessage}>{donorMessage}</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
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
    fontSize: 14,
    fontStyle: "italic",
  },
  combo: {
    width: 34,
    height: 34,
  },
  time: {
    color: "grey",
    marginRight: 4,
  },
});
