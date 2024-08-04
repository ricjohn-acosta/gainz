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

interface TrainerTutorialStepThreeProps {
  handleNextStep: (userType: string) => void;
  handlePrevStep: (userType: string) => void;
  step: number;
}

export const TrainerTutorialStepThree: FC<TrainerTutorialStepThreeProps> = (
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
            text={"Finish"}
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
      <BasicText style={s.header}>Share your thoughts! 📝</BasicText>
      <BasicText style={s.subheader}>
        Build relationships with your clients by sharing fitness tips, random
        thoughts or even give shout outs to clients who are doing exceptionally
        well!
        {/*Share your fitness tips, random thoughts, or just start a casual*/}
        {/*conversation with your team!*/}
      </BasicText>
      <View style={{ alignItems: "center", marginTop: 20 }}>
        <View style={s.demoGifContainer}>
          <ImageBackground style={s.demoGif} source={assets.trainerTutorial3} />
        </View>
        <BasicText style={{ marginTop: 30 }}>{step}/3</BasicText>
      </View>
    </ScrollView>
  );
};
