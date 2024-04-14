export const sortTeamBy = (direction, key, team) => {
  if (!team) return [];
  let result;

  if (direction === "asc") {
    result = team.sort((a, b) => {
      return a[key] - b[key];
    });
  }

  if (direction === "desc") {
    result = team.sort((a, b) => {
      return b[key] - a[key];
    });
  }

  return result;
};
