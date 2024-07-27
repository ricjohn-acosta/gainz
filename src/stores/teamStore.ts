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
    restricted?: boolean;
  };
  operations: {
    createTeam: () => Promise<PostgrestError>;
    getMyTeam: () => Promise<PostgrestError>;
    getHypeRank: (uid: string) => number;
    getMember: (uid: string) => any;
    getTeamRestriction: (teamId: string) => Promise<boolean>;
    removeMember: (uid: string) => void;
    updateTeamRestriction: (subscription: any) => boolean;
  };
}

const useTeamStore = create<TeamState>((set, get) => ({
  data: {
    meTeamData: null,
    myTeam: null,
    restricted: true,
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

      if (!data || !data.length === 0) {
        set((state) => ({
          ...state,
          data: { ...state.data, myTeam: null, meTeamData: null },
        }));
      } else {
        const meTeamData = data.filter((user) => user.profile_id === me.id);
        set((state) => ({
          ...state,
          data: { ...state.data, myTeam: data, meTeamData: meTeamData[0] },
        }));
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
    removeMember: async (uid: string) => {
      // remove from team_members table
      const { error: deleteError } = await supabase
        .from("team_members")
        .delete()
        .eq("profile_id", uid);

      if (deleteError) {
        Alert.alert("Error", "deleteError");
        return;
      }

      // get original team_id from teams table
      const { data, error: getOriginalTeamIdError } = await supabase
        .from("teams")
        .select("*")
        .eq("owner_id", uid);

      if (getOriginalTeamIdError) {
        Alert.alert("Error", "getOriginalTeamIdError");
        return;
      }

      const originalTeamId = data[0].team_id;
      if (!originalTeamId) {
        Alert.alert("Error", "Something went wrong while removing this member");
        return;
      }
      // set team_id in profiles table back to its original id
      const { error: setTeamIdError } = await supabase
        .from("profiles")
        .update({ team_id: originalTeamId })
        .eq("id", uid);

      if (setTeamIdError) {
        Alert.alert("Error", "setTeamIdError");
        return;
      }

      get().operations.getMyTeam();
    },
    getTeamRestriction: async (teamId) => {
      const { data, error: getTeamRestrictionError } = await supabase
        .from("teams")
        .select("*")
        .eq("team_id", teamId);
      const isRestricted = data[0].restricted;

      if (getTeamRestrictionError) {
        Alert.alert("Error", getTeamRestrictionError.message);
        return true;
      }

      set((state) => ({
        ...state,
        data: { ...state.data, restricted: isRestricted },
      }));
      return isRestricted;
    },
    updateTeamRestriction: async (subscription) => {
      const teamId = get().data.meTeamData.team_id;

      if (!subscription) {
        get().operations.getTeamRestriction(teamId);
        return;
      }
      const { error: updateTeamRestrictionError } = await supabase
        .from("teams")
        .update({
          restricted: false,
        })
        .eq("team_id", teamId);

      if (updateTeamRestrictionError) {
        Alert.alert("Error", updateTeamRestrictionError.message);
        return updateTeamRestrictionError;
      }

      get().operations.getTeamRestriction(team_id);
    },
  },
}));

export default useTeamStore;
