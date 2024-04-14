import { TextInput, View } from "react-native";
import { Controller } from "react-hook-form";

export const BasicTextInput = ({ name, control, rules, placeholder }) => {
  return (
    <View>
      <Controller
        control={control}
        rules={rules}
        render={({ field }) => (
          <TextInput
            placeholder={placeholder}
            onChangeText={field.onChange}
            value={field.value}
          />
        )}
        name={name}
        defaultValue=""
      />
    </View>
  );
};
