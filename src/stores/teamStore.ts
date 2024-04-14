import { create } from "zustand/esm";
import { supabase } from "../services/supabase";
import useAuthStore from "./authStore";
import { parseProfileQueryResult } from "./profile/helpers";
import useProfileStore from "./profileStore";

interface TeamState {
  data: {
    meTeamData?: any;
    myTeam?: any;
  };
  operations: {
    getMyTeam: () => Promise<any>;
  };
}

const useTeamStore = create<TeamState>((set, get) => ({
  data: {
    meTeamData: null,
    myTeam: null,
  },
  operations: {
    getMyTeam: async () => {
      const me = useProfileStore.getState().data.me;
      console.log(me.username);

      if (!me) return;
      console.log(me.username);

      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .eq("team_id", me.team_id);
      console.log(me.username, data);
      if (error) console.error(error);

      if (!data) {
        set({ data: { myTeam: null, meTeamData: null } });
      } else {
        const meTeamData = data.find((user) => user.profile_id === me.id);
        set({ data: { myTeam: data, meTeamData } });
      }
    },
  },
}));

export default useTeamStore;
