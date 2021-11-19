import { useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";
import { Nullable } from "typescript-nullable";
import { definitions } from "../types/supabase";
import { fromLikes } from "../utils/supabaseClient";
import { loginRequiredToast } from "./loginRequiredToast";
import { useTranslation } from "./TranslationContextProvider";
import { useUser } from "./UserContextProvider";

type fetchedLikes = Pick<definitions["likes"], "id" | "event_id">;

export const likesFetcher = async () => {
  const { data, error } = await fromLikes<fetchedLikes>()
    .select("id,event_id")
    .order("id", { ascending: true });

  if (error) {
    throw error;
  }

  return data;
};

export const useLikes = (fallbackData = undefined) => {
  const { user } = useUser();
  const { t } = useTranslation();
  const {
    data: likes,
    error,
    mutate,
  } = useSWR<Nullable<fetchedLikes[]>>("likes", likesFetcher, {
    fallbackData,
  });
  const likedEventIds = useMemo(
    () => likes?.map((like) => like.event_id) || [],
    [likes]
  );

  const toggleLike = useCallback(
    async (eventId: string, likeExists) => {
      if (!user) {
        loginRequiredToast(t);
      } else {
        if (likeExists && likes) {
          const likeId: Nullable<number> = likes.find(
            (like) => like.event_id === eventId
          )?.id;

          if (!likeId) {
            return;
          }

          const { error } = await fromLikes().delete().match({ id: likeId });

          if (error) {
            toast.error(t("toast.likeFailed"));
          }

          mutate();
        } else {
          const { error } = await fromLikes().insert(
            {
              event_id: eventId,
              profile_id: user.id,
            },
            { returning: "minimal" }
          );

          if (error) {
            toast.error(t("toast.likeFailed"));
          }

          mutate();
        }
      }
    },
    [user, t, likes, mutate]
  );

  return { likes, toggleLike, error, likedEventIds };
};
