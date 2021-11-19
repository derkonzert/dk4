import { PostgrestFilterBuilder } from "@supabase/postgrest-js";
import useSWR from "swr";
import { Nullable } from "typescript-nullable";
import { definitions } from "../types/supabase";
import {
  fromArchiveEvents,
  fromLatestEvents,
  fromTopThisWeekEvents,
  fromUpcomingEvents,
} from "../utils/supabaseClient";

export type fetchedEvent = definitions["event_list"] & { id: string };

function switchByFilter<T = fetchedEvent>(
  filter: eventFilter,
  limit,
  year,
  locationId
): PostgrestFilterBuilder<T> {
  switch (filter) {
    case "upcoming":
      const apiCall = fromUpcomingEvents<T>("*");

      if (locationId) {
        return apiCall.match({ location: locationId });
      } else {
        return apiCall;
      }
    case "latest":
      return fromLatestEvents<T>("*", limit);
    case "archived":
      return fromArchiveEvents<T>("*", year);
    default:
      throw new Error(`Filter "${filter}" is not implemented yet.`);
  }
}

export async function eventsFetcher<T>(
  filter: eventFilter,
  limit?: number,
  year?: string,
  locationId?: string
) {
  const { data, error } = await switchByFilter<T>(
    filter,
    limit,
    year,
    locationId
  );

  if (error) {
    throw error;
  }

  return data;
}

export type eventFilter =
  | "upcoming"
  | "latest"
  | "favorites"
  | "withUpdates"
  | "archived";

export const useEvents = (
  filter: eventFilter = "upcoming",
  fallbackData: Nullable<fetchedEvent[]> = undefined,
  limit: Nullable<number> = undefined,
  year: Nullable<string> = undefined,
  locationId: Nullable<string> = undefined
) => {
  const {
    data: events,
    error,
    mutate,
    isValidating,
  } = useSWR<Nullable<fetchedEvent[]>>(
    [filter, limit, year, locationId, "events"],
    eventsFetcher,
    {
      fallbackData,
    }
  );

  return { events, mutate, isValidating, error };
};

type Top5ThisWeek = definitions["top_liked_week"] & { id: string };

export async function top5fetcher(limit) {
  const { data, error } = await fromTopThisWeekEvents<Top5ThisWeek>("*", limit);

  if (error) {
    throw error;
  }

  return data;
}

export const useTop5ThisWeek = (
  fallbackData: Nullable<Top5ThisWeek[]>,
  limit: Nullable<number>
) => {
  const {
    data: events,
    error,
    mutate,
    isValidating,
  } = useSWR<Nullable<Top5ThisWeek[]>>([limit, "events"], top5fetcher, {
    fallbackData,
  });

  return { events, mutate, isValidating, error };
};
