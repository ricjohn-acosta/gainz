import {Entypo, MaterialIcons} from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useRef } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import MyTeam from "./MyTeam";
import { GiveHypeBottomSheet } from "../../../components/BottomSheet/GiveHypeBottomSheet/GiveHypeBottomSheet";
import BasicText from "../../../components/Text/BasicText";
import useProfileStore from "../../../stores/profileStore";
import { LeaderboardsBottomSheet } from "../../../components/BottomSheet/LeaderboardsBottomSheet/LeaderboardsBottomSheet";
import { sortTeamBy } from "../../../helpers/teamSorter";
import useTeamStore from "../../../stores/teamStore";

export default function MyStats() {
  const {
    data: { me },
  } = useProfileStore();
  const {
    data: { meTeamData, myTeam },
  } = useTeamStore();

  const giveHypeBottomSheetRef = useRef<BottomSheetModal>(null);
  const leaderboardBottomSheetRef = useRef<BottomSheetModal>(null);

  const showGiveHypeBottomSheet = useCallback(() => {
    giveHypeBottomSheetRef.current?.present();
  }, []);

  const showLeaderboardBottomSheet = useCallback(() => {
    leaderboardBottomSheetRef.current?.present();
  }, []);

  const displayHypeRank = () => {
    if (!checkTeamHasPoints()) return "-";
    if (!myTeam) return 0;
    return (
      sortTeamBy("desc", "hype_received", myTeam).findIndex(
        (member) => member.profile_id === me.id,
      ) + 1
    );
  };

  const checkTeamHasPoints = () => {
    if (!myTeam) return;
    let result = false;
    myTeam.forEach((item: any) => {
      if (item.hype_received !== 0) {
        result = true;
      }
    });

    return result;
  };

  return (
    <>
      <LinearGradient
        colors={["#1f30fb", "#ffffff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 2, y: 2 }}
        style={styles.container}
      >
        <BasicText style={styles.title}>My Hype 📈</BasicText>
        <View style={styles.statsContainer}>
          <View style={styles.singleStatContainer}>
            <BasicText style={styles.counter}>
              {meTeamData ? meTeamData.hype_received : me.total_hype_received}
            </BasicText>
            <BasicText style={styles.label}>Received</BasicText>
          </View>
          <View style={styles.singleStatContainer}>
            <BasicText style={styles.counter}>
              {meTeamData ? meTeamData.hype_given : me.total_hype_given}
            </BasicText>
            <BasicText style={styles.label}>Given</BasicText>
          </View>
          <View style={styles.singleStatContainer}>
            <BasicText style={styles.counter}>
              {meTeamData ? meTeamData.hype_redeemable : 0}
            </BasicText>
            <BasicText style={styles.label}>Redeemable</BasicText>
          </View>
        </View>
      </LinearGradient>
      <View style={styles.halfCardContainer}>
        <TouchableOpacity
          style={styles.halfCard}
          onPress={showGiveHypeBottomSheet}
        >
          <View style={styles.leftContainer}>
            <MaterialIcons
              name="local-fire-department"
              size={32}
              color={"#ff046d"}
            />
          </View>
          <View style={styles.rightContainer}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <BasicText style={styles.subtitle}>Give Hype</BasicText>
              <Entypo name="chevron-small-right" size={20} color="grey" />
            </View>
            <BasicText style={{ fontSize: 26, color: "#ff046d", fontFamily: "Poppins-Bold" }}>
              {meTeamData ? meTeamData.hype_givable : "5"}
            </BasicText>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.halfCard}
          onPress={showLeaderboardBottomSheet}
        >
          <View style={{ ...styles.leftContainer, backgroundColor: "#fffcdc" }}>
            <MaterialIcons name="leaderboard" size={32} color={"#f6ce00"} />
          </View>
          <View style={styles.rightContainer}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <BasicText style={styles.subtitle}>Hype rank</BasicText>
              <Entypo name="chevron-small-right" size={20} color="grey" />
            </View>
            <BasicText style={{ fontSize: 26, color: "#eccb15", fontFamily: "Poppins-Bold" }}>
              {displayHypeRank()}
            </BasicText>
          </View>
        </TouchableOpacity>
      </View>
      <GiveHypeBottomSheet ref={giveHypeBottomSheetRef} />
      <LeaderboardsBottomSheet ref={leaderboardBottomSheetRef} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 25,
    height: 120,
    padding: 22,
  },
  title: {
    fontFamily: "Poppins-Bold",
    fontSize: 14,
    color: "white",
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "600",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 16,
  },
  singleStatContainer: {
    width: "33%",
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    color: "white",
  },
  counter: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    color: "white",
  },
  halfCardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
  },
  halfCard: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    width: "46%",
    borderRadius: 25,
    height: 90,
    padding: 16,
  },
  leftContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffebf3",
    borderRadius: 15,
    width: "40%",
    marginRight: 10,
  },
  rightContainer: {
    marginTop: 2,
    width: "100%",
  },
  icon: {
    fontSize: 26,
  },
  arrowIconContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
});
