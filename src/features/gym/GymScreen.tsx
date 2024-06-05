import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
} from "react-native";

import MyStats from "./components/MyStats";
import MyTeam from "./components/MyTeam";
import useProfileStore from "../../stores/profileStore";
import { AcceptInvitation } from "../welcome/components/AcceptInvitation";
import { useMyTeam } from "./hooks/useMyTeam";
import useTeamStore from "../../stores/teamStore";
import images from "../../../assets";
import { AddMemberBottomSheet } from "../../components/BottomSheet/AddMemberBottomSheet/AddMemberBottomSheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import BasicText from "../../components/Text/BasicText";
import { useNavigation } from "@react-navigation/native";
import { useInviteMember } from "../welcome/hooks/useInviteMember.ts";

export default function GymScreen({ props }) {
  const {
    data: { me, subscription },
    operations: { getMeProfile, getTeamProfiles },
  } = useProfileStore();
  const {
    operations: { getMyTeam },
  } = useTeamStore();
  const {
    data: { canInvite },
  } = useMyTeam();

  const navigation = useNavigation<any>();
  const addMemberBottomSheetRef = useRef<BottomSheetModal>(null);

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = () => {
    try {
      setRefreshing(true);
      setTimeout(() => {
        getMeProfile().then((error) => {
          if (error) return;
          getTeamProfiles();
          getMyTeam();
        });
        setRefreshing(false);
      }, 1000);
    } catch (e) {
      console.error(e);
    }
  };

  const showAddMemberBottomSheet = () => {
    // Show purchase sub screen if user has not subscription
    if (!subscription || subscription.metadata.seats == 0) {
      navigation.navigate("SubscribeModal");
      return;
    }

    addMemberBottomSheetRef.current?.present();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        stickyHeaderIndices={[2]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <View>
            <ImageBackground
              style={styles.avatar}
              resizeMode="cover"
              source={require("../../../assets/mocks/fake-profile1.jpeg")}
            />
          </View>
          <View style={styles.titleContainer}>
            <BasicText style={styles.subtitle}>
              Let's spread appreciation,
            </BasicText>
            <BasicText style={styles.title}>{me.username} 💪</BasicText>
          </View>
          <View>
            <TouchableOpacity
              onPress={() => navigation.navigate("Notification")}
            >
              <Ionicons name="notifications" size={26} color="black" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.myStatsContainer}>
          <MyStats />
        </View>
        <View style={styles.teamsTitleContainer}>
          <BasicText style={styles.teamsTitle}>Your team</BasicText>
          <AcceptInvitation />
          {canInvite && (
            <TouchableOpacity onPress={showAddMemberBottomSheet}>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ImageBackground
                  style={styles.addMemberBtn}
                  source={images.add}
                />
                <View style={{ marginTop: 4 }}>
                  <BasicText style={{ color: "#808080" }}>Invite</BasicText>
                </View>
              </View>
            </TouchableOpacity>
          )}
        </View>
        <MyTeam />
        <AddMemberBottomSheet ref={addMemberBottomSheetRef} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 12,
    marginLeft: 12,
    marginRight: 12,
  },
  headerContainer: {
    marginTop: 30,
    alignItems: "center",
    flexDirection: "row",
  },
  subtitle: {
    fontSize: 12,
  },
  titleContainer: {
    marginTop: 10,
    flex: 1,
  },
  title: {
    fontFamily: "Poppins-Bold",
    color: "black",
    fontSize: 24,
    flexGrow: 1,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 50,
    overflow: "hidden",
    borderWidth: 4,
    borderColor: "white",
    marginRight: 8,
  },
  myStatsContainer: {
    marginTop: 20,
  },
  myTeamContainer: {
    height: "100%",
  },
  teamsTitleContainer: {
    backgroundColor: "#f2f4ff",
    paddingTop: 20,
    paddingBottom: 10,
  },
  teamsTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 22,
    color: "#000000",
    marginBottom: 6,
  },
  addMemberBtn: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
});
