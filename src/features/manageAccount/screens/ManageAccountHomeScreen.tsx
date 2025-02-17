import React from "react";
import { Alert, StyleSheet, View } from "react-native";
import { MenuActionButton } from "../../../components/Button/MenuActionButton.tsx";
import useAuthStore from "../../../stores/authStore.ts";
import useTeamStore from "../../../stores/teamStore.ts";
import useProfileStore from "../../../stores/profileStore.ts";
import { useNavigation } from "@react-navigation/native";
import useSubscriptionStore from "../../../stores/subscriptionStore.ts";
import BasicText from "../../../components/Text/BasicText.tsx";
import Constants from "expo-constants";
import { MaterialIcons } from "@expo/vector-icons";

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
  const {
    operations: { restorePurchases },
  } = useSubscriptionStore();

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
      <View style={styles.myDetailsContainer}>
        <BasicText style={styles.myUsername}>
          <BasicText>Hi, </BasicText>
          {me.username}
        </BasicText>

        <View style={styles.myEmailContainer}>
          <MaterialIcons name="email" size={16} color="#1f30fb" />
          <BasicText style={styles.myEmail}>{me.email}</BasicText>
        </View>
      </View>
      <MenuActionButton
        label={"How to use Kapaii"}
        onPress={() => {
          navigation.navigate("Tutorial", {
            fromScreen: "ManageAccountHomeScreen",
          });
        }}
      />

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


      {/*<MenuActionButton*/}
      {/*  label={"Restore purchases"}*/}
      {/*  labelStyle={{ color: "#1f30fb" }}*/}
      {/*  onPress={() => {*/}
      {/*    Alert.alert(*/}
      {/*      "Restore purchases?",*/}
      {/*      "Restore purchases associated with this account?",*/}
      {/*      [*/}
      {/*        {*/}
      {/*          text: "Cancel",*/}
      {/*          onPress: () => {},*/}
      {/*          style: "cancel",*/}
      {/*        },*/}
      {/*        {*/}
      {/*          text: "Yes",*/}
      {/*          onPress: () => {*/}
      {/*            restorePurchases();*/}
      {/*          },*/}
      {/*        },*/}
      {/*      ],*/}
      {/*    );*/}
      {/*  }}*/}
      {/*/>*/}

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
      <BasicText>v{Constants.expoConfig.version}</BasicText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 12,
  },
  myDetailsContainer: {
    marginBottom: 30,
  },
  myUsername: {
    color: "#1f30fb",
    fontSize: 24,
    fontFamily: "Poppins-Bold",
  },
  myEmailContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  myEmail: {
    color: "#1f30fb",
  },
});
