import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { TrainerOrClient } from "./components/TrainerOrClient/TrainerOrClient.tsx";
import { styles as s } from "./style.ts";
import { ClientTutorialStepOne } from "./components/ClientTutorial/ClientTutorialStepOne.tsx";
import { ClientTutorialStepTwo } from "./components/ClientTutorial/ClientTutorialStepTwo.tsx";
import { useNavigation } from "@react-navigation/native";
import { TrainerTutorialStepOne } from "./components/TrainerTutorial/TrainerTutorialStepOne.tsx";
import { TrainerTutorialStepTwo } from "./components/TrainerTutorial/TrainerTutorialStepTwo.tsx";
import { TrainerTutorialStepThree } from "./components/TrainerTutorial/TrainerTutorialStepThree.tsx";
import { ClientTutorialStepThree } from "./components/ClientTutorial/ClientTutorialStepThree.tsx";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TextButton } from "../../components/Button/TextButton.tsx";

export const TutorialScreen = ({ route }) => {
  const { fromScreen } = route.params ?? { fromScreen: null };

  const [clientStep, setClientStep] = useState<number>(1);
  const [trainerStep, setTrainerStep] = useState<number>(1);
  const [userType, setUserType] = useState<string>("");

  const navigation = useNavigation<any>();

  const handleTutorialFinished = () => {
    if (fromScreen) {
      navigation.goBack();
      return;
    }
    AsyncStorage.setItem("show_tutorial", "true").then(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: "AuthStack" }],
      });
    });
  };

  const handleNextStep = (type) => {
    if (type === "client") {
      if (clientStep === 3) {
        handleTutorialFinished();
        return;
      }
      setClientStep((prev) => prev + 1);
      return;
    }

    if (type === "trainer") {
      if (trainerStep === 3) {
        handleTutorialFinished();
        return;
      }
      setTrainerStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = (type) => {
    if (type === "client" && clientStep >= 1) {
      if (clientStep === 1) {
        setUserType("");
        return;
      }

      setClientStep((prev) => prev - 1);
      return;
    }

    if (type === "trainer" && trainerStep >= 1) {
      if (trainerStep === 1) {
        setUserType("");
        return;
      }

      setTrainerStep((prev) => prev - 1);
    }
  };
  const handleUserType = (type: string) => {
    setUserType(type);
  };

  const renderClientTutorials = () => {
    switch (clientStep) {
      case 1:
        return (
          <ClientTutorialStepOne
            handleNextStep={handleNextStep}
            handlePrevStep={handlePrevStep}
          />
        );
      case 2:
        return (
          <ClientTutorialStepTwo
            handleNextStep={handleNextStep}
            handlePrevStep={handlePrevStep}
            step={clientStep}
          />
        );
      case 3:
        return (
          <ClientTutorialStepThree
            handleNextStep={handleNextStep}
            handlePrevStep={handlePrevStep}
            step={clientStep}
          />
        );
    }
  };

  const renderTrainerTutorials = () => {
    switch (trainerStep) {
      case 1:
        return (
          <TrainerTutorialStepOne
            handleNextStep={handleNextStep}
            handlePrevStep={handlePrevStep}
          />
        );
      case 2:
        return (
          <TrainerTutorialStepTwo
            handleNextStep={handleNextStep}
            handlePrevStep={handlePrevStep}
            step={trainerStep}
          />
        );
      case 3:
        return (
          <TrainerTutorialStepThree
            handleNextStep={handleNextStep}
            handlePrevStep={handlePrevStep}
            step={trainerStep}
          />
        );
    }
  };

  return (
    <ScrollView contentContainerStyle={s.container}>
      {userType === "" && (
        <TrainerOrClient
          userType={userType}
          handleUserType={handleUserType}
          fromScreen={fromScreen}
        />
      )}
      {userType === "client" && renderClientTutorials()}
      {userType === "trainer" && renderTrainerTutorials()}
    </ScrollView>
  );
};
