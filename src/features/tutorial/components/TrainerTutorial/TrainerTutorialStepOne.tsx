import React, { FC, useEffect } from "react";
import {
  Dimensions,
  Image,
  ImageBackground,
  ScrollView,
  View,
} from "react-native";
import BasicText from "../../../../components/Text/BasicText.tsx";
import { styles as s } from "./style.ts";
import assets from "../../../../../assets/index.ts";
import { TextButton } from "../../../../components/Button/TextButton.tsx";
import { useNavigation } from "@react-navigation/native";

interface TrainerTutorialStepOneProps {
  handleNextStep: (userType: string) => void;
  handlePrevStep: (userType: string) => void;
}

export const TrainerTutorialStepOne: FC<TrainerTutorialStepOneProps> = (
  props,
) => {
  const { handleNextStep, handlePrevStep } = props;

  const navigation = useNavigation<any>();

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <View style={{ marginLeft: 20 }}>
          <TextButton
            text="Back"
            textStyle={{ color: "#1f30fb", fontSize: 14 }}
            onPress={() => handlePrevStep("trainer")}
          />
        </View>
      ),
      headerRight: () => (
        <View style={{ marginRight: 20 }}>
          <TextButton
            text="Next"
            textStyle={{ color: "#1f30fb", fontSize: 14 }}
            onPress={() => handleNextStep("trainer")}
          />
        </View>
      ),
    });
  }, []);

  return (
    <ScrollView
      contentContainerStyle={{ height: Dimensions.get("window").height }}
      style={s.container}
    >
      <BasicText style={s.header}>Giving hype points 🔥</BasicText>
      <BasicText style={s.subheader}>
        Give your clients hype points when they do a great job in their workouts
        or even when they're going through a tough time! Kapaii is all about
        showing your clients that you care!
      </BasicText>
      <View style={{ alignItems: "center", marginTop: 20 }}>
        <View style={s.demoGifContainer}>
          <ImageBackground style={s.demoGif} source={assets.clientTutorial1} />
        </View>
        <BasicText style={{ marginTop: 30 }}>1/3</BasicText>
      </View>
    </ScrollView>
  );
};
