import { supabase } from "../../services/supabase.ts";
import useProfileStore from "../../stores/profileStore.ts";
import { Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import moment from "moment/moment";

export const useNotification = () => {
  const {
    data: { me },
  } = useProfileStore();

  const getNotifications = async () => {
    const { data, error } = await supabase
      .from("notifications")
      .select(`*`)
      .eq("recipient_id", me.id);

    if (error) {
      console.error(error);
      return error;
    }

    return mapNotificationToMessage(data);
  };

  const mapNotificationToMessage = (notifications) => {
    return notifications
      .sort(
        (a, b) =>
          moment(b.created_at).valueOf() - moment(a.created_at).valueOf(),
      )
      .map((notification) => {
        if (notification.event_name === "event_hype_received") {
          return {
            icon: notificationIcon(notification.event_name),
            // message: `You have received ${notification.details.hype_points_received} hype point${notification.details.hype_points_received > 1 ? "s" : ""} from ${notification.details.sender_username}`,
            message: (
              <Text>
                <Text>
                  You have received {notification.details.hype_points_received}{" "}
                  hype point
                  {notification.details.hype_points_received > 1 ? "s" : ""}
                </Text>{" "}
                from{" "}
                <Text style={{ fontFamily: "Poppins-Bold" }}>
                  {notification.details.sender_username}
                </Text>{" "}
                <Text style={{ color: "grey" }}>
                  - {moment(notification.created_at).fromNow(false)}
                </Text>
              </Text>
            ),
          };
        }

        return;
      });
  };

  const notificationIcon = (eventName) => {
    switch (eventName) {
      case "event_hype_received":
        return (
          <View
            style={{
              backgroundColor: "#ffebf3",
              borderRadius: 25,
              padding: 10,
            }}
          >
            <MaterialIcons
              name="local-fire-department"
              size={30}
              color="#ff046d"
            />
          </View>
        );
      default:
        return "";
    }
  };

  return {
    operations: {
      getNotifications,
    },
  };
};
