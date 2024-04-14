export const parseProfileQueryResult = (queryResult) => {
  const profile = {
    avatar_url: queryResult.avatar_url,
    date_joined: queryResult.date_joined,
    hype_givable: queryResult.hype_givable,
    hype_given: getHypeCount(queryResult.hype_given),
    hype_received: getHypeCount(queryResult.hype_received),
    hype_redeemable: queryResult.hype_redeemable,
    id: queryResult.id,
    redeemed_rewards: queryResult.redeemed_rewards,
    team_id: queryResult.team_id,
    updated_at: queryResult.updated_at,
    username: queryResult.username,
    email: queryResult.email
  };

  return profile;
};

// Calculates both how much a user has received and given
const getHypeCount = (hypeActivity) => {
  if (!hypeActivity || hypeActivity.length === 0) return 0;

  return hypeActivity.reduce((sum, item) => sum + item.hype_points_received, 0);
};
