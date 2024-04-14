import { supabase } from "../../../services/supabase";

export const inviteValidation = async (email: string) => {
  if (!email || email === "") {
    return "Please enter an email";
  } else if (await checkUserHasTeam(email) && checkEmailFormat(email)) {
    return "User already has a team";
  }

  return true;
};

const checkUserHasTeam = async (email: string) => {
  const { data: teamMemberData, error: getTeamMemberError } = await supabase
    .from("team_members")
    .select("*")
    .eq("email", email);

  if (getTeamMemberError) {
    console.error(getTeamMemberError)
    return false
  }
  return teamMemberData.length !== 0
};

const checkEmailFormat = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};
