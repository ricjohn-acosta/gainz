import { Entypo, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import images from "../../../../assets";
import Avatar from "../../Avatar/Avatar";
import BasicText from "../../Text/BasicText";

interface LeaderboardItemProps {
  uid: string;
  username: string;
  rank: number;
  hypeData: number;
  teamHasPoints?: boolean;
}

export const LeaderboardItem = (props: LeaderboardItemProps) => {
  const { uid, username, rank, hypeData, teamHasPoints } = props;
  const leaderboardRank = rank + 1;
  const isLeader = leaderboardRank === 1;

  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: isLeader && teamHasPoints ? "#c6ceff" : "#f2f4ff",
      }}
    >
      {isLeader ? (
        teamHasPoints ? (
          <Image style={styles.trophyIcon} source={images.trophy} />
        ) : (
          <BasicText style={styles.rank}>-</BasicText>
        )
      ) : (
        <BasicText style={styles.rank}>
          {teamHasPoints ? leaderboardRank : "-"}
        </BasicText>
      )}
      <View style={styles.item}>
        <Avatar uid={uid} md />
        <BasicText style={styles.memberName}>{username}</BasicText>
      </View>
      <View>
        <View style={styles.giveHypeControls}>
          <BasicText style={styles.hypeToGiveCounter}>{hypeData}</BasicText>
          <MaterialIcons
            name="local-fire-department"
            size={30}
            color="#ff046d"
          />
        </View>
        <BasicText style={styles.receivedLabel}>Received</BasicText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "#f2f4ff",
    padding: 12,
    borderRadius: 25,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    flexGrow: 1,
  },
  memberName: {
    fontSize: 14,
    marginLeft: 4,
  },
  giveHypeControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  hypeToGiveCounter: {
    marginLeft: 10,
    marginRight: 2,
    fontSize: 20,
    fontFamily: "Poppins-Bold",
  },
  receivedLabel: {
    textAlign: "center",
  },
  trophyIcon: {
    width: 34,
    height: 34,
    marginRight: 4,
  },
  rank: {
    fontFamily: "Poppins-Bold",
    fontSize: 22,
    marginRight: 12,
    marginLeft: 12,
    fontStyle: "italic",
  },
});
