import { create } from "zustand/esm";
import { supabase } from "../services/supabase";
import useProfileStore from "./profileStore";
import { PostgrestError } from "@supabase/supabase-js";
import { sortTeamBy } from "../helpers/teamSorter";
import { buildPostsListData } from "./posts/helpers";

interface PostState {
  data: {
    teamPostsData?: any;
  };
  operations: {
    getTeamPosts: () => Promise<PostgrestError>;
    createPost: (content) => Promise<PostgrestError>;
    addComment: (content, postId) => Promise<PostgrestError>;
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
          posterData:profiles ( username, avatar_url )
        `,
        )
        .eq("team_id", me.team_id);

      const { data: commentData, error: commentDataError } = await supabase
          .from("comments")
          .select(
              `
          *,
          commenterData:profiles ( username, avatar_url )
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

      const teamPostsData = buildPostsListData(postData, commentData);
      set({ data: { teamPostsData: teamPostsData } });
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
        team_id: me.team_id
      });

      if (error) {
        console.error(error);
        return error;
      }

      // refresh
      get().operations.getTeamPosts();
    },
  },
}));

export default usePostStore;
