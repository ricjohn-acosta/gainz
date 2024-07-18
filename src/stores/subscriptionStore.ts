import { create } from "zustand/esm";
import { PostgrestError } from "@supabase/supabase-js";
import { supabase } from "../services/supabase";
import useProfileStore from "./profileStore.ts";
import { Alert } from "react-native";
import useTeamStore from "./teamStore.ts";
import Purchases from "react-native-purchases";

interface SubscriptionState {
  data: {
    offerings: any;
    customer: any;
  };
  operations: {
    setOfferings: (offerings) => void;
    setCustomer: (customer) => void;
    getSubscriptionId: () => Promise<string | undefined>;
    saveUserSubscriptionId: (id) => PostgrestError;
    showInvitePaywall: () => Promise<boolean>;
    showFeaturePaywall: () => Promise<boolean>;
    restorePurchases: () => Promise<void>;
  };
}

const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  data: {
    offerings: null,
    customer: null,
  },
  operations: {
    setOfferings: (offerings) => {
      set((state) => ({
        ...state,
        data: { ...state.data, offerings },
      }));
    },
    setCustomer: (customer) => {
      set((state) => ({
        ...state,
        data: { ...state.data, customer },
      }));
    },
    restorePurchases: async () => {
      try {
        const restoredCustomerInfo = await Purchases.restorePurchases();
        set((state) => ({
          ...state,
          data: { ...state.data, customer: restoredCustomerInfo },
        }));
      } catch (e) {
        Alert.alert("Error", "Something went wrong restoring purchases");
      }
    },
    showInvitePaywall: async () => {
      const error = await useTeamStore.getState().operations.getMyTeam();

      if (error) {
        Alert.alert("Error", "Something went wrong with inviting members!");
        return;
      }

      const customerInfo = await get().data.customer;
      const me = useProfileStore.getState().data.me;
      const myTeam = useTeamStore.getState().data.myTeam;

      if (me.is_founder) {
        return false;
      }

      const teamLength =
        myTeam && myTeam.length > 0
          ? myTeam.filter((user) => user.profile_id !== me.id).length
          : 0;

      if (
        teamLength >= 3 &&
        (!customerInfo || customerInfo.activeSubscriptions.length === 0)
      ) {
        return true;
      }

      return false;
    },
    showFeaturePaywall: async () => {
      const error = await useTeamStore.getState().operations.getMyTeam();

      if (error) {
        Alert.alert("Error", "Something went wrong with giving hype!");
        return;
      }

      const myTeam = useTeamStore.getState().data.myTeam;
      const leader =
        myTeam &&
        myTeam.length > 0 &&
        myTeam.find((member) => member.role === "leader");

      if (myTeam && myTeam.length <= 3) {
        return false;
      }

      if (leader) {
        const { data: profilesData, profilesError } = await supabase
          .from("profiles")
          .select("*")
          .match({ id: leader.profile_id, is_founder: true });

        if (!profilesError && profilesData.length > 0) {
          return false;
        }

        const { data, selectError } = await supabase
          .from("rc_customers")
          .select("*")
          .eq("profile_id", leader.profile_id);

        if (selectError) {
          Alert.alert("Error", selectError.message);
          return;
        }

        return (
          data.length === 0 || data[0].subscription_status === "UNSUBSCRIBED"
        );
      }

      return false;
    },
    getSubscriptionId: async () => {
      const me = useProfileStore.getState().data.me;

      if (!me) return;

      const { data, selectError } = await supabase
        .from("rc_customers")
        .select("*")
        .eq("profile_id", me.id);

      if (selectError) {
        Alert.alert("Error", selectError.message);
        return;
      }

      if (data) {
        return data[0];
      }
    },
    saveUserSubscriptionId: async (id) => {
      const me = useProfileStore.getState().data.me;

      if (!me) return;

      const { data, selectError } = await supabase
        .from("rc_customers")
        .select("*")
        .eq("rc_customer_id", id);

      if (selectError) {
        Alert.alert("Error", selectError.message);
        return;
      }

      if (data.length > 0) return;

      const { insertError } = await supabase.from("rc_customers").insert({
        profile_id: me.id,
        rc_customer_id: id,
      });

      if (insertError) {
        Alert.alert("Error", insertError.message);
      }
    },
  },
}));

export default useSubscriptionStore;
