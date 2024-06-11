import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useCallback, useEffect, useRef } from "react";
import {
  FlatList,
  Keyboard,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { ActivityCard } from "./components/ActivityCard";
import images from "../../../assets";
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

export const ActivityFeedScreen = () => {
  const {
    data: { me },
  } = useProfileStore();
  const {
    data: { teamPostsData },
    operations: { getTeamPosts, createPost },
  } = usePostStore();
  const {
    getValues,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<any>();

  const isFocused = useIsFocused();
  const giveHypeBottomSheetRef = useRef<BottomSheetModal>(null);
  const writePostBottomSheefRef = useRef<BottomSheetModal>(null);

  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    if (!me) return;
    getTeamPosts();
  }, [me, isFocused]);

  const showGiveHypeBottomSheet = useCallback(() => {
    giveHypeBottomSheetRef.current?.present();
  }, []);

  const showWritePostBottomSheet = useCallback(() => {
    writePostBottomSheefRef.current?.present();
  }, []);

  const hideWritePostBottomSheet = useCallback(() => {
    writePostBottomSheefRef.current?.dismiss();
  }, []);

  const handleCreatePost = async () => {
    if (getValues() && getValues("content")) {
      const content = getValues("content");

      const res = await createPost(content);
      hideWritePostBottomSheet();
    }
  };

  const onRefresh = () => {
    try {
      setRefreshing(true);
      setTimeout(() => {
        getTeamPosts();
        setRefreshing(false);
      }, 1000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareFlatList
        extraData={teamPostsData}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        keyboardShouldPersistTaps
        enableResetScrollToCoords={false}
        extraScrollHeight={50}
        stickyHeaderIndices={[0]}
        ListHeaderComponent={
          <>
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity
                onPress={() => {
                  showWritePostBottomSheet();
                }}
                style={styles.actionButton}
              >
                <View style={styles.actionButtonContent}>
                  <BasicText
                    style={{ color: "black", fontFamily: "Poppins-Bold" }}
                  >
                    Write post
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
                  <BasicText
                    style={{ color: "black", fontFamily: "Poppins-Bold" }}
                  >
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
                  subtitle={
                    "Share your successes, challenges or spread positivity!"
                  }
                />
              ))}
          </>
        }
        data={teamPostsData}
        renderItem={(data: any) => {
          if (data.item.entityType === "redeemActivity") {
            return (
              <RedeemActivityCard
                redeemerUsername={data.item.redeemerUsername}
                rewardName={data.item.rewardName}
                amount={data.item.amount}
              />
            );
          }

          if (data.item.entityType === "hypeActivity") {
            return (
              <HypeActivityCard
                hypeReceived={data.item.hypeReceived}
                recipientUsername={data.item.recipientUsername}
                senderUsername={data.item.senderUsername}
              />
            );
          }

          return (
            <ActivityCard
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
        }}
      />
      <BasicBottomSheet ref={writePostBottomSheefRef} _snapPoints={["50%"]}>
        <View style={{ padding: 20 }}>
          <BasicText style={styles.modalTitle}>Write a post ✏️</BasicText>
          <BasicBottomSheetTextInput
            maxLength={1000}
            name={"content"}
            errors={errors}
            control={control}
            rules={{ validate: postValidation, required: "Required" }}
            placeholder={
              "Share your successes, challenges or spread positivity!"
            }
            inputStyle={styles.modalInput}
            numberOfLines={50}
          />
          <View style={styles.modalCtaBtnContainer}>
            <PrimaryButton
              disabled={Object.keys(errors).length !== 0}
              onPress={handleSubmit(handleCreatePost)}
              text={"Post"}
            />
          </View>
        </View>
      </BasicBottomSheet>
      <GiveHypeBottomSheet ref={giveHypeBottomSheetRef} />
    </SafeAreaView>
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
    display: "flex",
    width: "100%",
    alignItems: "flex-end",
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
