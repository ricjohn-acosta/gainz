import moment from "moment/moment";

export const buildPostsListData = (
  postData,
  hypeActivityData,
  redeemActivityData,
) => {
  const teamPostsData = postData.map((post) => {
    return {
      assets: post.media,
      profileId: post.profile_id,
      postId: post.post_id,
      username: post.posterData.username,
      avatar: post.posterData.avatar_url,
      likes: post.postLikesData,
      datePosted: post.created_at,
      content: post.content,
      comments: post.postComments.map((comment) => {
        return {
          profileId: comment.profile_id,
          commentId: comment.comment_id,
          username: comment.commenterData.username,
          avatar: comment.commenterData.avatar_url,
          likes: comment.commentLikesData,
          datePosted: comment.created_at,
          content: comment.content,
        };
      }),
    };
  });

  const teamHypeActivityData = hypeActivityData.map((hypeActivity) => {
    return {
      senderUsername: hypeActivity.sender_username,
      senderId: hypeActivity.sender_id,
      recipientUsername: hypeActivity.recipient_username,
      recipientId: hypeActivity.recipient_id,
      hypeReceived: hypeActivity.hype_points_received,
      hypeMessage: hypeActivity.hype_message,
      datePosted: hypeActivity.created_at,
      entityType: "hypeActivity",
    };
  });

  const teamRewardsActivityData = redeemActivityData.map((redeemActivity) => {
    return {
      redeemerId: redeemActivity.profile_id,
      redeemerUsername: redeemActivity.redeemer_username,
      rewardName: redeemActivity.reward_name,
      amount: redeemActivity.amount,
      datePosted: redeemActivity.created_at,
      entityType: "redeemActivity",
    };
  });

  const activityData = [
    ...teamPostsData,
    ...teamHypeActivityData,
    ...teamRewardsActivityData,
  ];

  activityData.sort(
    (a, b) => moment(b.datePosted).valueOf() - moment(a.datePosted).valueOf(),
  );

  return activityData;
};
