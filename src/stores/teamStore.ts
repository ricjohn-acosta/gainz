import { create } from "zustand/esm";
import { supabase } from "../services/supabase";
import useProfileStore from "./profileStore";
import { PostgrestError } from "@supabase/supabase-js";
import { sortTeamBy } from "../helpers/teamSorter";
import { Alert } from "react-native";

interface TeamState {
  data: {
    meTeamData?: any;
    myTeam?: any;
  };
  operations: {
    createTeam: () => Promise<PostgrestError>;
    getMyTeam: () => Promise<PostgrestError>;
    getHypeRank: (uid: string) => number;
    getMember: (uid: string) => any;
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

      if (!me) return;

      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .eq("team_id", me.team_id);
      if (error) {
        console.error(error);
        return error;
      }

      if (!data) {
        set({ data: { myTeam: null, meTeamData: null } });
      } else {
        const meTeamData = data.find((user) => user.profile_id === me.id);
        set({ data: { myTeam: data, meTeamData } });
      }
    },
    getHypeRank: (uid: string) => {
      const team = get().data.myTeam;
      return (
        sortTeamBy("desc", "hype_received", team).findIndex(
          (member) => member.profile_id === uid,
        ) + 1
      );
    },
    getMember: (uid: string) => {
      const team = get().data.myTeam;
      if (!team) return null;
      return team.find((user) => user.profile_id === uid);
    },
    createTeam: (uid: string) => {
      const team = get().data.myTeam;
      if (!team) return null;
      return team.find((user) => user.profile_id === uid);
    },
  },
}));

export default useTeamStore;
