import { Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  DefaultTheme,
  NavigationContainer,
  useNavigation,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { Alert, Image, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { ActivityFeedScreen } from "./src/features/activityFeed/ActivityFeedScreen";
import GymScreen from "./src/features/gym/GymScreen";

import ProfileScreen from "./src/features/profile/ProfileScreen";
import RewardsScreen from "./src/features/rewards/RewardsScreen";

import images from "./assets";
import { InvitationForm } from "./src/features/welcome/components/InvitationForm";
import { LoginForm } from "./src/features/welcome/components/LoginForm";
import { SignupForm } from "./src/features/welcome/components/SignupForm";
import { supabase } from "./src/services/supabase";
import useAuthStore from "./src/stores/authStore";
import { Loading } from "./src/components/Progress/Loading";
import { TextButton } from "./src/components/Button/TextButton";
import useProfileStore from "./src/stores/profileStore";
import { isLoading } from "expo-font";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#f2f4ff",
  },
};

const HomeStack = () => {
  const navigation = useNavigation<any>();

  return (
    <Stack.Navigator initialRouteName="HomeScreen">
      <Stack.Screen
        name="Home"
        component={GymScreen}
        options={() => ({
          headerShown: false,
        })}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={() => ({
          title: "",
          headerStyle: {
            backgroundColor: "#f2f4ff",
          },
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerShadowVisible: false,
          headerLeft: () => (
            <Ionicons
              onPress={() => navigation.goBack()}
              name="chevron-back-outline"
              size={30}
              color="black"
            />
          ),
        })}
      />
    </Stack.Navigator>
  );
};

const RewardsStack = () => {
  const {
    data: { me },
  } = useProfileStore();

  return (
    <Stack.Navigator initialRouteName="RewardsScreen">
      <Stack.Screen
        name="Rewards"
        component={RewardsScreen}
        options={() => ({
          headerTitle: "",
          headerShown: true,
          headerStyle: {
            backgroundColor: "#f2f4ff",
          },
          headerShadowVisible: false,
          headerLeft: () => (
            <View>
              <Image
                style={{ width: 80, height: 80, marginLeft: 16 }}
                source={images.kapaiiLogo}
              />
            </View>
          ),
          headerRight: () => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginRight: 16,
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: 20,
                  marginTop: 4,
                }}
              >
                {me.hype_redeemable}
              </Text>
              <MaterialIcons
                name="local-fire-department"
                size={30}
                color="#ff046d"
              />
            </View>
          ),
        })}
      />
    </Stack.Navigator>
  );
};

const ActivityFeedStack = () => {
  return (
    <Stack.Navigator initialRouteName="ActivityFeedScreen">
      <Stack.Screen
        name="Activity"
        component={ActivityFeedScreen}
        options={() => ({
          headerTitle: "",
          headerShown: true,
          headerStyle: {
            backgroundColor: "#f2f4ff",
          },
          headerShadowVisible: false,
          headerLeft: () => (
            <View>
              <Image
                style={{ width: 80, height: 80, marginLeft: 16 }}
                source={images.kapaiiLogo}
              />
            </View>
          ),
          headerRight: () => (
            <Entypo
              style={{ marginRight: 16 }}
              name="pin"
              size={26}
              color="black"
            />
          ),
        })}
      />
    </Stack.Navigator>
  );
};

const ChatStack = () => {
  return (
    <Stack.Navigator initialRouteName="Chat">
      <Stack.Screen
        name="Rewards"
        component={RewardsScreen}
        options={() => ({
          headerShown: false,
        })}
      />
    </Stack.Navigator>
  );
};

const AuthNavigatorStack = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={() => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => {
            return focused ? (
              <Ionicons name="home" size={24} color="black" />
            ) : (
              <Ionicons name="home-outline" size={24} color="black" />
            );
          },
        })}
      />
      <Tab.Screen
        name="Chat"
        component={ActivityFeedStack}
        options={() => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => {
            return focused ? (
              <Ionicons name="chatbubble" size={24} color="black" />
            ) : (
              <Ionicons name="chatbubble-outline" size={24} color="black" />
            );
          },
        })}
      />
      <Tab.Screen
        name="Rewards"
        component={RewardsStack}
        options={() => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => {
            return focused ? (
              <Ionicons name="gift" size={24} color="black" />
            ) : (
              <Ionicons name="gift-outline" size={24} color="black" />
            );
          },
        })}
      />
    </Tab.Navigator>
  );
};

export default function App() {
  const { session, setSession, logout } = useAuthStore();
  const {
    data: { me },
  } = useProfileStore();

  const [hasUserSkippedInviteCode, setHasUserSkippedInviteCode] =
    useState<string>(null);
  const [notLoaded, setNotLoaded] = useState(true);

  const checkIfUserSkippedInviteCode = async () => {
    // await AsyncStorage.removeItem('has_skipped_invite_code');
    const result = await AsyncStorage.getItem("has_skipped_invite_code");
    setHasUserSkippedInviteCode(result);
  };

  useEffect(() => {
    supabase.auth
      .refreshSession()
      .then(async (session) => {
        setSession(session.data.session);
        checkIfUserSkippedInviteCode();
        setNotLoaded(false);
        if (session.error) await logout();
      })
      .catch(async (error) => {
        Alert.alert(error);
      });
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <NavigationContainer theme={theme}>
          <Stack.Navigator>
            {session && me && !notLoaded ? (
              <>
                {!hasUserSkippedInviteCode && (
                  <Stack.Screen
                    name="Invitation"
                    component={InvitationForm}
                    options={({ navigation }) => ({
                      headerTitle: "",
                      headerShown: true,
                      headerStyle: {
                        backgroundColor: "#f2f4ff",
                      },
                      headerShadowVisible: false,
                      headerRight: () => (
                        <View style={{ marginRight: 20 }}>
                          <TextButton
                            text="Skip"
                            textStyle={{ color: "grey" }}
                            onPress={() => {
                              AsyncStorage.setItem(
                                "has_skipped_invite_code",
                                "true",
                              ).then(() =>
                                navigation.reset({
                                  index: 0,
                                  routes: [{ name: "AuthStack" }],
                                }),
                              );
                            }}
                          />
                        </View>
                      ),
                    })}
                  />
                )}
                <Stack.Screen
                  name="AuthStack"
                  component={AuthNavigatorStack}
                  options={() => ({ headerShown: false })}
                />
              </>
            ) : (
              <Stack.Group>
                <Stack.Screen
                  name="Login"
                  component={LoginForm}
                  options={() => ({ headerShown: false })}
                />
                <Stack.Screen
                  name="Signup"
                  component={SignupForm}
                  options={() => ({ headerShown: false })}
                />
              </Stack.Group>
            )}
            {/*{notLoaded && (*/}
            {/*  <Stack.Group>*/}
            {/*    <Stack.Screen*/}
            {/*      name="Login"*/}
            {/*      component={LoginForm}*/}
            {/*      options={() => ({ headerShown: false })}*/}
            {/*    />*/}
            {/*    <Stack.Screen*/}
            {/*      name="Signup"*/}
            {/*      component={SignupForm}*/}
            {/*      options={() => ({ headerShown: false })}*/}
            {/*    />*/}
            {/*  </Stack.Group>*/}
            {/*)}*/}
          </Stack.Navigator>
        </NavigationContainer>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
