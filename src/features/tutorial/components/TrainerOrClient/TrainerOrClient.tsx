import React, { FC, useEffect } from "react";
import { Image, View } from "react-native";
import { styles as s } from "./style.ts";
import BasicText from "../../../../components/Text/BasicText.tsx";
import { PrimaryButton } from "../../../../components/Button/PrimaryButton.tsx";
import { TextButton } from "../../../../components/Button/TextButton.tsx";
import { useNavigation } from "@react-navigation/native";
import images from "../../../../../assets/index.ts";

interface TrainerOrClientProps {
  handleUserType: (type: string) => void;
  fromScreen: string;
  userType: string;
}

export const TrainerOrClient: FC<TrainerOrClientProps> = (props) => {
  const { handleUserType, fromScreen, userType } = props;

  const navigation = useNavigation<any>();

  useEffect(() => {
    if (!fromScreen && !userType) {
      navigation.setOptions({
        headerLeft: null,
        headerRight: null,
      });
      return;
    }

    navigation.setOptions({
      headerLeft: () => (
        <View style={{ marginLeft: 20 }}>
          <TextButton
            onPress={() => {
              navigation.goBack();
            }}
            textStyle={{ color: "#1f30fb", fontSize: 14 }}
            text={"Back"}
          />
        </View>
      ),
      headerRight: null,
    });
  }, [fromScreen, userType]);

  return (
    <View style={s.tutorialContainer}>
      <View>
        <Image style={s.logo} source={images.kapaiiSquareLogo} />
      </View>

      <BasicText style={s.welcomeTitle}>Welcome to kapaii!</BasicText>
      <BasicText style={s.label}>Are you a..</BasicText>
      <View style={s.tutorialButtonContainer}>
        <PrimaryButton
          onPress={() => handleUserType("trainer")}
          text={"Trainer"}
          textStyle={{ color: "white" }}
          style={{ width: 100, backgroundColor: "#1f30fb" }}
        />
        <PrimaryButton
          onPress={() => handleUserType("client")}
          text={"Client"}
          textStyle={{ color: "white" }}
          style={{ width: 100, backgroundColor: "#1f30fb" }}
        />
      </View>
    </View>
  );
};
