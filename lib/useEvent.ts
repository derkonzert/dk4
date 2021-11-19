import useSWR from "swr";
import { Nullable } from "typescript-nullable";
import { eventWithLocation } from "../types/supabaseManualEnhanced";
import { fromEvents } from "../utils/supabaseClient";

export const eventFetcher = async (id: string) => {
  const { data, error } = await fromEvents<eventWithLocation>()
    .select("*, location(id,name)")
    .match({ id })
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const useEvent = (
  id,
  fallbackData: Nullable<eventWithLocation> = undefined,
  limit: Nullable<number> = undefined
) => {
  const {
    data: event,
    error,
    mutate,
    isValidating,
  } = useSWR<Nullable<eventWithLocation>>([id, "event_list"], eventFetcher, {
    fallbackData,
  });

  return { event, isValidating, mutate, error };
};
