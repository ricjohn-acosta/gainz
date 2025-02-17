import React, { forwardRef, useEffect, useRef, useState } from "react";
import { Alert, SafeAreaView, StyleSheet, Text, View } from "react-native";
import BasicBottomSheet from "../../../components/BottomSheet/BasicBottomSheet";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { PrimaryButton } from "../../../components/Button/PrimaryButton";
import useRewardStore from "../../../stores/rewardStore";
import LottieView from "lottie-react-native";
import images from "../../../../assets";
import { RedeemSuccess } from "./RedeemSuccess";
import BasicText from "../../../components/Text/BasicText";

interface ConfirmRewardModalProps {
  rewardId: number;
  name: string;
  amount: number;
  onHide: () => void;
}

export const ConfirmRewardModal = forwardRef(
  (props: ConfirmRewardModalProps, ref) => {
    const { name, amount, onHide, rewardId } = props;
    const {
      operations: { redeemReward },
    } = useRewardStore();

    const [redeemSuccess, setRedeemSuccess] = useState<boolean>(false);
    const [modalIndex, setModalIndex] = useState(null);

    // Detect if we've closed the bottom sheet
    useEffect(() => {
      if (!modalIndex) return;
      if (modalIndex === -1) {
        setRedeemSuccess(false);
      }
    }, [modalIndex]);

    const handleCloseModal = () => {
      onHide();
      setRedeemSuccess(false);
    };

    const handleOnChange = (index) => {
      setModalIndex(index);
    };

    return (
      <SafeAreaView>
        <BasicBottomSheet
          handleOnChange={handleOnChange}
          style={styles.modalStyle}
          ref={ref}
          _snapPoints={["50%"]}
          detached
          bottomInset={120}
        >
          {redeemSuccess ? (
            <View style={styles.container}>
              <RedeemSuccess handleCloseModal={handleCloseModal} />
            </View>
          ) : (
            <View style={styles.container}>
              <View style={styles.infoIcon}>
                <Ionicons name="gift-outline" size={30} color={"#348529"} />
              </View>
              <BasicText style={styles.confirmTitle}>
                Confirm redemption
              </BasicText>
              <BasicText style={styles.confirmItem}>{name}</BasicText>
              <View style={styles.confirmItemHypeAmountContainer}>
                <BasicText style={styles.confirmItemHypeAmount}>
                  for{" "}
                  <BasicText style={{ fontFamily: "Poppins-Bold" }}>
                    {amount}
                  </BasicText>
                </BasicText>
                <MaterialIcons
                  name="local-fire-department"
                  size={22}
                  color="#ff046d"
                />
              </View>
              <View
                style={{
                  width: "100%",
                  marginTop: 20,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <PrimaryButton
                  onPress={onHide}
                  disablePadding
                  text={"Cancel"}
                  textStyle={{ color: "grey" }}
                  style={{ padding: 10, width: 150, backgroundColor: "white" }}
                />
                <PrimaryButton
                  onPress={() => {
                    redeemReward(rewardId, name, amount).then((error) => {
                      if (!error) {
                        setRedeemSuccess(true);
                      } else {
                        Alert.alert(
                          "Reward unavailable",
                          "You do not have sufficient hype points to redeem this reward.",
                        );
                      }
                    });
                  }}
                  disablePadding
                  text={"Redeem!"}
                  style={{ padding: 10, width: 150 }}
                />
              </View>
            </View>
          )}
        </BasicBottomSheet>
      </SafeAreaView>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  modalStyle: {
    margin: 20,
  },
  confirmTitle: {
    fontSize: 14,
    color: "grey",
    marginTop: 10,
    marginBottom: 36,
  },
  confirmItem: {
    fontSize: 28,
    fontFamily: "Poppins-Bold",
  },
  confirmItemHypeAmountContainer: {
    flexDirection: "row",
  },
  confirmItemHypeAmount: {
    fontSize: 18,
  },
  infoIcon: {
    backgroundColor: "#c1f6aa",
    borderRadius: 50,
    padding: 16,
  },
});
