import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { useState } from "react";
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

export default function ProfileScreen() {
  const { bottomSheetModalRef, showModal } = useSheet();
  const [refresh, setRefresh] = useState<boolean>(false);

  const mockData = [
    {
      date: "Yesterday",
      data: [
        {
          donor: "Georgia",
          recipient: "Aiza",
          time: "8:53 PM",
          donorMessage: "Well done for finishing chest day :)",
        },
        {
          donor: "Georgia",
          recipient: "Aiza",
          time: "7:12 PM",
          donorMessage: "Good bench press form!",
        },
      ],
    },
    {
      date: "February 14",
      data: [
        {
          donor: "Georgia",
          recipient: "Aiza",
          time: "11:02 AM",
          donorMessage: "thank you for turning up for a HIIT session!",
        },
        {
          donor: "Georgia",
          recipient: "Aiza",
          time: "10:30 AM",
          donorMessage: "For finishing cardio :)",
        },
        {
          donor: "Georgia",
          recipient: "Aiza",
          time: "9:54 AM",
          donorMessage: "an hour to go!",
        },
        {
          donor: "Georgia",
          recipient: "Aiza",
          time: "9:34 AM",
          donorMessage: `Here's to a fun HIIT session`,
        },
      ],
    },
  ];

  const handleRefresh = () => {
    setRefresh(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Avatar url={images.mockProfilePic3} status="online" lg />
      </View>
      <View>
        <Text style={styles.displayName}>Aiza</Text>
      </View>
      <View style={styles.statContainer}>
        <View style={styles.halfCard}>
          <Text style={styles.counter}>1230🔥</Text>
          <Text style={styles.label}>Received</Text>
        </View>
        <View style={styles.halfCard}>
          <Text style={styles.counter}>321🔥</Text>
          <Text style={styles.label}>Given</Text>
        </View>
        <View style={styles.halfCard}>
          <Text style={styles.counter}>6🔥</Text>
          <Text style={styles.label}>Hype rank</Text>
        </View>
      </View>

      <TouchableOpacity onPress={showModal}>
        <View style={styles.hypeBtnContainer}>
          <Text style={styles.hypeBtnText}>Hype up Aiza!</Text>
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
          sections={mockData}
          renderItem={({ item }: any) => {
            return (
              <>
                <HypeNotification
                  donor={item.donor}
                  recipient={item.recipient}
                  time={item.time}
                  donorMessage={item.donorMessage}
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
