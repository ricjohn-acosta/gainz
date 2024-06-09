import React from "react";
import { Alert, StyleSheet, View } from "react-native";
import { MenuActionButton } from "../../../components/Button/MenuActionButton.tsx";
import useAuthStore from "../../../stores/authStore.ts";
import useTeamStore from "../../../stores/teamStore.ts";
import useProfileStore from "../../../stores/profileStore.ts";

export const ManageAccountHomeScreen = () => {
  const { logout } = useAuthStore();
  const {
    data: { subscription },
  } = useProfileStore();
  const {
    data: { meTeamData },
  } = useTeamStore();

  const displayManageTeam = () => {
    if (meTeamData && meTeamData.role === "leader") return true;

    return false;
  };

  return (
    <View style={styles.container}>
      {displayManageTeam() && (
        <MenuActionButton label={"Manage team"} to={"ManageTeam"} />
      )}

      {subscription && (
        <MenuActionButton label={"Manage subscription"} to={"ManageSubscription"} />
      )}

      <MenuActionButton
        label={"Logout"}
        onPress={() => {
          Alert.alert("Logout?", "Are you sure you want to logout?", [
            {
              text: "Cancel",
              onPress: () => {},
              style: "cancel",
            },
            {
              text: "OK",
              onPress: () => {
                logout();
              },
            },
          ]);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 12,
    marginTop: 30,
  },
});
