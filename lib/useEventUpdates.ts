import useSWR from "swr";
import { Nullable } from "typescript-nullable";
import { eventUpdateWithData } from "../types/supabaseManualEnhanced";
import { fromEventUpdates } from "../utils/supabaseClient";

export const eventsFetcher = async (id) => {
  const { data, error } = await fromEventUpdates<eventUpdateWithData>()
    .select("*")
    .match({ event_id: id });

  if (error) {
    throw error;
  }

  return data;
};

export const useEventUpdates = (
  eventId: string,
  fallbackData: Nullable<eventUpdateWithData[]> = undefined
) => {
  const {
    data: eventUpdates,
    error,
    mutate,
    isValidating,
  } = useSWR<Nullable<eventUpdateWithData[]>>(
    [eventId, "eventUpdates"],
    eventsFetcher,
    {
      fallbackData,
    }
  );

  return { eventUpdates, isValidating, mutate, error };
};
