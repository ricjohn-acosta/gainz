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
import { Alert, Image, Platform, StatusBar, View } from "react-native";
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
import * as Notifications from "expo-notifications";
import { useNotifications } from "./src/services/notifications/useNotifications";
import { useFonts } from "expo-font";
import { Loading } from "./src/components/Progress/Loading.tsx";
import { NotificationScreen } from "./src/features/notifications/NotificationScreen.tsx";
import { ForgotPasswordForm } from "./src/features/welcome/components/ForgotPasswordForm.tsx";
import * as Linking from "expo-linking";
import { ResetPasswordForm } from "./src/features/welcome/components/ResetPasswordForm.tsx";
import { StripeProvider } from "@stripe/stripe-react-native";
import { SubscribeModalScreen } from "./src/features/subscribe/SubscribeModalScreen.tsx";
import { ManageAccountStack } from "./src/features/manageAccount/ManageAccountStack.tsx";
import Purchases, { LOG_LEVEL } from "react-native-purchases";
import useSubscriptionStore from "./src/stores/subscriptionStore.ts";
import * as Updates from "expo-updates";

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
        name="Notification"
        component={NotificationScreen}
        options={() => ({
          title: "",
          headerStyle: {
            backgroundColor: "#f2f4ff",
          },
          headerTitleStyle: {
            fontFamily: "Poppins-Bold",
          },
          headerTitle: "Notifications",
          headerShown: true,
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
            if (!meTeamData || meTeamData.role === "member") return null;
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
          // TODO: Implement pinned notes
          // headerRight: () => (
          //   <Entypo
          //     style={{ marginRight: 16 }}
          //     name="pin"
          //     size={26}
          //     color="black"
          //   />
          // ),
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

const SubscribeModalStack = () => {
  return (
    <Stack.Navigator initialRouteName="SubscribeModalScreen">
      <Stack.Screen
        name="Subscribe"
        component={SubscribeModalScreen}
        options={({ navigation }) => ({
          headerTitle: "",
          headerShown: false,
          headerStyle: {
            backgroundColor: "#f2f4ff",
          },
          headerShadowVisible: false,
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
      <Tab.Screen
        name="ManageAccount"
        component={ManageAccountStack}
        options={() => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => {
            return focused ? (
              <Ionicons name="person-circle" size={24} color="black" />
            ) : (
              <Ionicons name="person-circle-outline" size={24} color="black" />
            );
          },
        })}
      />
    </Tab.Navigator>
  );
};

export default function App() {
  const { session, setSession, logout, loginWithToken } = useAuthStore();
  const {
    operations: { setOfferings, setCustomer },
  } = useSubscriptionStore();
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
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);
  const [prevNotificationId, setPrevNotificationId] = useState(undefined);

  const lastNotificationResponse = Notifications.useLastNotificationResponse();
  const notificationListener = useRef<Notifications.Subscription>();

  const parseSupabaseUrl = (url: string) => {
    let parsedUrl = url;
    if (url.includes("#")) {
      parsedUrl = url.replace("#", "?");
    }

    return parsedUrl;
  };

  const subscribe = (listener: (url: string) => void) => {
    const onReceiveURL = async ({ url }: { url: string }) => {
      const transformedUrl = parseSupabaseUrl(url);
      const parsedUrl = Linking.parse(transformedUrl);

      const access_token = parsedUrl.queryParams?.access_token;
      const refresh_token = parsedUrl.queryParams?.refresh_token;

      if (
        typeof access_token === "string" &&
        typeof refresh_token === "string"
      ) {
        loginWithToken(access_token, refresh_token);
      }

      listener(transformedUrl);
    };
    const subscription = Linking.addEventListener("url", onReceiveURL);

    return () => {
      subscription.remove();
    };
  };

  const getInitialURL = async () => {
    const url = await Linking.getInitialURL();

    if (url !== null) {
      return parseSupabaseUrl(url);
    }

    return url;
  };

  const prefix = Linking.createURL("/");
  const linking = {
    prefixes: [prefix],
    config: {
      screens: {
        ResetPassword: "/reset-password",
      },
    },
    getInitialURL,
    subscribe,
  };

  const checkIfUserSkippedInviteCode = async () => {
    // await AsyncStorage.removeItem('has_skipped_invite_code');
    const result = await AsyncStorage.getItem("has_skipped_invite_code");
    setHasUserSkippedInviteCode(result);
  };

  useEffect(() => {
    try {
      if (!me) return;
      const setup = async () => {
        await Purchases.configure({
          apiKey:
            Platform.OS === "ios"
              ? process.env.EXPO_PUBLIC_RC_APPLE_KEY
              : process.env.EXPO_PUBLIC_RC_ANDROID_KEY,
        });

        const offerings = await Purchases.getOfferings();

        const { customerInfo } = await Purchases.logIn(me.id);
        setCustomer(customerInfo);

        setOfferings(offerings);
      };

      Purchases.setLogLevel(LOG_LEVEL.VERBOSE);

      setup().catch(console.log);
    } catch (e) {
      console.error(e);
    }
  }, [me]);

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
        Alert.alert("Error refreshing session", error);
      });
  }, []);

  // Listen for push notifications
  useEffect(() => {
    registerForPushNotificationsAsync()
      .then(async (token) => {
        await savePushTokenToDB(token);
      })
      .catch((error: any) => setExpoPushToken(`${error}`));

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current,
        );
    };
  }, [me, session, navigationRef]);

  // Handle screen changes on auth states
  // useEffect(() => {
  //   if (!navigationRef.isReady()) return
  //   const { data } = supabase.auth.onAuthStateChange((event, session) => {
  //     if (event === "INITIAL_SESSION") {
  //       // handle initial session
  //     } else if (event === "SIGNED_IN") {
  //       // handle sign in event
  //     } else if (event === "SIGNED_OUT") {
  //       // handle sign out event
  //     } else if (event === "PASSWORD_RECOVERY") {
  //       // handle password recovery event
  //     } else if (event === "TOKEN_REFRESHED") {
  //       // handle token refreshed event
  //     } else if (event === "USER_UPDATED") {
  //       // handle user updated event
  //       console.log("password updated");
  //       navigationRef.navigation.reset({
  //         index: 0,
  //         routes: [{ name: "AuthStack" }],
  //       });
  //     }
  //   });
  //
  //   return () => {
  //     data.subscription.unsubscribe();
  //   };
  // }, [session, navigationRef]);

  useEffect(() => {
    if (!lastNotificationResponse) return;
    if (
      prevNotificationId ===
      lastNotificationResponse.notification.request.identifier
    )
      return;
    if (!navigationRef.isReady()) return;

    if (
      lastNotificationResponse.notification.request.content.data.event ===
      "hype_activity"
    ) {
      navigationRef.navigate("Profile", {
        uid: lastNotificationResponse.notification.request.content.data
          .recipient_uid,
      });
      setPrevNotificationId(
        lastNotificationResponse.notification.request.identifier,
      );
    }
  }, [navigationRef, lastNotificationResponse]);

  const [isLoaded] = useFonts({
    "Poppins-Regular": require("./assets/fonts/Poppins/Poppins-Regular.ttf"),
    "Poppins-Bold": require("./assets/fonts/Poppins/Poppins-Bold.ttf"),
    "Poppins-Medium": require("./assets/fonts/Poppins/Poppins-Medium.ttf"),
    "Poppins-SemiBold": require("./assets/fonts/Poppins/Poppins-SemiBold.ttf"),
    "Poppins-BoldItalic": require("./assets/fonts/Poppins/Poppins-BoldItalic.ttf"),
  });

  if (!isLoaded) {
    return <Loading />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#f2f4ff" }}>
      <NavigationContainer linking={linking} ref={navigationRef} theme={theme}>
        <BottomSheetModalProvider>
          <StripeProvider
            publishableKey={
              __DEV__
                ? process.env.EXPO_PUBLIC_DEV_STRIPE_PUBLISHABLE_KEY
                : process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY
            }
          >
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
                    options={() => ({
                      headerShown: false,
                      gestureEnabled: true,
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
                      gestureEnabled: true,
                      headerTitleStyle: {
                        fontFamily: "Poppins-Bold",
                      },
                      headerShadowVisible: false,
                      headerLeft: () => (
                        <Ionicons
                          onPress={() => navigationRef.goBack()}
                          name="chevron-back-outline"
                          size={30}
                          color="black"
                        />
                      ),
                    })}
                  />
                  <Stack.Screen
                    name="RewardModal"
                    component={RewardModalStack}
                    options={({ navigation }) => ({
                      gestureEnabled: true,
                      presentation: "modal",
                      headerTitle: "Rewards",
                      headerShown: false,
                      headerStyle: {
                        backgroundColor: "#f2f4ff",
                      },
                    })}
                  />
                  <Stack.Screen
                    name="SubscribeModal"
                    component={SubscribeModalStack}
                    options={({ navigation }) => ({
                      gestureEnabled: false,
                      presentation: "modal",
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
                    options={() => ({
                      headerShown: false,
                      gestureEnabled: true,
                    })}
                  />
                  <Stack.Screen
                    name="Signup"
                    component={SignupForm}
                    options={() => ({
                      headerShown: false,
                      gestureEnabled: true,
                    })}
                  />
                  <Stack.Screen
                    name="ForgotPassword"
                    component={ForgotPasswordForm}
                    options={({ navigation }) => ({
                      gestureEnabled: true,
                      title: "",
                      headerStyle: {
                        backgroundColor: "#f2f4ff",
                      },
                      headerTitleStyle: {
                        fontFamily: "Poppins-Bold",
                      },
                      headerTitle: "Forgot password",
                      headerShown: true,
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
                  <Stack.Screen
                    name="ResetPassword"
                    component={ResetPasswordForm}
                    options={({ navigation }) => ({
                      gestureEnabled: true,
                      title: "",
                      headerStyle: {
                        backgroundColor: "#f2f4ff",
                      },
                      headerTitleStyle: {
                        fontFamily: "Poppins-Bold",
                      },
                      headerTitle: "Reset password",
                      headerShown: true,
                      headerShadowVisible: false,
                      headerLeft: () => <></>,
                    })}
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
          </StripeProvider>
        </BottomSheetModalProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
