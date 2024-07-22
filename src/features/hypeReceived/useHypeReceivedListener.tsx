import useProfileStore from "../../stores/profileStore.ts";
import { useEffect, Dispatch, SetStateAction } from "react";
import { HypeReceived } from "./HypeReceivedModal.tsx";
import { supabase } from "../../services/supabase.ts";

export const useHypeReceivedListener = (
  set: Dispatch<SetStateAction<HypeReceived[]>>,
) => {
  const {
    data: { me },
  } = useProfileStore();

  useEffect(() => {
    if (!me) return;

    const listener = supabase
      .channel("hype_activity")
      .on("postgres_changes", { schema: "public", event: "*" }, (payload) => {
        if (payload.new.recipient_id !== me.id) return;

        switch (payload.eventType) {
          case "INSERT":
            set((prevState) => {
              console.log(payload.new);
              return [...prevState, payload.new];
            });
            break;
          default:
            break;
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(listener);
    };
  }, [me]);
};
