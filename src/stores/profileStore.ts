import { create } from "zustand/esm";
import { supabase } from "../services/supabase";
import useAuthStore from "./authStore";
import { parseProfileQueryResult } from "./profile/helpers";
import { PostgrestError } from "@supabase/supabase-js";

interface ProfileState {
  data: {
    me?: any;
    loadingSubscription?: boolean;
    subscription?: any;
    team?: any;
  };
  operations: {
    getMeProfile: () => Promise<PostgrestError | any>;
    getUserProfileByUsername: (username: string) => Promise<PostgrestError>;
    getTeamProfiles: () => Promise<any>;
    getSubscription: () => Promise<PostgrestError>;
  };
}

const useProfileStore = create<ProfileState>((set, get) => ({
  data: {
    me: null,
    team: null,
    subscription: null,
    loadingSubscription: false,
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
        set((state) => ({
          ...state,
          data: { me: data[0] },
        }));

        get().operations.getTeamProfiles();
      }
    },
    getUserProfileByUsername: async (username: string) => {
      const { data, error } = await supabase
        .from("profiles")
        .select(`*`)
        .eq("username", username);

      if (error) {
        console.error(error);
        return error;
      }

      return data[0];
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
    getSubscription: async () => {
      set((state) => ({
        ...state,
        data: { ...state.data, loadingSubscription: true },
      }));
      const {
        data: { subscription },
        error: fnError,
      } = await supabase.functions.invoke("stripe-user-subscription");

      if (fnError) {
        return fnError;
      }

      set((state) => ({
        ...state,
        data: { ...state.data, subscription },
      }));
      set((state) => ({
        ...state,
        data: { ...state.data, loadingSubscription: false },
      }));
    },
  },
}));

export default useProfileStore;
