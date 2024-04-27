import { StyleSheet, Text, TextInput, View } from "react-native";
import { Controller } from "react-hook-form";
import React from "react";

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
            style={style}
            placeholder={placeholder}
            onChangeText={field.onChange}
            value={field.value}
          />
        )}
        name={name}
        defaultValue=""
      />
      {errors[name] && (
        <Text style={styles.errorMsg}>{errors[name].message}</Text>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  errorMsg: {
    color: "red",
  },
});
