import { create } from "zustand/esm";
import { PostgrestError } from "@supabase/supabase-js";
import { supabase } from "../services/supabase";

interface HypeState {
  data: {
    hypeActivity: any;
  };
  operations: {
    getTeamHypeActivity: (teamId: number) => Promise<PostgrestError | any>;
    getUserHypeActivity: (uid: string) => any;
  };
}

const useHypeStore = create<HypeState>((set, get) => ({
  data: {
    hypeActivity: null,
  },
  operations: {
    getTeamHypeActivity: async (teamId) => {
      const { data, error } = await supabase
        .from("hype_activity")
        .select("*")
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
  },
}));

export default useHypeStore;
