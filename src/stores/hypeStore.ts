import { create } from "zustand/esm/index";
import { PostgrestError } from "@supabase/supabase-js";
import { supabase } from "../services/supabase";

interface HypeState {
  data: {
    hypeActivity: any;
  };
  operations: {
    getAllHypeActivity: () => Promise<PostgrestError>;
    getUserHypeActivity: (uid: string) => any;
  };
}

const useHypeStore = create<HypeState>((set, get) => ({
  data: {
    hypeActivity: null,
  },
  operations: {
    getAllHypeActivity: async () => {
      const { data, error } = await supabase.from("hype_activity").select("*");
      if (error) {
        console.error(error);
        return error;
      }
      set({ data: { hypeActivity: data } });
    },
    getUserHypeActivity: async (username: string) => {
      const { data, error } = await supabase
        .from("hype_activity")
        .select("*")
        .or(`sender_username.eq.${username},recipient_username.eq.${username}`)

      if (error) {
        console.error(error);
        return error;
      }

      return data
    },
  },
}));

export default useHypeStore;
