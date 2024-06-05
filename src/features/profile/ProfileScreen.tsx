import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  RefreshControl,
  SafeAreaView,
  SectionList,
  StyleSheet,
  Text,
  View,
} from "react-native";

import images from "../../../assets";
import Avatar from "../../components/Avatar/Avatar";
import Divider from "../../components/Divider/Divider";
import HypeNotification from "../notifications/HypeNotification";
import { PrimaryButton } from "../../components/Button/PrimaryButton";
import { useIsFocused } from "@react-navigation/native";
import useTeamStore from "../../stores/teamStore";
import useHypeStore from "../../stores/hypeStore";
import moment from "moment";
import useProfileStore from "../../stores/profileStore";
import { GiveHypeBottomSheet } from "../../components/BottomSheet/GiveHypeBottomSheet/GiveHypeBottomSheet";
import { MaterialIcons } from "@expo/vector-icons";
import BasicText from "../../components/Text/BasicText";
import { GeneralMessage } from "../../components/Message/GeneralMessage.tsx";
import { useMyTeam } from "../gym/hooks/useMyTeam.ts";

export default function ProfileScreen({ route }) {
  const { uid } = route.params;

  const {
    data: { me },
  } = useProfileStore();
  const {
    operations: { getMyTeam, getHypeRank, getMember },
  } = useTeamStore();
  const {
    operations: { getUserHypeActivity },
  } = useHypeStore();
  const {
    data: { hasNoHypePointsGiven },
  } = useMyTeam();

  const isFocused = useIsFocused();
  const giveHypeBottomSheetRef = useRef<BottomSheetModal>(null);

  const [refresh, setRefreshing] = useState<boolean>(false);
  const [hypeActivityListData, setHypeActivityListData] = useState<any>(null);

  useEffect(() => {
    if (!hypeActivityListData || hypeActivityListData.length === 0) {
      getMyTeam();
      const username = getMember(uid)?.username;

      if (!username) return;

      getUserHypeActivity(username).then((hypeActivityData) => {
        const formattedHypeActivityData = createListData(hypeActivityData);
        setHypeActivityListData(formattedHypeActivityData);
      });
    }
  }, [uid, isFocused]);

  const showGiveHypeBottomSheet = useCallback(() => {
    giveHypeBottomSheetRef.current?.present();
  }, []);

  const isMyProfile = () => {
    if (!me) return;
    return uid === me.id;
  };

  const displayHypeButton = () => {
    return !isMyProfile();
  };

  const onRefresh = () => {
    try {
      setRefreshing(true);
      setTimeout(() => {
        getMyTeam();
        const username = getMember(uid)?.username;

        if (!username) return;

        getUserHypeActivity(username).then((hypeActivityData) => {
          const formattedHypeActivityData = createListData(hypeActivityData);
          setHypeActivityListData(formattedHypeActivityData);
        });
        setRefreshing(false);
      }, 1000);
    } catch (e) {
      console.error(e);
    }
  };

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

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Avatar url={images.mockProfilePic3} status="online" lg />
      </View>
      <View>
        <BasicText style={styles.displayName}>
          {getMember(uid)?.username}
        </BasicText>
        {isMyProfile() && (
          <BasicText
            style={{ textAlign: "center", fontSize: 12, color: "grey" }}
          >
            (you)
          </BasicText>
        )}
      </View>
      <View style={styles.statContainer}>
        <View style={styles.halfCard}>
          <View style={{ flexDirection: "row" }}>
            <BasicText style={styles.counter}>
              {getMember(uid)?.hype_received}
            </BasicText>
            <MaterialIcons
              name="local-fire-department"
              size={24}
              color="#ff046d"
            />
          </View>
          <BasicText style={styles.label}>Received</BasicText>
        </View>
        <View style={styles.halfCard}>
          <View style={{ flexDirection: "row" }}>
            <BasicText style={styles.counter}>
              {getMember(uid)?.hype_given}
            </BasicText>
            <MaterialIcons
              name="local-fire-department"
              size={24}
              color="#ff046d"
            />
          </View>
          <BasicText style={styles.label}>Given</BasicText>
        </View>
        <View style={styles.halfCard}>
          <View style={{ flexDirection: "row" }}>
            <BasicText style={styles.counter}>
              {hasNoHypePointsGiven ? "-" : getHypeRank(uid)}
            </BasicText>
            <MaterialIcons
              name="local-fire-department"
              size={24}
              color="#ff046d"
            />
          </View>
          <BasicText style={styles.label}>Hype rank</BasicText>
        </View>
      </View>

      {displayHypeButton() && (
        <View style={styles.hypeBtnContainer}>
          <PrimaryButton
            onPress={showGiveHypeBottomSheet}
            text={`Hype up ${getMember(uid)?.username}!`}
          />
        </View>
      )}

      <BasicText style={styles.h2}>Activity</BasicText>

      {!hypeActivityListData ||
        (hypeActivityListData.length === 0 && (
          <View style={{ height: 150 }}>
            <GeneralMessage
              imageStyle={{ width: 200, height: 200 }}
              title={"No activity yet..."}
              subtitle={"It's quiet in here. Go hype people up!"}
            />
          </View>
        ))}

      <SafeAreaView style={styles.activityContainer}>
        <SectionList
          refreshControl={
            <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
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
                  hypeReceived={item.hype_points_received}
                />
              </>
            );
          }}
          renderSectionHeader={({ section: { date } }) => {
            return <Divider title={date} />;
          }}
        />
        <GiveHypeBottomSheet
          memberUsername={getMember(uid)?.username}
          ref={giveHypeBottomSheetRef}
          snapPoints={["65%"]}
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
    fontFamily: "Poppins-Bold",
    color: "#000000",
  },
  displayName: {
    textAlign: "center",
    fontFamily: "Poppins-Bold",
    color: "#000000",
    fontSize: 26,
    flexGrow: 1,
    marginTop: 10,
  },
  h2: {
    fontFamily: "Poppins-Bold",
    fontSize: 20,
    color: "#000000",
    marginBottom: 10,
    marginTop: 14,
  },
  activityContainer: {
    flex: 1,
  },
  hypeBtnContainer: {
    marginTop: 20,
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
