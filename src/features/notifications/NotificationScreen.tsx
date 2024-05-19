import React, { useCallback, useEffect, useState } from "react";
import { FlatList, SafeAreaView, StyleSheet, View } from "react-native";
import { NotificationCard } from "./components/NotificationCard.tsx";
import { useNotification } from "./useNotification.tsx";
import { LeaderboardItem } from "../../components/BottomSheet/LeaderboardsBottomSheet/LeaderboardsItem.tsx";
import { useFocusEffect } from "@react-navigation/native";
import { GeneralMessage } from "../../components/Message/GeneralMessage.tsx";

export const NotificationScreen = () => {
  const {
    operations: { getNotifications },
  } = useNotification();

  const [notifications, setNotifications] = useState(undefined);

  useFocusEffect(
    useCallback(() => {
      const fetchNotifications = async () => {
        const results = await getNotifications();
        setNotifications(results);
      };

      fetchNotifications();
    }, []),
  );

  return (
    <SafeAreaView style={styles.container}>
      {!notifications ||
        (notifications.length === 0 && <GeneralMessage title={'No notifications'}/>)}
      <FlatList
        data={notifications ?? []}
        renderItem={(data) => {
          return (
            <NotificationCard
              icon={data.item.icon}
              message={data.item.message}
            />
          );
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 12,
    height: "100%",
  },
});
