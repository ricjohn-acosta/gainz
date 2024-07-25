import React, { FC, useEffect, useRef, useState } from "react";
import BasicBottomSheet from "../../components/BottomSheet/BasicBottomSheet.tsx";
import { Platform, View } from "react-native";
import BasicText from "../../components/Text/BasicText.tsx";
import { styles as s } from "./style.ts";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useHypeReceivedListener } from "./useHypeReceivedListener.tsx";
import useProfileStore from "../../stores/profileStore.ts";
import LottieView from "lottie-react-native";
import images from "../../../assets/index.ts";
import { MaterialIcons } from "@expo/vector-icons";
import useHypeStore from "../../stores/hypeStore.ts";
import { TextButton } from "../../components/Button/TextButton.tsx";
import { PrimaryButton } from "../../components/Button/PrimaryButton.tsx";
import * as Notifications from "expo-notifications";

export interface HypeReceived {
  id: number;
  hype_message: string;
  hype_points_received: number;
  sender_username: string;
  seen: boolean;
}

export const HypeReceivedModal: FC = () => {
  const {
    data: { me },
  } = useProfileStore();
  const {
    operations: {
      getUnseenHypeReceivedNotifications,
      updateNotificationsAsSeen,
    },
  } = useHypeStore();

  const [hypeReceived, setHypeReceived] = useState<HypeReceived[]>([]);
  const [page, setPage] = useState<number>(0);

  const modalRef = useRef<BottomSheetModal>(null);
  const lastNotificationResponse = Notifications.useLastNotificationResponse();

  const isMultipleHype = hypeReceived.length > 1;

  // We listen for hype received in real time
  useHypeReceivedListener(setHypeReceived);

  useEffect(() => {
    if (hypeReceived.length === 0) return;
    // Show this modal when we receive hype notifications
    modalRef.current.present();
    const notificationIds = hypeReceived.map((hype) => hype.id);
    updateNotificationsAsSeen(notificationIds);
  }, [hypeReceived, hypeReceived.length, lastNotificationResponse]);

  // Do an initial API call for users going into the app from notification alert
  useEffect(() => {
    const fetchUnseenHypeReceivedNotifications = async () => {
      const fetchedNotifications = await getUnseenHypeReceivedNotifications();

      if (fetchedNotifications && fetchedNotifications.length > 0) {
        setHypeReceived([...fetchedNotifications]);
      }
    };

    fetchUnseenHypeReceivedNotifications();
  }, [lastNotificationResponse]);

  const handleClearHypeReceived = () => {
    if (hypeReceived.length === 0) return;

    setHypeReceived([]);
    setPage(0);
    modalRef.current.close();
  };

  const handleNextPage = () => {
    if (page + 1 === hypeReceived.length) return;
    setPage((prevState) => prevState + 1);
  };

  const handlePrevPage = () => {
    if (page === 0) return;
    setPage((prevState) => prevState - 1);
  };

  const displayHypeReceivedDetails = () => {
    if (hypeReceived.length === 0) return null;

    // Show current hype details
    const hypeDetails = hypeReceived[page];

    return (
      <View style={s.hypeContentContainer}>
        <BasicText>
          <BasicText style={s.senderName}>
            {hypeDetails.sender_username}
          </BasicText>{" "}
          <BasicText style={s.defaultText}>hyped you up!</BasicText>
        </BasicText>
        {hypeDetails.hype_message && (
          <BasicText style={s.hypeReceivedMessage}>
            "{hypeDetails.hype_message}"
          </BasicText>
        )}

        <View style={s.iconContainer}>
          <MaterialIcons
            name="local-fire-department"
            size={50}
            color="#ff046d"
          />
        </View>

        <View style={s.hypeReceivedContainer}>
          <BasicText style={s.hypeReceived}>
            {hypeDetails.hype_points_received}
          </BasicText>
          <BasicText style={s.hypeReceivedLabel}>hype received!</BasicText>
        </View>
      </View>
    );
  };

  if (!me) return null;

  return (
    <View style={s.container}>
      <BasicBottomSheet
        style={{
          ...s.sheetContainer,
          paddingBottom: hypeReceived.length >= 2 ? 20 : 0,
        }}
        ref={modalRef}
        detached
        _snapPoints={Platform.OS === "ios" ? ["40%"] : ["45%"]}
        bottomInset={120}
        onDismiss={handleClearHypeReceived}
      >
        <View style={s.contentContainer}>
          <LottieView
            resizeMode={"cover"}
            style={{ position: "absolute", width: 300, height: 300 }}
            source={images.confettiAnimation2}
            loop={false}
            autoPlay
          />
          {displayHypeReceivedDetails()}

          <View style={s.actionContainer}>
            <TextButton
              onPress={handleClearHypeReceived}
              text={"Close"}
              textStyle={{
                color: hypeReceived.length >= 2 ? "grey" : "#1f30fb",
              }}
            />
            {page !== 0 && (
              <PrimaryButton
                onPress={handlePrevPage}
                text={"Back"}
                style={{
                  marginLeft: 10,
                  width: 50,
                  padding: 6,
                  borderRadius: 10,
                }}
                textStyle={{ fontSize: 12 }}
              />
            )}
            {isMultipleHype && page + 1 !== hypeReceived.length && (
              <PrimaryButton
                onPress={handleNextPage}
                text={"Next"}
                style={{
                  marginLeft: 10,
                  width: 50,
                  padding: 6,
                  borderRadius: 10,
                }}
                textStyle={{ fontSize: 12 }}
              />
            )}
          </View>
          {isMultipleHype && (
            <BasicText style={s.counter}>
              {page + 1}/{hypeReceived.length}
            </BasicText>
          )}
        </View>
      </BasicBottomSheet>
    </View>
  );
};
