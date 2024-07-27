import { supabase } from "../../../services/supabase";
import useProfileStore from "../../../stores/profileStore";
import useTeamStore from "../../../stores/teamStore.ts";
import { Alert } from "react-native";

export const useInviteMember = () => {
  const {
    data: { me },
  } = useProfileStore();
  const {
    data: { myTeam },
  } = useTeamStore();

  const sendInvite = async (recipientEmail: string) => {
    if (!me) return;

    const inviteExists = await checkIfInviteExists(recipientEmail, me.team_id);
    if (inviteExists) {
      Alert.alert("User has already been invited to your team.");
      return;
    }

    const { data, error: fetchError } = await supabase
      .from("team_members")
      .select("*")
      .eq("profile_id", me.id);

    const meTeamDataExists = data[0];

    if (fetchError) {
      console.error(fetchError);
      return fetchError;
    }

    if (!meTeamDataExists) {
      const { error } = await supabase.from("team_members").insert({
        username: me.username,
        team_id: me.team_id,
        profile_id: me.id,
        role: "leader",
        email: me.email,
      });

      if (error) {
        console.error(error);
        return error;
      }
    }

    const { error } = await supabase.from("user_invites").insert({
      sender_id: me.id,
      recipient_email: recipientEmail,
      username: me.username,
      team_id: me.team_id,
      status: "pending",
    });

    if (error) {
      console.error(error);
      return error;
    }

    const { error: sendgridError } = await supabase.functions.invoke(
      "sendgrid-email",
      {
        body: { recipientEmail },
      },
    );

    if (error) console.error(sendgridError);
  };

  const acceptInvite = async (teamId: number) => {
    if (!teamId) return;

    const { error } = await supabase.from("team_members").insert({
      username: me.username,
      team_id: teamId,
      profile_id: me.id,
      role: "member",
      email: me.email,
    });

    if (error) {
      console.error(error);
      return error;
    }
  };

  const fetchInvites = async (recipientEmail: string) => {
    try {
      if (!recipientEmail) return [];

      const { data, error } = await supabase
        .from("user_invites")
        .select("*")
        .eq("recipient_email", me.email)
        .or("status.eq.pending");

      if (error) {
        console.error(error);
        return [];
      }

      if (data.length > 0) {
        return {
          username: data[0].username,
          team_id: data[0].team_id,
          sender_id: data[0].sender_id,
        };
      }
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const declineInvite = async (senderId: string) => {
    if (!senderId) return;

    const { error } = await supabase
      .from("user_invites")
      .update({
        status: "declined",
      })
      .eq("sender_id", senderId);

    if (error) {
      console.error(error);
    }
  };

  const freeMemberCount = () => {
    if (!myTeam) return;
    const freeMemberLimit = 3;

    return (
      freeMemberLimit -
      myTeam.filter((member) => member.profile_id !== me.id).length
    );
  };

  const checkIfInviteExists = async (recipientEmail, teamId) => {
    const { data, error } = await supabase
      .from("user_invites")
      .select("*")
      .match({
        recipient_email: recipientEmail,
        team_id: teamId,
        status: "pending",
      });

    if (error) {
      console.error("Error checking if invite exists");
      return false;
    }

    return data.length > 0;
  };

  return {
    data: {
      freeMemberCount: freeMemberCount(),
    },
    operations: {
      acceptInvite,
      fetchInvites,
      sendInvite,
      declineInvite,
    },
  };
};
