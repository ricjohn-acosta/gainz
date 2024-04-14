import {
  FontAwesome,
  MaterialIcons,
  FontAwesome5,
  Ionicons,
} from "@expo/vector-icons";
import { BottomSheetModal, BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useRef } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { ActivityCard } from "./components/ActivityCard";
import images from "../../../assets";
import Avatar from "../../components/Avatar/Avatar";
import BasicBottomSheet from "../../components/BottomSheet/BasicBottomSheet";
import { GiveHypeBottomSheet } from "../../components/BottomSheet/GiveHypeBottomSheet/GiveHypeBottomSheet";
import { useSheet } from "../../components/BottomSheet/hooks/useSheet";

export const ActivityFeedScreen = () => {
  const { bottomSheetModalRef, showModal } = useSheet();
  const giveHypeBottomSheetRef = useRef<BottomSheetModal>(null);
  const writePostBottomSheefRef = useRef<BottomSheetModal>(null);

  const showGiveHypeBottomSheet = useCallback(() => {
    giveHypeBottomSheetRef.current?.present();
  }, []);

  const showWritePostBottomSheet = useCallback(() => {
    writePostBottomSheefRef.current?.present();
  }, []);

  const hideWritePostBottomSheet = useCallback(() => {
    writePostBottomSheefRef.current?.dismiss();
  }, []);

  const mockData = [
    {
      posterDisplayName: "Maicie",
      avatar: images.mockProfilePic4,
      datePosted: "14 February",
      content: `Who's coming in today?`,
      replies: [
        {
          posterDisplayName: "Aiza",
          avatar: images.mockProfilePic3,
          datePosted: "12h",
          content: "yup, gonna train legs!",
          replies: [],
        },
      ],
    },
    {
      posterDisplayName: "Ric",
      avatar: images.mockProfilePic4,
      datePosted: "14 February",
      content: "Hello world!",
      replies: [
        {
          posterDisplayName: "Ric",
          avatar: images.mockProfilePic4,
          datePosted: "12h",
          content: "test reply",
          replies: [],
        },
      ],
    },
    {
      posterDisplayName: "Ric",
      avatar: images.mockProfilePic4,
      datePosted: "14 February",
      content: "Hello world!",
    },
    {
      posterDisplayName: "Ric",
      avatar: images.mockProfilePic4,
      datePosted: "14 February",
      content: "Hello world!",
      replies: [
        {
          posterDisplayName: "Ric",
          avatar: images.mockProfilePic4,
          datePosted: "12h",
          content: "test reply",
          replies: [],
        },
        {
          posterDisplayName: "Ric",
          avatar: images.mockProfilePic4,
          datePosted: "12h",
          content: "test reply",
          replies: [],
        },
      ],
    },
    {
      posterDisplayName: "Ric",
      avatar: images.mockProfilePic4,
      datePosted: "14 February",
      content: "Hello world!",
    },
    {
      posterDisplayName: "Ric",
      avatar: images.mockProfilePic4,
      datePosted: "14 February",
      content: "Hello world!",
      replies: [
        {
          posterDisplayName: "Ric",
          avatar: images.mockProfilePic4,
          datePosted: "12h",
          content: "test reply",
          replies: [],
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
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
        data={mockData}
        renderItem={(data: any) => {
          return (
            <ActivityCard
              posterDisplayName={data.item.posterDisplayName}
              avatar={data.item.avatar}
              datePosted={data.item.datePosted}
              content={data.item.content}
              replies={data.item.replies}
            />
          );
        }}
      />
      <BasicBottomSheet ref={writePostBottomSheefRef} _snapPoints={["50%"]}>
        <View style={{ padding: 20 }}>
          <Text style={styles.modalTitle}>Write a post ✏️</Text>
          <BottomSheetTextInput
            placeholder="Share your challenges, successes or spread positivity!"
            multiline
            numberOfLines={20}
            style={styles.modalInput}
          />
          <View style={styles.modalCtaBtnContainer}>
            <TouchableOpacity>
              <View style={styles.modalCtaBtn}>
                <Text style={styles.modalCtaBtnText}>Post</Text>
                <FontAwesome name="pencil-square-o" size={23} color="white" />
              </View>
            </TouchableOpacity>
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
    height: "50%",
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
