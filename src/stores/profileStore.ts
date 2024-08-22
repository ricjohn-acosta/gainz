import { create } from "zustand/esm";
import { supabase } from "../services/supabase";
import useAuthStore from "./authStore";
import { PostgrestError } from "@supabase/supabase-js";
import teamStore from "./teamStore.ts";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import postStore from "./postStore.ts";
import rewardStore from "./rewardStore.ts";

interface ProfileState {
  data: {
    me?: any;
    loadingSubscription?: boolean;
    subscription?: any;
  };
  operations: {
    getMeProfile: () => Promise<PostgrestError | any>;
    getUserProfileByUsername: (username: string) => Promise<PostgrestError>;
    getSubscription: () => Promise<PostgrestError>;
    deleteProfile: (uid: string) => Promise<PostgrestError>;
    reloadProfile: () => void;
  };
}

const useProfileStore = create<ProfileState>((set, get) => ({
  data: {
    me: null,
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
    getSubscription: async () => {
      set((state) => ({
        ...state,
        data: { ...state.data, loadingSubscription: true },
      }));

      set((state) => ({
        ...state,
        data: { ...state.data, subscription, loadingSubscription: false },
      }));
      teamStore.getState().operations.updateTeamRestriction(subscription);
    },
    deleteProfile: async (uid) => {
      if (!uid) return;

      useAuthStore.getState().logout();

      const tokenString = await AsyncStorage.getItem(
        "sb-chwtkqhuwdbvpgqhdjli-auth-token",
      );
      const tokenData = JSON.parse(tokenString);

      const { error: deleteError } = await supabase.functions.invoke(
        "supabase-delete-user",
        {
          body: { userId: tokenData.user.id },
        },
      );

      if (deleteError) {
        Alert.alert("Error", deleteError.message);
        return deleteError;
      }
    },
    reloadProfile: async () => {
      get()
        .operations.getMeProfile()
        .then((_) => {
          teamStore.getState().operations.getMyTeam();
          postStore.getState().operations.getTeamPosts(0, 3);
          rewardStore.getState().operations.getRewards();
        });
    },
  },
}));

export default useProfileStore;
