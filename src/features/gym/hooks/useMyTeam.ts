import { useEffect, useState } from "react";
import useTeamStore from "../../../stores/teamStore";
import useProfileStore from "../../../stores/profileStore";

export const useMyTeam = () => {
  const {
    data: { me: meData },
  } = useProfileStore();
  const {
    data: { myTeam },
    operations: { getMyTeam },
  } = useTeamStore();

  useEffect(() => {
    getMyTeam();
  }, []);

  const meTeamData = myTeam && myTeam.find((user) => user.profile_id === meData.id);
  const canInvite = !meTeamData || meTeamData.role === "leader"

  return {
    data: {
      myTeam,
      meTeamData,
      canInvite,
    },
  };
};
