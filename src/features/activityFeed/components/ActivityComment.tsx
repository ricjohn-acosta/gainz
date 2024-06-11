import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import Avatar from "../../../components/Avatar/Avatar";
import moment from "moment";
import { IconButton } from "../../../components/Button/IconButton";
import usePostStore from "../../../stores/postStore";
import useProfileStore from "../../../stores/profileStore";
import BasicText from "../../../components/Text/BasicText";

interface ActivityCommentProps {
  uid: string;
  likes: any;
  posterDisplayName: string;
  avatar: any;
  datePosted: string;
  content: string;
  commentId?: number;
}

export const ActivityComment = (props: ActivityCommentProps) => {
  const {
    uid,
    posterDisplayName,
    avatar,
    datePosted,
    content,
    commentId,
    likes,
  } = props;

  const {
    data: { me },
  } = useProfileStore();
  const {
    operations: { unlike, like },
  } = usePostStore();

  const [liked, setLiked] = useState<boolean>(
    !!likes.find((item) => item.profile_id === me.id),
  );

  const getRelativeTime = () => {
    return moment(datePosted).fromNow(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.postInfoContainer}>
        <View>
          <Avatar uid={uid} sm />
        </View>
        <View style={styles.nameAndDate}>
          <BasicText style={styles.displayName}>{posterDisplayName}</BasicText>
          <BasicText style={styles.datePosted}>{getRelativeTime()}</BasicText>
        </View>
        <View style={styles.likeContainer}>
          <View style={styles.likeBtn}>
            {!liked ? (
              <TouchableOpacity
                onPress={() => {
                  setLiked(true);
                  like(commentId, "comment");
                }}
              >
                <Ionicons name={"heart-outline"} size={18} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  setLiked(false);
                  unlike(commentId, "comment");
                }}
              >
                <Ionicons name={"heart-sharp"} size={18} color={"#ff0074"} />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.likeBtn}>
            <BasicText>{likes.length}</BasicText>
          </View>
        </View>
      </View>
      <View style={styles.postContent}>
        <BasicText>{content}</BasicText>
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
    fontFamily: "Poppins-Bold",
    color: "#000000",
    marginLeft: 4,
  },
  datePosted: {
    color: "grey",
    marginLeft: 4,
    fontSize: 12,
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
