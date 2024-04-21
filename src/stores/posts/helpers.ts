import moment from "moment/moment";

export const buildPostsListData = (postData, commentData, hypeActivityData) => {
  const teamPostsData = postData.map((post) => {
    return {
      postId: post.post_id,
      username: post.posterData.username,
      avatar: post.posterData.avatar_url,
      likes: post.postLikesData,
      datePosted: post.created_at,
      content: post.content,
      comments: [],
    };
  });

  const teamHypeActivityData = hypeActivityData.map((hypeActivity) => {
    return {
      senderUsername: hypeActivity.sender_username,
      recipientUsername: hypeActivity.recipient_username,
      hypeReceived: hypeActivity.hype_points_received,
      hypeMessage: hypeActivity.hype_message,
      datePosted: hypeActivity.created_at,
      entityType: 'hypeActivity'
    };
  });

  // Attach comments into posts
  commentData.forEach((comment) => {
    const associatedPost = teamPostsData.find(
      (post) => post.postId === comment.post_id,
    );
    associatedPost.comments.push({
      commentId: comment.comment_id,
      username: comment.commenterData.username,
      avatar: comment.commenterData.avatar_url,
      likes: comment.commentLikesData,
      datePosted: comment.created_at,
      content: comment.content,
    });
  });

  const activityData = [...teamPostsData, ...teamHypeActivityData]

  activityData.sort(
    (a, b) => moment(b.datePosted).valueOf() - moment(a.datePosted).valueOf(),
  );

  return activityData;
};