import { supabase } from "../../../services/supabase";
import useProfileStore from "../../../stores/profileStore";
import useTeamStore from "../../../stores/teamStore.ts";

export const useInviteMember = () => {
  const {
    data: { me },
  } = useProfileStore();
  const {
    data: { meTeamData },
  } = useTeamStore();

  const sendInvite = async (recipientEmail: string) => {

    if (!meTeamData) {
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
  return {
    operations: {
      acceptInvite,
      fetchInvites,
      sendInvite,
      declineInvite,
    },
  };
};
