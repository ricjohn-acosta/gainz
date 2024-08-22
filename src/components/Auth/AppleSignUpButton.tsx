import { Alert, StyleSheet } from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";
import { supabase } from "../../services/supabase.ts";
import useAuthStore from "../../stores/authStore.ts";

export const AppleSignUpButton = () => {
  const { setSession } = useAuthStore();

  return (
    <AppleAuthentication.AppleAuthenticationButton
      buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
      buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
      cornerRadius={5}
      style={styles.button}
      onPress={async () => {
        try {
          const credential = await AppleAuthentication.signInAsync({
            requestedScopes: [
              AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
              AppleAuthentication.AppleAuthenticationScope.EMAIL,
            ],
          });
          // Sign in via Supabase Auth.
          if (credential.identityToken) {
            const {
              error: signInError,
              data: { user },
            } = await supabase.auth.signInWithIdToken({
              provider: "apple",
              token: credential.identityToken,
            });

            const { error: updateError } = await supabase
              .from("profiles")
              .update({
                username: credential.fullName.givenName,
              })
              .eq("id", user.id);

            if (!signInError || !updateError) {
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
            throw new Error("No identityToken.");
          }
        } catch (e) {
          if (e.code === "ERR_REQUEST_CANCELED") {
            // handle that the user canceled the sign-in flow
          } else {
            // handle other errors
          }
        }
      }}
    />
  );
};

const styles = StyleSheet.create({
  button: {
    width: 308,
    height: 44,
  },
});
