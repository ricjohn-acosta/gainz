import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import Avatar from "../../../components/Avatar/Avatar";
import moment from "moment";
import { IconButton } from "../../../components/Button/IconButton";
import usePostStore from "../../../stores/postStore";
import useProfileStore from "../../../stores/profileStore";

interface ActivityCommentProps {
  likes: any;
  posterDisplayName: string;
  avatar: any;
  datePosted: string;
  content: string;
  commentId?: number;
}

export const ActivityComment = (props: ActivityCommentProps) => {
  const { posterDisplayName, avatar, datePosted, content, commentId, likes } =
    props;

  const {
    data: { me },
  } = useProfileStore();
  const {
    operations: { unlike, like },
  } = usePostStore();

  const [liked, setLiked] = useState<boolean>(
    !!likes.find((item) => item.profile_id === me.id),
  );
  const [commentLikesCount, setCommentLikesCount] = useState<number>(
    likes.length,
  );

  const getRelativeTime = () => {
    return moment(datePosted).fromNow(true);
  };

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
            {!liked ? (
              <TouchableOpacity
                onPress={() => {
                  setLiked(true);
                  like(commentId, "comment");
                  setCommentLikesCount(likes.length + 1);
                }}
              >
                <Ionicons name={"heart-outline"} size={18} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  setLiked(false);
                  unlike(commentId, "comment");
                  setCommentLikesCount(likes.length - 1);
                }}
              >
                <Ionicons name={"heart-sharp"} size={18} color={"#ff0074"} />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.likeBtn}>
            <Text>{likes.length}</Text>
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
