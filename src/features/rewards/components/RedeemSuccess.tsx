import React, { useEffect, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import LottieView from "lottie-react-native";
import images from "../../../../assets";
import { Ionicons } from "@expo/vector-icons";
import { TextButton } from "../../../components/Button/TextButton";
import BasicText from "../../../components/Text/BasicText";

interface RedeemSuccessProps {
  handleCloseModal: () => void;
}

export const RedeemSuccess = (props: RedeemSuccessProps) => {
  const { handleCloseModal } = props;
  const confettiAnimationRef = useRef<LottieView>(null);

  useEffect(() => {
    confettiAnimationRef.current.play();
  }, []);

  return (
    <View style={styles.container}>
      <LottieView
        style={{ position: "absolute", top: -50, width: 500 }}
        source={images.confettiAnimation}
        ref={confettiAnimationRef}
        loop={false}
        autoPlay={false}
      />
      <View style={styles.detailContainer}>
        <View style={styles.infoIcon}>
          <Ionicons
            style={{ paddingLeft: 2 }}
            name="checkmark-circle-sharp"
            size={60}
            color={"#2f932c"}
          />
        </View>
        <View style={styles.messageContainer}>
          <BasicText style={styles.successMsg}>Success!</BasicText>
          <BasicText style={styles.infoMsg}>
            Well deserved! Your team leader will be in contact with you shortly.
            💪
          </BasicText>
        </View>
        <View style={{ marginTop: 50 }}>
          <TextButton
            onPress={handleCloseModal}
            textStyle={{ color: "#1f30fb" }}
            text={"Close"}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  detailContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  infoIcon: {
    backgroundColor: "#c1f6aa",
    borderRadius: 50,
    width: "100%",
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  messageContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  successMsg: {
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 14,
  },
  infoMsg: {
    textAlign: "center",
    marginTop: 10,
    paddingLeft: 14,
    paddingRight: 14,
  },
});
