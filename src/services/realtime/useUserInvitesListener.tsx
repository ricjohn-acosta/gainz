import { supabase } from "../supabase.ts";
import useProfileStore from "../../stores/profileStore.ts";
import { useEffect } from "react";

export const useUserInvitesListener = (set) => {
  const {
    data: { me },
  } = useProfileStore();

  useEffect(() => {
    const listener = supabase
      .channel("user_invites")
      .on("postgres_changes", { schema: "public", event: "*" }, (payload) => {
        if (payload.new.recipient_email !== me.email) return;

        switch (payload.eventType) {
          case "INSERT":
            set(payload.new);
            break;
          case "UPDATE":
            if (payload.new.status === "declined") set(null);
            break;
          default:
            break;
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(listener);
    };
  }, []);
};
