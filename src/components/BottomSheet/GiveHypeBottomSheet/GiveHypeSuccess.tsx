import React, { useEffect, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import LottieView from "lottie-react-native";
import images from "../../../../assets";
import { AntDesign } from "@expo/vector-icons";
import { PrimaryButton } from "../../Button/PrimaryButton";
import { TextButton } from "../../Button/TextButton";
import BasicText from "../../Text/BasicText";

interface GiveHypeSuccessProps {
  onClose: () => void;
  onBack: () => void;
}

export const GiveHypeSuccess = (props: GiveHypeSuccessProps) => {
  const { onClose, onBack } = props;
  const confettiAnimationRef = useRef<LottieView>(null);

  useEffect(() => {
    confettiAnimationRef.current.play();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.messageContainer}>
        <LottieView
            resizeMode={'cover'}
            style={{ position: "absolute", width: 500, height: 500}}
            source={images.confettiAnimation}
            ref={confettiAnimationRef}
            loop={false}
            autoPlay={false}
        />
        <View>
          <AntDesign name="checkcircle" size={80} color="green" />
        </View>
        <BasicText style={styles.title}>Nice one!</BasicText>
        <BasicText style={styles.subtitle}>Hype points have been sent.</BasicText>
        <BasicText style={styles.message}>Your team will love you for this 🔥</BasicText>
        <View style={styles.actionButtons}>
          <PrimaryButton onPress={onBack} text={"Give more hype"} />
          <TextButton onPress={onClose} text={"Close"} textStyle={{ color: "grey" }} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  animationContainer: {
    position: "absolute",
    top: -100,
  },
  messageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 150,
  },
  title: {
    fontFamily: "Poppins-Bold",
    fontSize: 30,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 20,
    marginTop: 6,
  },
  message: {
    color: "grey",
    marginTop: 20,
  },
  actionButtons: {
    marginTop: 50,
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
});
