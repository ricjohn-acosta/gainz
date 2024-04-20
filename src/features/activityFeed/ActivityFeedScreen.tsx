import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useCallback, useEffect, useRef } from "react";
import {
  FlatList,
  Keyboard,
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
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareFlatList
        keyboardShouldPersistTaps
        enableResetScrollToCoords={false}
        extraScrollHeight={50}
        stickyHeaderIndices={[0]}
        ListHeaderComponent={
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              onPress={() => {
                showWritePostBottomSheet();
              }}
              style={styles.actionButton}
            >
              <View style={styles.actionButtonContent}>
                <Text style={{ color: "black", fontWeight: "bold" }}>
                  Write post
                </Text>
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
                <Text style={{ color: "black", fontWeight: "bold" }}>
                  Give Hype
                </Text>
                <MaterialIcons
                  style={{ marginLeft: 4 }}
                  name="local-fire-department"
                  size={22}
                  color="#ff046d"
                />
              </View>
            </TouchableOpacity>
          </View>
        }
        data={teamPostsData}
        renderItem={(data: any) => {
          return (
            <ActivityCard
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
          <Text style={styles.modalTitle}>Write a post ✏️</Text>
          <BasicBottomSheetTextInput
            maxLength={1000}
            name={"content"}
            errors={errors}
            control={control}
            rules={{ validate: postValidation }}
            placeholder={
              "Share your challenges, successes or spread positivity!"
            }
            inputStyle={styles.modalInput}
            numberOfLines={20}
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
    fontWeight: "900",
  },
  modalInput: {
    height: 130,
    marginTop: 20,
    marginBottom: 10,
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#8d8d8d",
    fontSize: 16,
    lineHeight: 20,
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
