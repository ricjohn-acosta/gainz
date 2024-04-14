import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { useEffect, useState } from "react";
import {
  RefreshControl,
  SafeAreaView,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import images from "../../../assets";
import Avatar from "../../components/Avatar/Avatar";
import BasicBottomSheet from "../../components/BottomSheet/BasicBottomSheet";
import { useSheet } from "../../components/BottomSheet/hooks/useSheet";
import Divider from "../../components/Divider/Divider";
import HypeNotification from "../notifications/HypeNotification";
import { PrimaryButton } from "../../components/Button/PrimaryButton";
import { useIsFocused } from "@react-navigation/native";
import useTeamStore from "../../stores/teamStore";
import useHypeStore from "../../stores/hypeStore";
import moment from "moment";

export default function ProfileScreen({ route }) {
  const { uid } = route.params;

  const {
    operations: { getMyTeam, getHypeRank, getMember },
  } = useTeamStore();
  const {
    operations: { getUserHypeActivity },
  } = useHypeStore();

  const { bottomSheetModalRef, showModal } = useSheet();
  const isFocused = useIsFocused();

  const [refresh, setRefresh] = useState<boolean>(false);
  const [hypeActivityListData, setHypeActivityListData] = useState<any>(null);

  useEffect(() => {
    getMyTeam();
    const username = getMember(uid)?.username;
    getUserHypeActivity(username).then((hypeActivityData) => {
      const formattedHypeActivityData = createListData(hypeActivityData);
      setHypeActivityListData(formattedHypeActivityData);
    });
  }, [uid, isFocused]);

  const createListData = (hypeActivityData) => {
    const result = [];

    const timestampConverted = hypeActivityData.map((item) => {
      const dateTimeObj = moment(item.created_at);
      const todayObj = moment().startOf("day");

      return {
        ...item,
        created_at: dateTimeObj.isSame(todayObj, "day")
          ? "Today"
          : moment(item.created_at).format("MMMM DD"),
        timestamp: item.created_at,
        time: dateTimeObj.format("h:mm a"),
      };
    });

    // First we group by date
    timestampConverted.forEach((activityItem) => {
      if (result.find((item) => item.date === activityItem.created_at)) return;
      result.push({
        date: activityItem.created_at,
        data: [],
        timestamp: activityItem.timestamp,
      });
    });

    // Second we group the activity by date
    timestampConverted.forEach((activityItem) => {
      const dateGroup = result.find(
        (item) => item.date === activityItem.created_at,
      );
      dateGroup.data.push(activityItem);
    });

    // Third we sort individual activity from most recent to latest
    result.forEach((item) =>
      item.data.sort(
        (a, b) => moment(b.timestamp).valueOf() - moment(a.timestamp).valueOf(),
      ),
    );

    return result.sort(
      (a, b) => moment(b.timestamp).valueOf() - moment(a.timestamp).valueOf(),
    );
  };

  const handleRefresh = () => {
    setRefresh(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Avatar url={images.mockProfilePic3} status="online" lg />
      </View>
      <View>
        <Text style={styles.displayName}>{getMember(uid)?.username}</Text>
      </View>
      <View style={styles.statContainer}>
        <View style={styles.halfCard}>
          <Text style={styles.counter}>{getMember(uid)?.hype_received}🔥</Text>
          <Text style={styles.label}>Received</Text>
        </View>
        <View style={styles.halfCard}>
          <Text style={styles.counter}>{getMember(uid)?.hype_given}🔥</Text>
          <Text style={styles.label}>Given</Text>
        </View>
        <View style={styles.halfCard}>
          <Text style={styles.counter}>{getHypeRank(uid)}🔥</Text>
          <Text style={styles.label}>Hype rank</Text>
        </View>
      </View>

      <TouchableOpacity onPress={showModal}>
        <View style={styles.hypeBtnContainer}>
          <Text style={styles.hypeBtnText}>Hype up {getMember(uid)?.username}!</Text>
        </View>
      </TouchableOpacity>
      <BasicBottomSheet ref={bottomSheetModalRef} _snapPoints={["50%"]}>
        <View style={{ padding: 20 }}>
          <Text style={styles.sendMessage}>Send Ricjohn a message 🔥</Text>
          <BottomSheetTextInput
            placeholder={`You're awesome. Keep it up!`}
            multiline
            numberOfLines={20}
            style={styles.sendMessageInput}
          />
          <View style={styles.sendBtnContainer}>
            <PrimaryButton text={"Send"} />
          </View>
        </View>
      </BasicBottomSheet>

      <Text style={styles.h2}>Activity</Text>
      <SafeAreaView style={styles.activityContainer}>
        <SectionList
          refreshControl={
            <RefreshControl refreshing={refresh} onRefresh={handleRefresh} />
          }
          scrollEnabled
          stickySectionHeadersEnabled={false}
          sections={hypeActivityListData ?? []}
          renderItem={({ item }: any) => {
            return (
              <>
                <HypeNotification
                  donor={item.sender_username}
                  recipient={item.recipient_username}
                  time={item.time}
                  donorMessage={item.hype_message}
                />
              </>
            );
          }}
          renderSectionHeader={({ section: { date } }) => {
            return <Divider title={date} />;
          }}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 12,
    height: "100%",
  },
  avatarContainer: {
    marginTop: 10,
    alignItems: "center",
  },
  statContainer: {
    marginTop: 10,
    flexDirection: "row",
    gap: 6,
    justifyContent: "center",
  },
  halfCard: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    width: "30%",
    borderRadius: 25,
    height: 90,
  },
  label: {
    color: "#888888D1",
    fontWeight: "600",
    fontSize: 12,
    marginTop: 2,
  },
  counter: {
    fontSize: 20,
    fontWeight: "900",
    color: "#000000",
  },
  displayName: {
    textAlign: "center",
    fontWeight: "bold",
    color: "#000000",
    fontSize: 28,
    flexGrow: 1,
    marginTop: 10,
  },
  h2: {
    fontWeight: "bold",
    fontSize: 22,
    color: "#000000",
    marginBottom: 10,
    marginTop: 14,
  },
  activityContainer: {
    flex: 1,
  },
  hypeBtnContainer: {
    marginTop: 20,
    backgroundColor: "#1f30fb",
    borderRadius: 25,
    padding: 14,
  },
  hypeBtnText: {
    textAlign: "center",
    color: "white",
    fontWeight: "900",
    fontSize: 16,
  },
  sendMessage: {
    fontSize: 28,
    fontWeight: "900",
  },
  sendMessageInput: {
    height: "50%",
    marginTop: 20,
    marginBottom: 10,
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#8d8d8d",
    fontSize: 16,
    lineHeight: 20,
    padding: 8,
    backgroundColor: "#f2f4ff",
  },
  sendBtnContainer: {
    display: "flex",
    width: "100%",
    alignItems: "flex-end",
  },
  sendBtn: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#1f30fb",
  },
  sendBtnText: {
    marginRight: 8,
    textAlign: "center",
    fontWeight: "900",
    color: "white",
  },
});
