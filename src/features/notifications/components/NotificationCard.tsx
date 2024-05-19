import { StyleSheet, View } from "react-native";
import BasicText from "../../../components/Text/BasicText.tsx";

interface NotificationCardProps {
  icon?: any;
  message?: any;
}

export const NotificationCard = (props: NotificationCardProps) => {
  const { icon, message } = props;
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>{icon}</View>
      <View style={styles.messageContainer}>
        <BasicText>{message}</BasicText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginBottom: 20,
  },
  iconContainer: {
    marginRight: 10,
  },
  messageContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  }
});
