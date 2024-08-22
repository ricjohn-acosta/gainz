import { create } from "zustand/esm";
import { supabase } from "../services/supabase";
import useProfileStore from "./profileStore";
import { PostgrestError } from "@supabase/supabase-js";
import { buildPostsListData } from "./posts/helpers";
import useHypeStore from "./hypeStore";
import useRewardStore from "./rewardStore";
import { Alert } from "react-native";

interface PostState {
  data: {
    teamPostsData?: any[] | null;
  };
  operations: {
    getTeamPosts: (from, to) => Promise<PostgrestError>;
    getTeamPostsTotalCount: () => Promise<number>;
    createPost: (content, assets) => Promise<PostgrestError>;
    deletePost: (postId, assetUris) => Promise<PostgrestError>;
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
    getTeamPosts: async (from, to) => {
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
          postLikesData:post_likes!public_post_likes_post_id_fkey( profile_id ),
          postComments:comments!public_comments_post_id_fkey( *, commenterData:profiles ( username, avatar_url ), commentLikesData:comment_likes!public_comment_likes_comment_id_fkey( profile_id ) )
        `,
        )
        .order("created_at", { ascending: false })
        .range(from, to)
        .eq("team_id", me.team_id);

      if (postDataError) {
        console.error(postDataError);
        return postDataError;
      }

      const hypeActivityData = await useHypeStore
        .getState()
        .operations.getTeamHypeActivity(me.team_id, from, to);
      const redeemActivityData = await useRewardStore
        .getState()
        .operations.getTeamRewardsActivity(me.team_id, from, to);
      const teamPostsData = buildPostsListData(
        postData,
        hypeActivityData,
        redeemActivityData,
      );

      set((state) => ({
        ...state,
        data: { ...state.data, teamPostsData: teamPostsData },
      }));
    },
    getTeamPostsTotalCount: async () => {
      const me = useProfileStore.getState().data.me;

      const { count: normalPostCount, error: normalPostError } = await supabase
        .from("posts")
        .select(
          `
          *,
          posterData:profiles ( username, avatar_url ),
          postLikesData:post_likes!public_post_likes_post_id_fkey( profile_id ),
          postComments:comments!public_comments_post_id_fkey( *, commenterData:profiles ( username, avatar_url ), commentLikesData:comment_likes!public_comment_likes_comment_id_fkey( profile_id ) )
        `,
          { count: "exact", head: true },
        )
        .eq("team_id", me.team_id);

      const { count: hypePostCount, error: hypePostError } = await supabase
        .from("hype_activity")
        .select("*", { count: "exact", head: true })
        .eq("team_id", me.team_id);

      const { count: rewardPostCount, error: rewardPostError } = await supabase
        .from("rewards_activity")
        .select("*", { count: "exact", head: true })
        .eq("team_id", me.team_id);

      if (normalPostError || hypePostError || rewardPostError) {
        Alert.alert("Oops!", "Error getting total post count");
        return;
      }

      return normalPostCount + hypePostCount + rewardPostCount;
    },
    createPost: async (content, assets) => {
      const me = useProfileStore.getState().data.me;

      if (!me) {
        console.error("Error: Not authenticated");
        return;
      }

      const { error } = await supabase.from("posts").insert({
        profile_id: me.id,
        content: content,
        team_id: me.team_id,
        media: assets,
      });

      if (error) {
        console.error(error);
        return error;
      }

      // refresh
      get().operations.getTeamPosts(0, 9);
    },
    deletePost: async (postId, assets) => {
      try {
        const me = useProfileStore.getState().data.me;

        if (!me) {
          console.error("Error: Not authenticated");
          return;
        }

        const requests = [
          await supabase.from("posts").delete().eq("post_id", postId),
        ];

        if (assets) {
          const uploadRequests = assets.map((asset) => {
            const fileExtension = asset.type === "image" ? "jpg" : "mp4";
            const lastSegment = asset.uri.split("/").pop();
            const filename = lastSegment.split(".")[0];

            return supabase.storage
              .from("assets")
              .remove([`${filename}.${fileExtension}`]);
          });

          requests.push(uploadRequests);
        }

        Promise.all(requests).then((_) => {
          // refresh
          useProfileStore.getState().operations.reloadProfile();
        });
      } catch (e) {
        console.error(e);
        Alert.alert("Oops!", "Something went wrong deleting this post!");
      }
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
      get().operations.getTeamPosts(0, 9);
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
      get().operations.getTeamPosts(0, 9);
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
      get().operations.getTeamPosts(0, 9);
    },
  },
}));

export default usePostStore;
