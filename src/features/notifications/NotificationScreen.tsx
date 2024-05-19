import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";
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
  const [refresh, setRefreshing] = useState<boolean>(false);

  const fetchNotifications = async () => {
    const results = await getNotifications();
    setNotifications(results);
  };

  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
    }, []),
  );

  const onRefresh = () => {
    try {
      setRefreshing(true);
      setTimeout(() => {
        fetchNotifications();
        setRefreshing(false);
      }, 1000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {!notifications ||
        (notifications.length === 0 && (
          <GeneralMessage title={"No notifications"} />
        ))}
      <FlatList
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
        }
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
