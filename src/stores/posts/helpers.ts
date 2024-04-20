import moment from "moment/moment";

export const buildPostsListData = (postData, commentData) => {
  const teamPostsData = postData.map((post) => {
    return {
      postId: post.post_id,
      username: post.posterData.username,
      avatar: post.posterData.avatar_url,
      datePosted: post.created_at,
      content: post.content,
      comments: [],
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
      datePosted: comment.created_at,
      content: comment.content,
    });
  });

  teamPostsData.sort(
    (a, b) => moment(b.datePosted).valueOf() - moment(a.datePosted).valueOf(),
  );

  return teamPostsData;
};
