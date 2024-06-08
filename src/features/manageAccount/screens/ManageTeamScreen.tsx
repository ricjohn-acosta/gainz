import React from "react";
import { Alert, FlatList, StyleSheet, View } from "react-native";
import useTeamStore from "../../../stores/teamStore.ts";
import BasicText from "../../../components/Text/BasicText.tsx";
import { PrimaryButton } from "../../../components/Button/PrimaryButton.tsx";

export const ManageTeamScreen = () => {
  const {
    data: { myTeam, meTeamData },
    operations: { removeMember },
  } = useTeamStore();

  const getAllMembers = () => {
    return myTeam.filter((user) => user.profile_id !== meTeamData.profile_id);
  };

  const handleRemoveFromTeam = (id: string, username: string) => {
    if (!id) return;

    Alert.alert(
      "Remove member",
      `Are you sure you want to remove ${username} from your team?`,
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            removeMember(id);
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={getAllMembers()}
        renderItem={(data) => {
          return (
            <View style={styles.memberContainer}>
              <BasicText style={styles.username}>
                {data.item.username}
              </BasicText>
              <PrimaryButton
                onPress={() =>
                  handleRemoveFromTeam(data.item.profile_id, data.item.username)
                }
                style={{ backgroundColor: "#ec0a0a" }}
                text={"Remove"}
              />
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 12,
  },
  memberContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  username: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
    color: "#000000",
  },
});
