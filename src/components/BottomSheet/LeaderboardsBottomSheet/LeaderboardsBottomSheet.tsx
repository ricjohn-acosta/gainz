import { Entypo, MaterialIcons } from "@expo/vector-icons";
import React, { forwardRef } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import BasicBottomSheet from "../BasicBottomSheet";
import useProfileStore from "../../../stores/profileStore";
import { LeaderboardItem } from "./LeaderboardsItem";
import { sortTeamBy } from "../../../helpers/teamSorter";
import useTeamStore from "../../../stores/teamStore";

interface LeaderboardsBottomSheetProps {}

export const LeaderboardsBottomSheet = forwardRef(
  (props: LeaderboardsBottomSheetProps, ref: any) => {
    const {
      data: { team },
    } = useProfileStore();
    const {
      data: { myTeam },
    } = useTeamStore();

    const sortedTeam = myTeam && sortTeamBy("desc", "hype_received", myTeam);

    // This is to check if no one in the team has received points yet at all
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
      <SafeAreaView>
        <BasicBottomSheet ref={ref} _snapPoints={["95%"]}>
          <View style={styles.container}>
            <View style={styles.headerContainer}>
              <Text style={styles.teamsTitle}>Leaderboards</Text>
            </View>

            <Text style={styles.subtitle}>See who gets the most Hype!</Text>
            <View style={styles.giveHypeItemContainer}>
              <FlatList
                data={sortedTeam}
                renderItem={(data) => {
                  return (
                    <LeaderboardItem
                      teamHasPoints={checkTeamHasPoints()}
                      username={data.item.username}
                      rank={data.index}
                      hypeData={data.item.hype_received}
                    />
                  );
                }}
              />
            </View>
          </View>
        </BasicBottomSheet>
      </SafeAreaView>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 12,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  hypeCounter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 50,
  },
  count: {
    marginTop: 2,
    fontWeight: "bold",
    fontSize: 16,
  },
  teamsTitle: {
    fontWeight: "bold",
    fontSize: 22,
    color: "#000000",
    marginBottom: 8,
  },
  subtitle: {
    color: "grey",
    marginBottom: 6,
  },
  giveHypeItemContainer: {
    flex: 1,
    marginTop: 10,
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
  hypeBtnViewContainer: {
    marginBottom: 20,
  },
});
