import { supabase } from "../../../services/supabase";

export const inviteValidation = async (email: string) => {
  if (!email || email === "") {
    return "Required";
  } else if (!checkEmailFormat(email)) {
    return "Invalid email";
  } else if (await checkUserHasTeam(email)) {
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
  const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return regex.test(email);
};
