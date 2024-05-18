import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import useProfileStore from "../../../stores/profileStore";
import { PrimaryButton } from "../../../components/Button/PrimaryButton";
import { FontAwesome5 } from "@expo/vector-icons";
import { useInviteMember } from "../hooks/useInviteMember";
import useTeamStore from "../../../stores/teamStore";
import BasicText from "../../../components/Text/BasicText.tsx";

export const AcceptInvitation = () => {
  const {
    data: { me },
    operations: { getMeProfile },
  } = useProfileStore();
  const {
    data: {meTeamData},
    operations: { getMyTeam },
  } = useTeamStore();
  const {
    operations: { acceptInvite, fetchInvites, declineInvite },
  } = useInviteMember();

  const [invitation, setInvitation] = useState(null);

  const fetchInvitesData = async () => {
    try {
      const fetchedInvites = await fetchInvites(me.email);
      setInvitation(fetchedInvites);
    } catch (error) {
      console.error("Error fetching invites:", error);
    }
  };

  const handleAcceptInvite = async () => {
    const error = await acceptInvite(
      invitation.team_id,
    );

    if (!error) {
      setInvitation(null);
      getMeProfile().then(error => {
        if (error) return
        getMyTeam()
      })
    }
  };

  const handleDeclineInvite = () => {
    declineInvite(invitation.sender_id);
    setInvitation(null);
  };

  useEffect(() => {
    if (!me) return;
    fetchInvitesData();
  }, [me]);

  if (!invitation || invitation.length === 0) return null;
  return (
    <View style={styles.container}>
      <View style={styles.message}>
        <Text style={styles.textContainer}>
          <Text style={{ fontFamily: "Poppins-Bold" }}>{invitation.username} <BasicText>wants you to join their team!</BasicText></Text>

        </Text>
      </View>

      <View style={styles.actionButtons}>
        <PrimaryButton
          onPress={handleAcceptInvite}
          style={{ padding: 8, borderRadius: 6 }}
          textStyle={{ fontSize: 12 }}
          text={"Accept!"}
        />
        <PrimaryButton
          onPress={handleDeclineInvite}
          style={{
            padding: 8,
            borderRadius: 6,
            backgroundColor: "#ff046d",
          }}
          textStyle={{ fontSize: 12 }}
          text={"Decline"}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#6cff54",
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 20
  },
  message: {
    alignItems: "center",
  },
  textContainer: {
    textAlign: "center",
  },
  actionButtons: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
});
