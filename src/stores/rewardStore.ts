import { create } from "zustand";
import { supabase } from "../services/supabase";
import useProfileStore from "./profileStore";
import { PostgrestError } from "@supabase/supabase-js";

interface TeamState {
  data: {
    rewards: any;
  };
  operations: {
    getRewards: () => Promise<PostgrestError>;
    redeemReward: (rewardId, rewardName) => Promise<PostgrestError | Error>;
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
        .or(`team_id.eq.${me.team_id},team_id.eq.${0}`);

      if (error) {
        console.error(error);
        return error;
      }

      set((state) => ({
        ...state,
        data: { ...state.data, rewards: rewardsData },
      }));
    },
    redeemReward: async (rewardId, rewardName) => {
      const me = useProfileStore.getState().data.me;

      // We make sure that there is stock available for the reward
      const { data: rewardData, error: rewardDataError } = await supabase
        .from("rewards")
        .select("*")
        .eq("id", rewardId);

      if (rewardData[0].quantity === 0) {
        console.error('Stock depleted')
        return new Error('Stock depleted');
      }

      if (rewardDataError) {
        console.error(rewardDataError);
        return rewardDataError;
      }

      // A trigger will fire to decrement reward quantity by 1
      const { error: insertError } = await supabase
        .from("rewards_activity")
        .insert({
          redeemer_username: me.username,
          team_id: me.team_id,
          reward_name: rewardName,
          reward_id: rewardId,
        });

      if (insertError) {
        console.error(insertError);
        return insertError;
      }

      get().operations.getRewards();
    },
  },
}));

export default useRewardStore;
