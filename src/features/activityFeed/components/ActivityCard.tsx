import { Entypo, FontAwesome, Ionicons } from "@expo/vector-icons";
import React, { useCallback, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { ActivityComment } from "./ActivityComment";
import Avatar from "../../../components/Avatar/Avatar";
import { IconButton } from "../../../components/Button/IconButton";
import { useForm } from "react-hook-form";
import { BasicTextInput } from "../../../components/Input/BasicTextInput";
import { commentValidation } from "../../../stores/posts/commentValidation";
import usePostStore from "../../../stores/postStore";
import moment from "moment";
import useProfileStore from "../../../stores/profileStore";
import BasicText from "../../../components/Text/BasicText";
import { useNavigation } from "@react-navigation/native";
import { AssetLoader } from "./postAsset/AssetLoader.tsx";
import { ActivitySettingsBottomsheet } from "./activitySettings/ActivitySettingsBottomsheet.tsx";
import useTeamStore from "../../../stores/teamStore.ts";

interface ActivityCardProps {
  uid: string;
  posterDisplayName: string;
  avatar: any;
  datePosted: string;
  content: string;
  replies: any;
  postId?: any;
  likes: any;
  assets: any;
}

export const ActivityCard = (props: ActivityCardProps) => {
  const {
    uid,
    posterDisplayName,
    datePosted,
    content,
    replies,
    postId,
    likes,
    assets,
  } = props;

  const {
    data: { me },
  } = useProfileStore();
  const {
    data: { meTeamData },
  } = useTeamStore();
  const {
    operations: { addComment, deletePost, unlike, like },
  } = usePostStore();
  const {
    getValues,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<any>();
  const navigation = useNavigation<any>();

  const [liked, setLiked] = useState<boolean>(
    !!likes.find((item) => item.profile_id === me.id),
  );
  const [showMenu, setShowMenu] = useState<boolean>(false);

  const canSeeMenu = () => {
    return (
      (me && me.id === uid) || (meTeamData && meTeamData.role === "leader")
    );
  };

  const handleAddComment = async () => {
    if (getValues() && getValues("comment")) {
      const content = getValues("comment");

      const res = await addComment(content, postId);
      reset();
      Keyboard.dismiss();
    }
  };

  const handleDeletePost = () => {
    Alert.alert("Delete post?", "Are you sure you want to delete this post?", [
      {
        text: "Cancel",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: () => {
          deletePost(postId, assets);
          setShowMenu(false);
        },
      },
    ]);
  };

  const renderActivityComment = useCallback(
    (data: any) => {
      return (
        <ActivityComment
          uid={data.item.profileId}
          likes={data.item.likes}
          posterDisplayName={data.item.username}
          avatar={data.item.avatar}
          datePosted={data.item.datePosted}
          content={data.item.content}
          commentId={data.item.commentId}
        />
      );
    },
    [replies],
  );

  const assetLoader = useMemo(() => {
    return <AssetLoader postId={postId} />;
  }, [postId, datePosted]);

  const keyExtractor = useCallback((item) => item.commentId, []);

  return (
    <View style={styles.container}>
      {canSeeMenu() && (
        <TouchableOpacity
          onPress={() => setShowMenu(true)}
          hitSlop={8}
          style={styles.menuIconContainer}
        >
          <Entypo name="dots-three-horizontal" size={18} color="black" />
        </TouchableOpacity>
      )}

      <View style={styles.postInfoContainer}>
        <View style={styles.postAvatar}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Profile", {
                uid: uid,
              })
            }
          >
            <Avatar uid={uid} md />
          </TouchableOpacity>
        </View>
        <View style={styles.postDetails}>
          <BasicText style={styles.displayName}>{posterDisplayName}</BasicText>
          <BasicText style={styles.datePosted}>
            {moment(datePosted).format("D MMM")}
          </BasicText>
        </View>
        <View style={styles.likeBtn}>
          {!liked ? (
            <TouchableOpacity
              hitSlop={8}
              onPress={() => {
                setLiked(true);
                like(postId, "post");
              }}
            >
              <Ionicons name={"heart-outline"} size={18} color={"#000000"} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                setLiked(false);
                unlike(postId, "post");
              }}
            >
              <Ionicons name={"heart-sharp"} size={18} color={"#ff0074"} />
            </TouchableOpacity>
          )}
          <View style={styles.likeBtn}>
            <BasicText>{likes.length}</BasicText>
          </View>
        </View>
      </View>
      <View style={styles.postContent}>
        <BasicText>{content}</BasicText>
        {assetLoader}
      </View>
      <View>
        <FlatList
          keyExtractor={keyExtractor}
          data={replies}
          renderItem={renderActivityComment}
        />
      </View>
      <View style={styles.textInputContainer}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Profile", {
              uid: me.id,
            })
          }
        >
          <Avatar uid={me.id} sm />
        </TouchableOpacity>
        <View style={styles.inputContainer}>
          <BasicTextInput
            multiline
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

      <ActivitySettingsBottomsheet
        handleDeletePost={handleDeletePost}
        open={showMenu}
        onDismiss={() => setShowMenu(false)}
      />
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
    fontFamily: "Poppins-Bold",
    color: "#000000",
    marginLeft: 4,
  },
  datePosted: {
    color: "grey",
    fontSize: 12,
    marginLeft: 4,
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
  menuIconContainer: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 10,
  },
});
