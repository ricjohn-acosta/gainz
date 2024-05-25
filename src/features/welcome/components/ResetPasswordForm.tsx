import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import BasicText from "../../../components/Text/BasicText.tsx";
import { PrimaryButton } from "../../../components/Button/PrimaryButton.tsx";
import { BasicTextInput } from "../../../components/Input/BasicTextInput.tsx";
import React from "react";
import { useForm } from "react-hook-form";
import useAuthStore from "../../../stores/authStore.ts";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../../../services/supabase.ts";

export const ResetPasswordForm = () => {
  const { updatePassword, setSession } = useAuthStore();
  const navigation = useNavigation<any>();

  const {
    getValues,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<any>();

  const handleChangePassword = async () => {
    if (getValues() && getValues("password")) {
      const newPassword = getValues("password");
      const error = await updatePassword(newPassword);

      if (!error) {
        Alert.alert("Success!", "Password has been changed.", [
          {
            text: "OK",
            onPress: () => {
              supabase.auth
                .refreshSession()
                .then(async (session) => {
                  setSession(session.data.session);
                  navigation.reset({
                    index: 0,
                    routes: [{ name: "AuthStack" }],
                  });
                  if (session.error) await logout();
                })
                .catch(async (error) => {
                  Alert.alert("Error refreshing session", error);
                });
            },
          },
        ]);
      }
    }
  };

  return (
    <View style={styles.container}>
      <BasicText>Enter a new password and you will be logged in</BasicText>
      <BasicTextInput
        password
        style={styles.input}
        name={"password"}
        control={control}
        rules={{ required: "Please enter a new password" }}
        placeholder="Enter new password"
        errors={errors}
      />
      <PrimaryButton
        disabled={!!errors}
        style={{ marginTop: 10 }}
        onPress={handleSubmit(handleChangePassword)}
        text={"Update password"}
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
