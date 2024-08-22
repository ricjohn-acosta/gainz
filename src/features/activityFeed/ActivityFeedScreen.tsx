import { FontAwesome, FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { ActivityCard } from "./components/ActivityCard";
import BasicBottomSheet from "../../components/BottomSheet/BasicBottomSheet";
import { GiveHypeBottomSheet } from "../../components/BottomSheet/GiveHypeBottomSheet/GiveHypeBottomSheet";
import { useIsFocused } from "@react-navigation/native";
import useProfileStore from "../../stores/profileStore";
import usePostStore from "../../stores/postStore";
import { useForm } from "react-hook-form";
import { BasicBottomSheetTextInput } from "../../components/Input/BasicBottomSheetTextInput";
import { PrimaryButton } from "../../components/Button/PrimaryButton";
import { postValidation } from "../../stores/posts/postValidation";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";
import HypeActivityCard from "./components/HypeActivityCard";
import RedeemActivityCard from "./components/RedeemActivityCard";
import BasicText from "../../components/Text/BasicText";
import { GeneralMessage } from "../../components/Message/GeneralMessage.tsx";
import { PhotosToUploadGallery } from "../uploaders/uploadImagesForPost/PhotosToUploadGallery.tsx";
import { useUploadPostImage } from "../uploaders/uploadImagesForPost/useUploadPostImage.ts";

export const ActivityFeedScreen = () => {
  const {
    data: { me },
    operations: { reloadProfile },
  } = useProfileStore();
  const {
    data: { teamPostsData },
    operations: { getTeamPosts, getTeamPostsTotalCount, createPost },
  } = usePostStore();
  const {
    getValues,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<any>();
  const {
    data: { photos },
    operations: { addPhoto, removePhoto, clearPhotos, uploadAllAssets },
  } = useUploadPostImage();

  const isFocused = useIsFocused();
  const giveHypeBottomSheetRef = useRef<BottomSheetModal>(null);
  const writePostBottomSheefRef = useRef<BottomSheetModal>(null);

  const [refreshing, setRefreshing] = useState(false);
  const [postCount, setPostCount] = useState(3);
  const [totalPostsCount, setTotalPostsCount] = useState<number | null>(null);
  const [isPosting, setIsPosting] = useState<boolean>(false);

  useEffect(() => {
    fetchTotalPostsCount();
  }, []);

  useEffect(() => {
    if (!me) return;
    if (teamPostsData && totalPostsCount === teamPostsData.length) {
      return;
    }

    getTeamPosts(0, postCount);
  }, [me, isFocused, postCount]);

  useEffect(() => {
    if (!isFocused) {
      giveHypeBottomSheetRef.current?.dismiss();
    }
  }, [isFocused]);

  const fetchTotalPostsCount = async () => {
    const count = await getTeamPostsTotalCount();
    setTotalPostsCount(count);
  };

  const showGiveHypeBottomSheet = useCallback(() => {
    giveHypeBottomSheetRef.current?.present();
  }, []);

  const showWritePostBottomSheet = useCallback(() => {
    writePostBottomSheefRef.current?.present();
  }, []);

  const hideWritePostBottomSheet = useCallback(() => {
    writePostBottomSheefRef.current?.dismiss();
    reset();
  }, []);

  const handleCreatePost = async () => {
    setIsPosting(true);
    if (getValues() && getValues("content")) {
      if (photos.length > 0) {
        uploadAllAssets().then(async (attachedAssets) => {
          const content = getValues("content");

          if (attachedAssets.some((asset) => asset == null)) {
            Alert.alert("Oops!", "Something went wrong uploading attachments!");
            return;
          }

          const res = await createPost(content, attachedAssets);

          if (res) Alert.alert("Oops!", "Something went wrong creating a post");
          setIsPosting(false);
          hideWritePostBottomSheet();
        });
      } else {
        const content = getValues("content");

        const res = await createPost(content, null);

        if (res) Alert.alert("Oops!", "Something went wrong creating a post");

        setIsPosting(false);
        hideWritePostBottomSheet();
      }
    }
  };

  const handleDismissWritePost = () => {
    reset();
    clearPhotos();
  };

  const onRefresh = () => {
    try {
      setRefreshing(true);
      setTimeout(() => {
        reloadProfile();
        setPostCount(3);
        setRefreshing(false);
      }, 1000);
    } catch (e) {
      console.error(e);
    }
  };

  const renderListHeader = useCallback(() => {
    return (
      <>
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            onPress={() => {
              showWritePostBottomSheet();
            }}
            style={styles.actionButton}
          >
            <View style={styles.actionButtonContent}>
              <BasicText style={{ color: "black", fontFamily: "Poppins-Bold" }}>
                Share post
              </BasicText>
              <FontAwesome
                style={{ marginLeft: 10 }}
                name="pencil-square-o"
                size={22}
                color="#1f30fb"
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              showGiveHypeBottomSheet();
              hideWritePostBottomSheet();
            }}
            style={styles.actionButton}
          >
            <View style={styles.actionButtonContent}>
              <BasicText style={{ color: "black", fontFamily: "Poppins-Bold" }}>
                Give Hype
              </BasicText>
              <MaterialIcons
                style={{ marginLeft: 4 }}
                name="local-fire-department"
                size={22}
                color="#ff046d"
              />
            </View>
          </TouchableOpacity>
        </View>
        {!teamPostsData ||
          (teamPostsData.length === 0 && (
            <GeneralMessage
              title={"No posts yet"}
              subtitle={"Share your progress, wins or loss!"}
            />
          ))}
      </>
    );
  });

  const renderActivityList = useCallback(
    (data) => {
      if (data.item.entityType === "redeemActivity") {
        return (
          <RedeemActivityCard
            redeemerId={data.item.redeemerId}
            redeemerUsername={data.item.redeemerUsername}
            rewardName={data.item.rewardName}
            amount={data.item.amount}
            datePosted={data.item.datePosted}
          />
        );
      }

      if (data.item.entityType === "hypeActivity") {
        return (
          <HypeActivityCard
            hypeReceived={data.item.hypeReceived}
            hypeMessage={data.item.hypeMessage}
            recipientId={data.item.recipientId}
            recipientUsername={data.item.recipientUsername}
            senderUsername={data.item.senderUsername}
            senderId={data.item.senderId}
            datePosted={data.item.datePosted}
          />
        );
      }

      return (
        <ActivityCard
          assets={data.item.assets}
          uid={data.item.profileId}
          likes={data.item.likes}
          postId={data.item.postId}
          posterDisplayName={data.item.username}
          avatar={data.item.avatar}
          datePosted={data.item.datePosted}
          content={data.item.content}
          replies={data.item.comments}
        />
      );
    },
    [teamPostsData],
  );

  const keyExtractor = useCallback((item) => item.postId, []);

  const handleEndReached = ({ distanceFromEnd }) => {
    if (distanceFromEnd === 0) return;
    setPostCount(postCount + 3);
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareFlatList
        keyExtractor={keyExtractor}
        extraData={teamPostsData}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        keyboardShouldPersistTaps
        enableResetScrollToCoords={false}
        extraScrollHeight={50}
        stickyHeaderIndices={[0]}
        onEndReachedThreshold={0.1}
        maxToRenderPerBatch={10}
        onEndReached={handleEndReached}
        ListHeaderComponent={renderListHeader}
        data={teamPostsData}
        renderItem={renderActivityList}
      />
      <BasicBottomSheet
        enablePanDownToClose={!isPosting}
        onDismiss={handleDismissWritePost}
        ref={writePostBottomSheefRef}
        _snapPoints={["60%"]}
      >
        <View style={{ padding: 20 }}>
          <BasicText style={styles.modalTitle}>Share a post ✏️</BasicText>
          <BasicBottomSheetTextInput
            maxLength={1000}
            name={"content"}
            errors={errors}
            control={control}
            rules={{ validate: postValidation, required: "Required" }}
            placeholder={"Share your progress, wins or loss!"}
            inputStyle={styles.modalInput}
            numberOfLines={50}
          />
          <View style={styles.modalCtaBtnContainer}>
            {isPosting ? (
              <ActivityIndicator size={"small"} />
            ) : (
              <>
                <TouchableOpacity onPress={addPhoto}>
                  <FontAwesome6 name="images" size={26} color="#32C732" />
                </TouchableOpacity>
                <PrimaryButton
                  disabled={Object.keys(errors).length !== 0}
                  onPress={handleSubmit(handleCreatePost)}
                  text={"Post"}
                />
              </>
            )}
          </View>

          <PhotosToUploadGallery
            photos={photos}
            handleRemovePhoto={removePhoto}
          />
        </View>
      </BasicBottomSheet>
      <GiveHypeBottomSheet ref={giveHypeBottomSheetRef} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: 12,
    marginRight: 12,
  },
  listHeader: {
    borderRadius: 25,
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  titleText: {
    color: "#000000",
    marginBottom: 10,
  },
  subtitleText: {
    color: "#ffffff",
  },
  actionButtonsContainer: {
    backgroundColor: "#f2f4ff",
    paddingBottom: 0,
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start", // if you want to fill rows left to right,
    gap: 6,
  },
  actionButton: {
    width: "49%",
  },
  actionButtonContent: {
    backgroundColor: "transparent",
    height: 40,
    padding: 8,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  modalTitle: {
    fontSize: 28,
    fontFamily: "Poppins-Bold",
  },
  modalInput: {
    height: 100,
    marginTop: 20,
    marginBottom: 10,
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#8d8d8d",
    fontSize: 16,
    padding: 8,
    backgroundColor: "#f2f4ff",
  },
  modalCtaBtnContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 10,
  },
  modalCtaBtn: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#1f30fb",
  },
  modalCtaBtnText: {
    marginRight: 8,
    textAlign: "center",
    fontWeight: "900",
    color: "white",
  },
});
