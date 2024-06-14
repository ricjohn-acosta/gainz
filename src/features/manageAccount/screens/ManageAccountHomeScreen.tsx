import React from "react";
import { Alert, StyleSheet, View } from "react-native";
import { MenuActionButton } from "../../../components/Button/MenuActionButton.tsx";
import useAuthStore from "../../../stores/authStore.ts";
import useTeamStore from "../../../stores/teamStore.ts";
import useProfileStore from "../../../stores/profileStore.ts";

export const ManageAccountHomeScreen = () => {
  const { logout } = useAuthStore();
  const {
    data: { me, subscription },
  } = useProfileStore();
  const {
    data: { meTeamData },
    operations: { removeMember },
  } = useTeamStore();

  const displayManageTeam = () => {
    if (meTeamData && meTeamData.role === "leader") return true;

    return false;
  };

  const handleLeaveTeam = () => {
    if (!me) return;

    removeMember(me.id);
  };

  return (
    <View style={styles.container}>
      {displayManageTeam() && (
        <MenuActionButton label={"Manage team"} to={"ManageTeam"} />
      )}

      {subscription && (
        <MenuActionButton
          label={"Manage subscription"}
          to={"ManageSubscription"}
        />
      )}

      {meTeamData && (
        <MenuActionButton
          label={"Leave team"}
          onPress={() => {
            Alert.alert(
              "Leave your current team",
              "Are you sure you want to leave your current team?",
              [
                {
                  text: "Cancel",
                  onPress: () => {},
                  style: "cancel",
                },
                {
                  text: "OK",
                  onPress: () => {
                    handleLeaveTeam();
                  },
                },
              ],
            );
          }}
        />
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
