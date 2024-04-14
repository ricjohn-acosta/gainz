import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";

import { ActivityComment } from "./ActivityComment";
import images from "../../../../assets";
import Avatar from "../../../components/Avatar/Avatar";

interface ActivityCardProps {
  posterDisplayName: string;
  avatar: any;
  datePosted: string;
  content: string;
  replies: any;
}

export const ActivityCard = (props: ActivityCardProps) => {
  const { posterDisplayName, avatar, datePosted, content, replies } = props;
  return (
    <View style={styles.container}>
      <View style={styles.postInfoContainer}>
        <View style={styles.postAvatar}>
          <Avatar md url={avatar} />
        </View>
        <View style={styles.postDetails}>
          <Text style={styles.displayName}>{posterDisplayName}</Text>
          <Text style={styles.datePosted}>{datePosted}</Text>
        </View>
        <View style={styles.likeBtn}>
          <Ionicons name="heart-outline" size={18} color="black" />
          <View style={styles.likeBtn}>
            <Text>11</Text>
          </View>
        </View>
      </View>
      <View style={styles.postContent}>
        <Text>{content}</Text>
      </View>
      <View>
        <FlatList
          data={replies}
          renderItem={(data: any) => {
            return (
              <ActivityComment
                posterDisplayName={data.item.posterDisplayName}
                avatar={data.item.avatar}
                datePosted={data.item.datePosted}
                content={data.item.content}
                replies={data.item.replies}
              />
            );
          }}
        />
      </View>
      <View style={styles.textInputContainer}>
        <Avatar sm url={images.mockProfilePic1} />
        <TextInput placeholder="Write a comment..." style={styles.textInput} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#ffffff",
    borderRadius: 25,
    padding: 30,
  },
  postInfoContainer: {
    flex: 1,
    flexDirection: "row",
  },
  postAvatar: {},
  postDetails: {
    flex: 1,
    paddingTop: 8,
  },
  postContent: {
    marginTop: 10,
    paddingBottom: 20,
    borderStyle: "solid",
    borderBottomWidth: 1,
    borderColor: "#f2f4ff",
  },
  displayName: {
    fontWeight: "bold",
    color: "#000000",
  },
  datePosted: {
    color: "grey",
  },
  textInputContainer: {
    marginTop: 20,
    flexDirection: "row",
  },
  textInput: {
    flex: 1,
    backgroundColor: "#f2f4ff",
    borderRadius: 25,
    padding: 6,
  },
  likeBtn: {
    justifyContent: "center",
    alignItems: "center",
  },
});
