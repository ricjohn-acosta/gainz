import { create } from "zustand/esm";
import { supabase } from "../services/supabase";
import useAuthStore from "./authStore";
import { parseProfileQueryResult } from "./profile/helpers";
import {PostgrestError} from "@supabase/supabase-js";

interface ProfileState {
  data: {
    me?: any;
    team?: any;
  };
  operations: {
    getMeProfile: () => Promise<PostgrestError>;
    getTeamProfiles: () => Promise<any>;
  };
}

const useProfileStore = create<ProfileState>((set, get) => ({
  data: {
    me: null,
    team: null,
  },
  operations: {
    getMeProfile: async () => {
      const session = useAuthStore.getState().session;
      if (!session) return;

      const { data, error } = await supabase
        .from("profiles")
        .select(`*`)
        .eq("id", session.user.id);

      if (error) {
        console.error(error);
        return error;
      }
      if (data) {
        set({ data: { me: data[0] } });
        get().operations.getTeamProfiles();
      }
    },
    getTeamProfiles: async () => {
      const me = get().data.me;
      if (!me.team_id) return;

      const { data, error } = await supabase
        .from("profiles")
        .select(
          "*, hype_received:hype_activity!public_hype_activity_recipient_id_fkey( hype_points_received ), hype_given:hype_activity!public_hype_activity_sender_id_fkey( hype_points_received )",
        )
        .eq("team_id", me.team_id);

      const teamProfiles = data.map((profile) =>
        parseProfileQueryResult(profile),
      );

      set((state) => ({
        ...state,
        data: { ...state.data, team: teamProfiles },
      }));
      return data;
    },
  },
}));

export default useProfileStore;
