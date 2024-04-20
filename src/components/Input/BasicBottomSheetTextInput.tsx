import { StyleSheet, Text, TextInput, View } from "react-native";
import { Controller } from "react-hook-form";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import React from "react";

interface BasicBottomSheetTextInputProps {
  name?: any;
  control?: any;
  rules?: any;
  placeholder?: string;
  numberOfLines?: number;
  inputStyle?: any;
  handleChange?: any;
  errors?: any;
  editable?: boolean;
  maxLength?: number;
}

export const BasicBottomSheetTextInput = (
  props: BasicBottomSheetTextInputProps,
) => {
  const {
    name,
    control,
    rules,
    placeholder,
    numberOfLines,
    inputStyle,
    errors,
    editable,
    maxLength,
  } = props;
  return (
    <View>
      <Controller
        control={control}
        rules={rules}
        render={({ field }) => (
          <BottomSheetTextInput
            maxLength={maxLength}
            editable={editable}
            onChangeText={field.onChange}
            placeholder={placeholder}
            multiline
            numberOfLines={numberOfLines}
            style={{ ...inputStyle }}
          />
        )}
        name={name}
        defaultValue=""
      />
      {errors[name] && (
        <Text style={styles.errorMsg}>{errors[name].message}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  errorMsg: {
    color: "red",
  },
});
