import { create } from "zustand";
import { supabase } from "../services/supabase";
import useProfileStore from "./profileStore";
import { PostgrestError } from "@supabase/supabase-js";
import useTeamStore from "./teamStore";

interface TeamState {
  data: {
    rewards: any;
  };
  operations: {
    getRewards: () => Promise<PostgrestError>;
    getTeamRewardsActivity: (
      teamId: number,
      from,
      to,
    ) => Promise<PostgrestError | Error | any>;
    redeemReward: (
      rewardId: number,
      rewardName: string,
      rewardAmount: number,
    ) => Promise<PostgrestError | Error>;
    addReward: (
      rewardName,
      rewardDescription,
      rewardAmount,
      quantity,
    ) => Promise<PostgrestError | Error>;
    deleteReward: (ids) => Promise<PostgrestError | Error>;
  };
}

const useRewardStore = create<TeamState>((set, get) => ({
  data: {
    rewards: null,
  },
  operations: {
    getRewards: async () => {
      const me = useProfileStore.getState().data.me;

      if (!me) return;

      const { data: rewardsData, error } = await supabase
        .from("rewards")
        .select("*")
        .or(`team_id.eq.${me.team_id},team_id.is.null`)
        .order("id", { ascending: true });

      if (error) {
        console.error(error);
        return error;
      }

      set((state) => ({
        ...state,
        data: { ...state.data, rewards: rewardsData },
      }));
    },
    getTeamRewardsActivity: async (teamId: number, from, to) => {
      const { data: rewardsActivityData, error } = await supabase
        .from("rewards_activity")
        .select("*")
        .order("created_at", { ascending: false })
        .range(from, to)
        .eq("team_id", teamId);

      if (error) {
        console.error(error);
        return error;
      }

      return rewardsActivityData;
    },
    addReward: async (
      rewardName,
      rewardDescription,
      rewardAmount,
      quantity,
    ) => {
      const meTeamData = useTeamStore.getState().data.meTeamData;

      const { error: insertError } = await supabase.from("rewards").insert({
        name: rewardName,
        description: rewardDescription,
        quantity,
        amount: rewardAmount,
        team_id: meTeamData.team_id,
      });

      if (insertError) {
        console.error(insertError);
        return insertError;
      }
    },
    deleteReward: async (ids) => {
      const { error: rewardDataError } = await supabase
        .from("rewards")
        .delete()
        .in("id", ids);

      if (rewardDataError) {
        console.error(rewardDataError);
        return rewardDataError;
      }
    },
    redeemReward: async (rewardId, rewardName, rewardAmount) => {
      const me = useProfileStore.getState().data.me;

      // Update team data so we have an updated hype points balance
      useTeamStore.getState().operations.getMyTeam();
      // Check if we have enough hype points balance to redeem item
      const meTeamData = useTeamStore.getState().operations.getMember(me.id);
      if (meTeamData.hype_redeemable < rewardAmount) {
        console.error("Insufficient hype points");
        return new Error("Insufficient hype points");
      }

      // We make sure that there is stock available for the reward
      const { data: rewardData, error: rewardDataError } = await supabase
        .from("rewards")
        .select("*")
        .eq("id", rewardId);

      if (rewardData[0].quantity === 0) {
        console.error("Stock depleted");
        return new Error("Stock depleted");
      }

      if (rewardDataError) {
        console.error(rewardDataError);
        return rewardDataError;
      }

      // A trigger will fire to decrement reward quantity by 1 when redeemed
      const { error: insertError } = await supabase
        .from("rewards_activity")
        .insert({
          redeemer_username: me.username,
          team_id: me.team_id,
          reward_name: rewardName,
          reward_id: rewardId,
          amount: rewardAmount,
          profile_id: me.id,
        });

      if (insertError) {
        console.error(insertError);
        return insertError;
      }

      get().operations.getRewards();
      // We've successfully redeemed a reward so we update the hype_redeemable value
      useTeamStore.getState().operations.getMyTeam();
    },
  },
}));

export default useRewardStore;
