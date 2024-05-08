import { MaterialIcons } from "@expo/vector-icons";
import React, { useCallback, useRef } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { PrimaryButton } from "../../../components/Button/PrimaryButton";
import images from "../../../../assets";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { ConfirmRewardModal } from "./ConfirmRewardModal";
import LottieView from "lottie-react-native";
import BasicText from "../../../components/Text/BasicText";

interface RewardCardProps {
  name: string;
  description: string;
  imageUrl: string;
  quantity: number;
  amount: number;
  sponsor: string;
  rewardId: number;
}

export const RewardCard = (props: RewardCardProps) => {
  const { name, description, rewardId, imageUrl, quantity, amount, sponsor } =
    props;
  const confirmRewardModal = useRef<BottomSheetModal>(null);

  const showConfirmRewardModal = useCallback(() => {
    confirmRewardModal.current?.present();
  }, []);

  const hideConfirmRewardModal = useCallback(() => {
    confirmRewardModal.current?.dismiss();
  }, []);

  return (
    <View style={styles.container}>
      <Image style={styles.imageContainer} source={images.cashReward} />
      <View style={styles.cardDetails}>
        <View>
          {sponsor && (
            <BasicText style={styles.extraDetail}>
              Sponsored by{" "}
              <BasicText style={{ color: "#1f30fb", fontFamily: "Poppins-Bold" }}>
                {sponsor}
              </BasicText>
            </BasicText>
          )}
          <BasicText style={styles.title}>{name}</BasicText>
          <BasicText style={styles.description}>{description}</BasicText>
          <BasicText style={styles.itemStock}>Quantity: {quantity}</BasicText>
        </View>
        <PrimaryButton
          onPress={showConfirmRewardModal}
          disablePadding
          textStyle={{ fontSize: 14, padding: 6 }}
          text={`${amount}`}
          endAdornment={
            <MaterialIcons
              name="local-fire-department"
              size={20}
              color="#ff046d"
            />
          }
        />
      </View>
      <ConfirmRewardModal
        onHide={hideConfirmRewardModal}
        name={name}
        rewardId={rewardId}
        amount={amount}
        ref={confirmRewardModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "45%",
    height: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 25,
  },
  imageContainer: {
    width: "100%",
    height: 100,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  cardDetails: {
    padding: 10,
  },
  title: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    marginBottom: 20,
  },
  itemStock: {
    marginBottom: 10,
    fontSize: 12,
    color: "grey",
  },
  redeemBtnContainer: {
    marginTop: 10,
    backgroundColor: "#1f30fb",
    borderRadius: 25,
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  redeemBtnText: {
    textAlign: "center",
    color: "white",
    fontWeight: "900",
    fontSize: 16,
  },
  extraDetail: {
    fontSize: 10,
    marginBottom: 10,
  },
});
