import React, { forwardRef } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import BasicBottomSheet from "../../../components/BottomSheet/BasicBottomSheet";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { PrimaryButton } from "../../../components/Button/PrimaryButton";
import useRewardStore from "../../../stores/rewardStore";

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

    return (
      <SafeAreaView>
        <BasicBottomSheet
          style={styles.modalStyle}
          ref={ref}
          _snapPoints={["50%"]}
          detached
          bottomInset={150}
        >
          <View style={styles.container}>
            <View style={styles.infoIcon}>
              <Ionicons name="gift-outline" size={30} color={"#348529"} />
            </View>
            <Text style={styles.confirmTitle}>Confirm redemption</Text>
            <Text style={styles.confirmItem}>{name}</Text>
            <View style={styles.confirmItemHypeAmountContainer}>
              <Text style={styles.confirmItemHypeAmount}>
                for <Text style={{ fontWeight: "bold" }}>{amount}</Text>
              </Text>
              <MaterialIcons
                name="local-fire-department"
                size={22}
                color="#ff046d"
              />
            </View>
            <View
              style={{
                width: "100%",
                marginTop: "14%",
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
                onPress={() => redeemReward(rewardId, name)}
                disablePadding
                text={"Redeem!"}
                style={{ padding: 10, width: 150 }}
              />
            </View>
          </View>
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
    fontWeight: "bold",
    marginBottom: 4,
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
