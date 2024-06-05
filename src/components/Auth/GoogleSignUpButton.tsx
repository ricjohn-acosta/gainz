import React from "react";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { supabase } from "../../services/supabase.ts";
import { Alert, Platform } from "react-native";
import useAuthStore from "../../stores/authStore.ts";

export const GoogleSignUpButton = () => {
  const { setSession } = useAuthStore();

  const clientId =
    Platform.OS === "ios"
      ? "307561343933-38nip8bflo65ves9dgb2jbennrhobl25.apps.googleusercontent.com"
      : "307561343933-9tvc64pj1fak4s2ejh7b7191h8kfbom0.apps.googleusercontent.com";

  GoogleSignin.configure({
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
    iosClientId: clientId,
    webClientId: clientId,
  });

  return (
    <GoogleSigninButton
      size={GoogleSigninButton.Size.Wide}
      color={GoogleSigninButton.Color.Dark}
      onPress={async () => {
        try {
          await GoogleSignin.hasPlayServices();
          const userInfo = await GoogleSignin.signIn();
          if (userInfo.idToken) {
            const { error } = await supabase.auth.signInWithIdToken({
              provider: "google",
              token: userInfo.idToken,
            });

            if (!error) {
              supabase.auth
                .refreshSession()
                .then(async (session) => {
                  setSession(session.data.session);
                  if (session.error) await logout();
                })
                .catch(async (error) => {
                  Alert.alert("Error refreshing session", error);
                });
            }
          } else {
            throw new Error("no ID token present!");
          }
        } catch (error: any) {
          if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            // user cancelled the login flow
          } else if (error.code === statusCodes.IN_PROGRESS) {
            // operation (e.g. sign in) is in progress already
          } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            Alert.alert('Error', 'Google services are unavailable')
            // play services not available or outdated
          } else {
            // some other error happened
          }
        }
      }}
    />
  );
};
