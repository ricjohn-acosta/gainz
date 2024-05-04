import { StyleSheet, Text, TextInput, View } from "react-native";
import { Controller } from "react-hook-form";
import React from "react";
import BasicText from "../Text/BasicText";

interface BasicTextInputProps {
  name: string;
  control?: any;
  rules?: any;
  placeholder?: string;
  style?: any;
  multiline?: boolean;
  errors?: any;
}

export const BasicTextInput = (props: BasicTextInputProps) => {
  const { name, control, rules, placeholder, style, multiline, errors } = props;

  return (
    <>
      <Controller
        control={control}
        rules={rules}
        render={({ field }) => (
          <TextInput
            showSoftInputOnFocus={true}
            multiline={multiline}
            style={{...style, fontFamily: 'Poppins-Regular'}}
            placeholder={placeholder}
            onChangeText={field.onChange}
            value={field.value}
          />
        )}
        name={name}
        defaultValue=""
      />
      {errors[name] && (
        <BasicText style={styles.errorMsg}>{errors[name].message}</BasicText>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  errorMsg: {
    color: "red",
  },
});
