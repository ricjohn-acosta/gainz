import { supabase } from "../../../services/supabase";
import useProfileStore from "../../../stores/profileStore";

export const useInviteMember = () => {
  const {
    data: { me },
  } = useProfileStore();

  const sendInvite = async (recipientEmail: string) => {
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
        .from("teams")
        .select(
          `team_name, user_invites!user_invites_team_id_fkey( username, recipient_email, team_id, sender_id, status )
      `,
        )
        .eq("user_invites.recipient_email", me.email)
        .eq("user_invites.status", "pending");

      if (error) {
        console.error(error);
        return [];
      }

      if (data.length > 0 && data[0].user_invites[0]) {
        return { ...data[0].user_invites[0], team_name: data[0].team_name };
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
  return {
    operations: {
      acceptInvite,
      fetchInvites,
      sendInvite,
      declineInvite,
    },
  };
};
