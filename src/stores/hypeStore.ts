import { create } from "zustand/esm";
import { PostgrestError } from "@supabase/supabase-js";
import { supabase } from "../services/supabase";
import useTeamStore from "./teamStore.ts";

interface HypeState {
  data: {
    hypeActivity: any;
  };
  operations: {
    getTeamHypeActivity: (
      teamId: number,
      from,
      to,
    ) => Promise<PostgrestError | any>;
    getUserHypeActivity: (uid: string) => any;
    getUnseenHypeReceivedNotifications: () => Promise<any>;
    updateNotificationsAsSeen: (ids) => void;
  };
}

const useHypeStore = create<HypeState>((set, get) => ({
  data: {
    hypeActivity: null,
  },
  operations: {
    getTeamHypeActivity: async (teamId, from, to) => {
      const { data, error } = await supabase
        .from("hype_activity")
        .select("*")
        .order("created_at", { ascending: false })
        .range(from, to)
        .eq("team_id", teamId);
      if (error) {
        console.error(error);
        return error;
      }

      set({ data: { hypeActivity: data } });
      return data;
    },
    getUserHypeActivity: async (username: string) => {
      const { data, error } = await supabase
        .from("hype_activity")
        .select("*")
        .or(`sender_username.eq.${username},recipient_username.eq.${username}`);

      if (error) {
        console.error(error);
        return error;
      }

      return data;
    },
    getUnseenHypeReceivedNotifications: async () => {
      await useTeamStore.getState().operations.getMyTeam();
      const me = useTeamStore.getState().data.meTeamData;

      if (!me) return;

      const { data, error } = await supabase
        .from("hype_activity")
        .select("*")
        .match({
          recipient_id: me.profile_id,
          seen: false,
        });

      if (error) {
        console.error("error fetching event hype received");
        return;
      }

      return data;
    },
    updateNotificationsAsSeen: async (ids) => {
      const me = useTeamStore.getState().data.meTeamData;

      if (!me) return;

      const { error } = await supabase
        .from("hype_activity")
        .update({ seen: true })
        .in("id", ids); // List of ids for the rows you want to update

      if (error) {
        console.error(error.message);
      }
    },
  },
}));

export default useHypeStore;
