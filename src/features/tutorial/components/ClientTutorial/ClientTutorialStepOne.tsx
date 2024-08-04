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

interface ClientTutorialStepOneProps {
  handleNextStep: (userType: string) => void;
  handlePrevStep: (userType: string) => void;
}

export const ClientTutorialStepOne: FC<ClientTutorialStepOneProps> = (
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
            onPress={() => handlePrevStep("client")}
          />
        </View>
      ),
      headerRight: () => (
        <View style={{ marginRight: 20 }}>
          <TextButton
            text="Next"
            textStyle={{ color: "#1f30fb", fontSize: 14 }}
            onPress={() => handleNextStep("client")}
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
        Had a good session with your trainer? Give them hype points! Your
        teammate hit a new personal best? Give them hype points!
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
