import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { BasicTextInput } from "../../../components/Input/BasicTextInput";
import { useForm } from "react-hook-form";

export const AddRewardForm = () => {
  const {
    getValues,
    control,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm<any>();

  return (
    <View>
      <View style={styles.messageContainer}>
        <Text style={styles.title}>Create a reward</Text>
        <Text style={styles.subtitle}>
          Motivate your clients with your own custom rewards!
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Reward name</Text>
        <BasicTextInput
          rules={{ required: "Please enter a name" }}
          placeholder={"e.g: Free coaching session"}
          style={styles.textInput}
          control={control}
          name={"rewardName"}
          errors={errors}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Reward description</Text>
        <BasicTextInput
          rules={{ required: "Please enter a description" }}
          multiline
          placeholder={"e.g: Redeem to have one coaching session for free!"}
          style={{ ...styles.textInput, height: 100 }}
          control={control}
          name={"rewardDescription"}
          errors={errors}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Hype amount</Text>
        <BasicTextInput
          rules={{ required: "Please enter an amount" }}
          placeholder={"e.g: 100"}
          style={styles.textInput}
          control={control}
          name={"rewardAmount"}
          errors={errors}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Quantity</Text>
        <BasicTextInput
            rules={{ required: "Please enter an amount" }}
            placeholder={"e.g: 5"}
            style={styles.textInput}
            control={control}
            name={"rewardQuantity"}
            errors={errors}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 12,
  },
  messageContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    marginBottom: 8,
    fontSize: 16,
  },
  textInput: {
    backgroundColor: "#ffffff",
    height: 40,
    borderRadius: 10,
    padding: 10,
  },
  inputContainer: {
    marginBottom: 24,
  },
  title: {
    fontWeight: "bold",
    fontSize: 22,
    color: "#000000",
    marginBottom: 8,
  },
  subtitle: {
    color: "grey",
    marginBottom: 6,
  },
});
