import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import Avatar from "../../../components/Avatar/Avatar";
import moment from "moment";

interface ActivityCommentProps {
  posterDisplayName: string;
  avatar: any;
  datePosted: string;
  content: string;
}

export const ActivityComment = (props: any) => {
  const { posterDisplayName, avatar, datePosted, content } = props;

  const getRelativeTime = () => {
    return moment(datePosted).fromNow(true);
  }

  return (
    <View style={styles.container}>
      <View style={styles.postInfoContainer}>
        <View>
          <Avatar sm url={avatar} />
        </View>
        <View style={styles.nameAndDate}>
          <Text style={styles.displayName}>{posterDisplayName}</Text>
          <Text style={styles.datePosted}>{getRelativeTime()}</Text>
        </View>
        <View style={styles.likeContainer}>
          <View style={styles.likeBtn}>
            <Ionicons name="heart-outline" size={18} color="black" />
          </View>
          <View style={styles.likeBtn}>
            <Text>2</Text>
          </View>
        </View>
      </View>
      <View style={styles.postContent}>
        <Text>{content}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  postInfoContainer: {
    marginTop: 20,
    flex: 1,
    flexDirection: "row",
  },
  displayName: {
    fontWeight: "bold",
    color: "#000000",
    marginLeft: 4,
  },
  datePosted: {
    color: "grey",
    marginLeft: 4,
  },
  nameAndDate: {
    flex: 1,
  },
  postContent: {
    marginTop: 10,
  },
  likeContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  likeBtn: {
    justifyContent: "center",
  },
});
