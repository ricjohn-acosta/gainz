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

interface TrainerTutorialStepTwoProps {
  handleNextStep: (userType: string) => void;
  handlePrevStep: (userType: string) => void;
  step: number;
}

export const TrainerTutorialStepTwo: FC<TrainerTutorialStepTwoProps> = (
  props,
) => {
  const { handleNextStep, handlePrevStep, step } = props;

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
            text={"Next"}
            textStyle={{ color: "#1f30fb", fontSize: 14 }}
            onPress={() => handleNextStep("trainer")}
          />
        </View>
      ),
    });
  }, [step]);

  return (
    <ScrollView
      contentContainerStyle={{ height: Dimensions.get("window").height }}
      style={s.container}
    >
      <BasicText style={s.header}>Adding rewards 🎁</BasicText>
      <BasicText style={s.subheader}>
        As you give hype points to your clients, they can accumulate these
        points and redeem rewards that you can tailor to their liking! Who
        doesn't like getting rewarded for their hard work?
      </BasicText>
      <View style={{ alignItems: "center", marginTop: 20 }}>
        <View style={s.demoGifContainer}>
          <ImageBackground style={s.demoGif} source={assets.trainerTutorial2} />
        </View>
        <BasicText style={{ marginTop: 30 }}>{step}/3</BasicText>
      </View>
    </ScrollView>
  );
};
