import React from "react";
import { Alert, StyleSheet, View } from "react-native";
import { MenuActionButton } from "../../../components/Button/MenuActionButton.tsx";
import useAuthStore from "../../../stores/authStore.ts";
import useTeamStore from "../../../stores/teamStore.ts";
import useProfileStore from "../../../stores/profileStore.ts";
import { useNavigation } from "@react-navigation/native";

export const ManageAccountHomeScreen = () => {
  const { logout } = useAuthStore();
  const {
    data: { me, subscription },
    operations: { deleteProfile },
  } = useProfileStore();
  const {
    data: { meTeamData },
    operations: { removeMember },
  } = useTeamStore();

  const navigation = useNavigation<any>();

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
        label={"Log out"}
        onPress={() => {
          Alert.alert("Log out?", "Are you sure you want to logout?", [
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

      <MenuActionButton
        label={"Delete account"}
        labelStyle={{ color: "red" }}
        onPress={() => {
          Alert.alert(
            "Delete account?",
            "Are you sure you want to permanently delete your account?",
            [
              {
                text: "Cancel",
                onPress: () => {},
                style: "cancel",
              },
              {
                text: "Yes",
                onPress: () => {
                  deleteProfile(me.id);
                },
              },
            ],
          );
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
