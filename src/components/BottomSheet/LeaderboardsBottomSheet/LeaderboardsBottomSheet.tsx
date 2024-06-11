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
import BasicText from "../../Text/BasicText";
import { GeneralMessage } from "../../Message/GeneralMessage.tsx";

interface LeaderboardsBottomSheetProps {}

export const LeaderboardsBottomSheet = forwardRef(
  (props: LeaderboardsBottomSheetProps, ref: any) => {
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
              <BasicText style={styles.teamsTitle}>Leaderboards</BasicText>
            </View>

            <BasicText style={styles.subtitle}>
              See who gets the most hype!
            </BasicText>
            {!sortedTeam ||
              // the owner of the team is included in the team so show message if no other member is in the team
              (sortedTeam.length <= 1 && (
                <GeneralMessage
                  title={"No team members"}
                  subtitle={"Invite members and see who gets the most hype!"}
                />
              ))}
            <View style={styles.giveHypeItemContainer}>
              <FlatList
                data={sortedTeam?.length <= 1 ? [] : sortedTeam}
                renderItem={(data) => {
                  return (
                    <LeaderboardItem
                      teamHasPoints={checkTeamHasPoints()}
                      uid={data.item.profile_id}
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
    fontFamily: "Poppins-Bold",
    fontSize: 16,
  },
  teamsTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 22,
    color: "#000000",
    marginBottom: 2,
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
