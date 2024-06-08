import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { ManageAccountHomeScreen } from "./screens/ManageAccountHomeScreen.tsx";
import { ManageTeamScreen } from "./screens/ManageTeamScreen.tsx";
import { View } from "react-native";
import { TextButton } from "../../components/Button/TextButton.tsx";

export const ManageAccountStack = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator initialRouteName="ManageAccountScreen">
      <Stack.Screen
        name="ManageAccount"
        component={ManageAccountHomeScreen}
        options={({ navigation }) => ({
          headerTitle: "Account settings",
          headerTitleStyle: {
            fontFamily: "Poppins-SemiBold",
          },
          headerShown: true,
          headerStyle: {
            backgroundColor: "#f2f4ff",
          },
          headerShadowVisible: true,
        })}
      />
      <Stack.Screen
        name="ManageTeam"
        component={ManageTeamScreen}
        options={({ navigation }) => ({
          headerTitle: "Manage team",
          headerTitleStyle: {
            fontFamily: "Poppins-SemiBold",
          },
          headerShown: true,
          headerStyle: {
            backgroundColor: "#f2f4ff",
          },
          headerShadowVisible: true,
          headerLeft: () => (
            <View style={{ marginLeft: 16 }}>
              <TextButton
                onPress={() => {
                  navigation.goBack();
                }}
                textStyle={{ color: "#1f30fb" }}
                text={"Back"}
              />
            </View>
          ),
        })}
      />
    </Stack.Navigator>
  );
};

