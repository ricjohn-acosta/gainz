import { useEffect, useState } from "react";
import useTeamStore from "../../../stores/teamStore";
import useProfileStore from "../../../stores/profileStore";
import { sortTeamBy } from "../../../helpers/teamSorter.ts";

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

  const meTeamData =
    myTeam && myTeam.find((user) => user.profile_id === meData.id);
  const canInvite = !meTeamData || meTeamData.role === "leader";

  const hasNoHypePointsGiven = () => {
    if (!myTeam) return;
    let result = true;
    myTeam.forEach((item: any) => {
      if (item.hype_received !== 0) {
        result = false;
      }
    });
    return result;
  };

  return {
    data: {
      myTeam,
      meTeamData,
      canInvite,
      hasNoHypePointsGiven: hasNoHypePointsGiven(),
    },
  };
};
