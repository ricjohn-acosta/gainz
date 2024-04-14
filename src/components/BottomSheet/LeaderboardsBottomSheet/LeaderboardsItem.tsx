import { Entypo, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import images from "../../../../assets";
import Avatar from "../../Avatar/Avatar";

interface LeaderboardItemProps {
  username: string;
  rank: number;
  hypeData: number;
  teamHasPoints?: boolean;
}

export const LeaderboardItem = (props: LeaderboardItemProps) => {
  const { username, rank, hypeData, teamHasPoints } = props;
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
          <Text style={styles.rank}>-</Text>
        )
      ) : (
        <Text style={styles.rank}>{teamHasPoints ? leaderboardRank : "-"}</Text>
      )}
      <View style={styles.item}>
        <Avatar md url={images.mockProfilePic1} />
        <Text style={styles.memberName}>{username}</Text>
      </View>
      <View>
        <View style={styles.giveHypeControls}>
          <Text style={styles.hypeToGiveCounter}>{hypeData}</Text>
          <MaterialIcons
            name="local-fire-department"
            size={30}
            color="#ff046d"
          />
        </View>
        <Text style={styles.receivedLabel}>Received</Text>
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
    fontSize: 16,
    marginLeft: 4,
  },
  giveHypeControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  hypeToGiveCounter: {
    marginLeft: 10,
    marginRight: 2,
    fontSize: 22,
    fontWeight: "bold",
  },
  receivedLabel: {
    textAlign: "center",
    fontWeight: "600",
  },
  trophyIcon: {
    width: 34,
    height: 34,
    marginRight: 4,
  },
  rank: {
    fontWeight: "bold",
    fontSize: 22,
    marginRight: 12,
    marginLeft: 12,
    fontStyle: "italic",
  },
});
