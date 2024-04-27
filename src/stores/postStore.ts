import { create } from "zustand/esm";
import { supabase } from "../services/supabase";
import useProfileStore from "./profileStore";
import { PostgrestError } from "@supabase/supabase-js";
import { sortTeamBy } from "../helpers/teamSorter";
import { buildPostsListData } from "./posts/helpers";
import useHypeStore from "./hypeStore";
import useRewardStore from "./rewardStore";

interface PostState {
  data: {
    teamPostsData?: any;
  };
  operations: {
    getTeamPosts: () => Promise<PostgrestError>;
    createPost: (content) => Promise<PostgrestError>;
    addComment: (content, postId) => Promise<PostgrestError>;
    like: (id, entityType) => Promise<PostgrestError>;
    unlike: (id, entityType) => Promise<PostgrestError>;
  };
}

const usePostStore = create<PostState>((set, get) => ({
  data: {
    teamPostsData: null,
  },
  operations: {
    getTeamPosts: async () => {
      const me = useProfileStore.getState().data.me;

      if (!me) {
        console.error("Error: Not authenticated");
        return;
      }

      const { data: postData, error: postDataError } = await supabase
        .from("posts")
        .select(
          `
          *,
          posterData:profiles ( username, avatar_url ),
          postLikesData:post_likes!public_post_likes_post_id_fkey( profile_id )
        `,
        )
        .eq("team_id", me.team_id);

      const { data: commentData, error: commentDataError } = await supabase
        .from("comments")
        .select(
          `
          *,
          commenterData:profiles ( username, avatar_url ),
          commentLikesData:comment_likes!public_comment_likes_comment_id_fkey( profile_id )
        `,
        )
        .eq("team_id", me.team_id);

      if (postDataError) {
        console.error(postDataError);
        return postDataError;
      }

      if (commentDataError) {
        console.error(commentDataError);
        return commentDataError;
      }

      const hypeActivityData = await useHypeStore
        .getState()
        .operations.getTeamHypeActivity(me.team_id);
      const redeemActivityData = await useRewardStore
        .getState()
        .operations.getTeamRewardsActivity(me.team_id);
      const teamPostsData = buildPostsListData(
        postData,
        commentData,
        hypeActivityData,
        redeemActivityData,
      );

      set((state) => ({
        ...state,
        data: { ...state.data, teamPostsData: teamPostsData },
      }));
    },
    createPost: async (content) => {
      const me = useProfileStore.getState().data.me;

      if (!me) {
        console.error("Error: Not authenticated");
        return;
      }

      const { error } = await supabase.from("posts").insert({
        profile_id: me.id,
        content: content,
        team_id: me.team_id,
      });

      if (error) {
        console.error(error);
        return error;
      }

      // refresh
      get().operations.getTeamPosts();
    },
    addComment: async (content, postId) => {
      const me = useProfileStore.getState().data.me;

      if (!me) {
        console.error("Error: Not authenticated");
        return;
      }

      const { error } = await supabase.from("comments").insert({
        profile_id: me.id,
        post_id: postId,
        content: content,
        team_id: me.team_id,
      });

      if (error) {
        console.error(error);
        return error;
      }

      // refresh
      get().operations.getTeamPosts();
    },
    like: async (id, entityType) => {
      const me = useProfileStore.getState().data.me;

      if (!me) {
        console.error("Error: Not authenticated");
        return;
      }

      if (entityType === "post") {
        const { error: postError } = await supabase.from("post_likes").insert({
          profile_id: me.id,
          post_id: id,
        });

        if (postError) {
          console.error(postError);
          return postError;
        }
      } else {
        const { error: commentError } = await supabase
          .from("comment_likes")
          .insert({
            profile_id: me.id,
            comment_id: id,
          });

        if (commentError) {
          console.error(commentError);
          return commentError;
        }
      }

      // refresh
      get().operations.getTeamPosts();
    },
    unlike: async (id, entityType) => {
      const me = useProfileStore.getState().data.me;

      if (!me) {
        console.error("Error: Not authenticated");
        return;
      }

      if (entityType === "post") {
        const { error: postError } = await supabase
          .from("post_likes")
          .delete()
          .eq("post_id", id);

        if (postError) {
          console.error(postError);
          return postError;
        }
      } else {
        const { error: commentError } = await supabase
          .from("comment_likes")
          .delete()
          .eq("comment_id", id);

        if (commentError) {
          console.error(commentError);
          return commentError;
        }
      }

      // refresh
      get().operations.getTeamPosts();
    },
  },
}));

export default usePostStore;
