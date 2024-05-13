import { Entypo, Ionicons } from "@expo/vector-icons";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  createNavigationContainerRef,
  DefaultTheme,
  NavigationContainer,
  useNavigation,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Image, StatusBar, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { ActivityFeedScreen } from "./src/features/activityFeed/ActivityFeedScreen";
import GymScreen from "./src/features/gym/GymScreen";

import ProfileScreen from "./src/features/profile/ProfileScreen";
import RewardsScreen from "./src/features/rewards/RewardsScreen";

import images from "./assets";
import { LoginForm } from "./src/features/welcome/components/LoginForm";
import { SignupForm } from "./src/features/welcome/components/SignupForm";
import { supabase } from "./src/services/supabase";
import useAuthStore from "./src/stores/authStore";
import { TextButton } from "./src/components/Button/TextButton";
import useProfileStore from "./src/stores/profileStore";
import useTeamStore from "./src/stores/teamStore";
import { IconButton } from "./src/components/Button/IconButton";
import { AddRewardScreen } from "./src/features/rewards/AddRewardScreen";
import { RewardModalScreen } from "./src/features/rewards/RewardModalScreen";
import { DeleteRewardScreen } from "./src/features/rewards/DeleteRewardScreen";
import { useExpoFont } from "./src/theme/useFonts";
import * as Notifications from "expo-notifications";
import { useNotifications } from "./src/services/notifications/useNotifications";

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
            fontFamily: "Poppins-Bold",
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
    data: { meTeamData },
  } = useTeamStore();

  const navigation = useNavigation<any>();

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
          headerRight: () => {
            if (meTeamData.role === "member") return null;
            return (
              <View style={{ marginRight: 16 }}>
                <IconButton
                  onPress={() => navigation.navigate("RewardModal")}
                  IconComponent={Entypo}
                  iconProps={{
                    name: "plus",
                    size: 26,
                    defaultColor: "#000000",
                    pressedColor: "#a6a6a6",
                  }}
                />
              </View>
            );
          },
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

const RewardModalStack = () => {
  return (
    <Stack.Navigator initialRouteName="RewardModalScreen">
      <Stack.Screen
        name="Rewards"
        component={RewardModalScreen}
        options={({ navigation }) => ({
          headerTitle: "Rewards",
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
                text={"Cancel"}
              />
            </View>
          ),
          headerRight: () => <></>,
        })}
      />
      <Stack.Screen
        name="AddReward"
        component={AddRewardScreen}
        options={({ navigation }) => ({
          headerTitle: "Create reward",
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
      <Stack.Screen
        name="DeleteReward"
        component={DeleteRewardScreen}
        options={({ navigation }) => ({
          headerTitle: "Delete reward",
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
  const {
    operations: { registerForPushNotificationsAsync, savePushTokenToDB },
  } = useNotifications();
  const navigationRef = createNavigationContainerRef();

  StatusBar.setBackgroundColor("#f2f4ff");

  const [hasUserSkippedInviteCode, setHasUserSkippedInviteCode] =
    useState<string>(null);
  const [notLoaded, setNotLoaded] = useState(true);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);
  const [notificationPressed, setNotificationPressed] = useState<
    Notifications.Notification | undefined
  >(undefined);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  const checkIfUserSkippedInviteCode = async () => {
    // await AsyncStorage.removeItem('has_skipped_invite_code');
    const result = await AsyncStorage.getItem("has_skipped_invite_code");
    setHasUserSkippedInviteCode(result);
  };

  // Load user data
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

  // Listen for push notifications
  useEffect(() => {
    registerForPushNotificationsAsync()
      .then(async (token) => {
        setExpoPushToken(token ?? "");
        await savePushTokenToDB(token);
      })
      .catch((error: any) => setExpoPushToken(`${error}`));

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    // Fires when user taps on push notification
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        setNotificationPressed(response);
      });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current,
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(() => {
    if (navigationRef.isReady() && notificationPressed) {
      if (
        notificationPressed.request.content.data.event ===
        "hype_activity"
      ) {
        navigationRef.navigate("Profile", {
          uid: notificationPressed.request.content.data.recipient_uid,
        });
      }
    }
    setNotificationPressed(undefined);
  }, [navigationRef, notificationPressed]);

  // Load fonts
  useEffect(() => {
    if (!fontsLoaded) {
      loadFont();
      setFontsLoaded(true);
    }
  }, []);
  const loadFont = async () => {
    await useExpoFont();
  };

  if (!fontsLoaded) {
    return <></>;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#f2f4ff" }}>
      <BottomSheetModalProvider>
        <NavigationContainer ref={navigationRef} theme={theme}>
          <Stack.Navigator>
            {session && me && !notLoaded ? (
              <>
                {/*{!hasUserSkippedInviteCode && (*/}
                {/*  <Stack.Screen*/}
                {/*    name="Invitation"*/}
                {/*    component={InvitationForm}*/}
                {/*    options={({ navigation }) => ({*/}
                {/*      headerTitle: "",*/}
                {/*      headerShown: true,*/}
                {/*      headerStyle: {*/}
                {/*        backgroundColor: "#f2f4ff",*/}
                {/*      },*/}
                {/*      headerShadowVisible: false,*/}
                {/*      headerRight: () => (*/}
                {/*        <View style={{ marginRight: 20 }}>*/}
                {/*          <TextButton*/}
                {/*            text="Skip"*/}
                {/*            textStyle={{ color: "grey" }}*/}
                {/*            onPress={() => {*/}
                {/*              AsyncStorage.setItem(*/}
                {/*                "has_skipped_invite_code",*/}
                {/*                "true",*/}
                {/*              ).then(() =>*/}
                {/*                navigation.reset({*/}
                {/*                  index: 0,*/}
                {/*                  routes: [{ name: "AuthStack" }],*/}
                {/*                }),*/}
                {/*              );*/}
                {/*            }}*/}
                {/*          />*/}
                {/*        </View>*/}
                {/*      ),*/}
                {/*    })}*/}
                {/*  />*/}
                {/*)}*/}
                <Stack.Screen
                  name="AuthStack"
                  component={AuthNavigatorStack}
                  options={() => ({ headerShown: false })}
                />
                <Stack.Screen
                  name="RewardModal"
                  component={RewardModalStack}
                  options={({ navigation }) => ({
                    presentation: "modal",
                    headerTitle: "Rewards",
                    headerShown: false,
                    headerStyle: {
                      backgroundColor: "#f2f4ff",
                    },
                  })}
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
