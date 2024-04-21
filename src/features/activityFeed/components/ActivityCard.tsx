import { AntDesign, Entypo, FontAwesome, Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { ActivityComment } from "./ActivityComment";
import images from "../../../../assets";
import Avatar from "../../../components/Avatar/Avatar";
import { PrimaryButton } from "../../../components/Button/PrimaryButton";
import { IconButton } from "../../../components/Button/IconButton";
import { useForm } from "react-hook-form";
import { BasicTextInput } from "../../../components/Input/BasicTextInput";
import { commentValidation } from "../../../stores/posts/commentValidation";
import usePostStore from "../../../stores/postStore";
import moment from "moment";
import useProfileStore from "../../../stores/profileStore";

interface ActivityCardProps {
  posterDisplayName: string;
  avatar: any;
  datePosted: string;
  content: string;
  replies: any;
  postId?: any;
  likes: any;
}

export const ActivityCard = (props: ActivityCardProps) => {
  const {
    posterDisplayName,
    avatar,
    datePosted,
    content,
    replies,
    postId,
    likes,
  } = props;

  const {
    data: { me },
  } = useProfileStore();
  const {
    data: { teamPostsData },
    operations: { addComment, unlike, like },
  } = usePostStore();
  const {
    getValues,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<any>();

  const [liked, setLiked] = useState<boolean>(
    !!likes.find((item) => item.profile_id === me.id),
  );
  const [postLikesCount, setPostLikesCount] = useState<number>(likes.length);

  console.log(content, likes.length, postLikesCount);
  const handleAddComment = async () => {
    if (getValues() && getValues("comment")) {
      const content = getValues("comment");

      const res = await addComment(content, postId);
      reset();
      Keyboard.dismiss();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.postInfoContainer}>
        <View style={styles.postAvatar}>
          <Avatar md url={avatar} />
        </View>
        <View style={styles.postDetails}>
          <Text style={styles.displayName}>{posterDisplayName}</Text>
          <Text style={styles.datePosted}>
            {moment(datePosted).format("D MMM")}
          </Text>
        </View>
        <View style={styles.likeBtn}>
          {!liked ? (
            <TouchableOpacity
              onPress={() => {
                setLiked(true);
                like(postId, "post");
                setPostLikesCount(likes.length + 1);
              }}
            >
              <Ionicons name={"heart-outline"} size={18} color={"#000000"} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                setLiked(false);
                unlike(postId, "post");
                setPostLikesCount(likes.length - 1);
              }}
            >
              <Ionicons name={"heart-sharp"} size={18} color={"#ff0074"} />
            </TouchableOpacity>
          )}
          <View style={styles.likeBtn}>
            <Text>{likes.length}</Text>
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
                likes={data.item.likes}
                posterDisplayName={data.item.username}
                avatar={data.item.avatar}
                datePosted={data.item.datePosted}
                content={data.item.content}
                commentId={data.item.commentId}
              />
            );
          }}
        />
      </View>
      <View style={styles.textInputContainer}>
        <Avatar sm url={images.mockProfilePic1} />
        <View style={styles.inputContainer}>
          <BasicTextInput
            multiline={true}
            style={styles.textInput}
            name={"comment"}
            control={control}
            rules={{ validate: commentValidation }}
            placeholder={"Write a comment"}
            errors={errors}
          />
          <View style={styles.commentBtnContainer}>
            <IconButton
              disabled={!watch("comment") || Object.keys(errors).length !== 0}
              onPress={handleSubmit(handleAddComment)}
              IconComponent={FontAwesome}
              iconProps={{
                name: "send",
                size: 18,
                defaultColor: "#1f30fb",
                pressedColor: "#8e97ff",
              }}
            />
          </View>
        </View>
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
  commentBtnContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  inputContainer: {
    flex: 1,
    backgroundColor: "#f2f4ff",
    flexDirection: "row",
    borderRadius: 20,
  },
  textInputContainer: {
    marginTop: 20,
    flexDirection: "row",
  },
  textInput: {
    flex: 1,
    backgroundColor: "#f2f4ff",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 10,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 10,
  },
  likeBtn: {
    justifyContent: "center",
    alignItems: "center",
  },
});
