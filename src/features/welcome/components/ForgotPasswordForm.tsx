import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import BasicText from "../../../components/Text/BasicText.tsx";
import { PrimaryButton } from "../../../components/Button/PrimaryButton.tsx";
import { BasicTextInput } from "../../../components/Input/BasicTextInput.tsx";
import React from "react";
import { useForm } from "react-hook-form";
import useAuthStore from "../../../stores/authStore.ts";

export const ForgotPasswordForm = () => {
  const { resetPassword } = useAuthStore();

  const {
    getValues,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<any>();

  const handleSendLoginLink = () => {
    if (getValues() && getValues("email")) {
      const email = getValues("email");
      resetPassword(email);
      Alert.alert(
        "Email sent!",
        "Please check your email to reset your password",
      );
    }
  };

  console.log(errors)
  return (
    <View style={styles.container}>
      <BasicText>
        Enter your email address and we'll send you a link to get back into your
        account
      </BasicText>
      <BasicTextInput
        keyboardType={"email-address"}
        style={styles.input}
        name={"email"}
        control={control}
        rules={{ required: "Enter email" }}
        placeholder="Email"
        errors={errors}
      />
      <PrimaryButton
        disabled={errors && errors.email}
        style={{ marginTop: 10 }}
        onPress={handleSubmit(handleSendLoginLink)}
        text={"Send login link!"}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    backgroundColor: "#f2f4ff",
    margin: 12,
  },
  input: {
    backgroundColor: "#ffffff",
    height: 50,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
    padding: 10,
    fontFamily: "Poppins-Regular",
  },
});
