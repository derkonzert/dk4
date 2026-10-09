import { createClient } from "@supabase/supabase-js";
import { endOfYear, parseISO, startOfYear } from "date-fns";
import { Nullable } from "typescript-nullable";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(
  Nullable.withDefault("", supabaseUrl),
  Nullable.withDefault("", supabaseAnonKey)
);

export function fromLikes() {
  return supabase.from("likes");
}
export function fromEvents() {
  return supabase.from("events");
}
export function fromLocations() {
  return supabase.from("locations");
}
export function fromFeedback() {
  return supabase.from("feedback");
}
export function fromEventList() {
  return supabase.from("event_list");
}
export function fromUpcomingEvents<Q extends string>(select: Q) {
  return fromEventList()
    .select(select)
    .or("fromDate.gte.NOW,toDate.gte.NOW")
    .order("fromDate", {
      ascending: true,
    })
    .order("title", { ascending: true })
    .order("created_at", { ascending: false });
}
export function fromArchiveEvents<Q extends string>(
  select: Q,
  year = new Date().toISOString()
) {
  const y = parseISO(year);

  const start = startOfYear(y).toISOString();
  const end = endOfYear(y).toISOString();

  return fromEventList()
    .select(select)
    .or("fromDate.lt.NOW,toDate.lt.NOW")
    .filter("fromDate", "gte", start)
    .filter("fromDate", "lte", end)
    .order("fromDate", {
      ascending: true,
    })
    .order("title", { ascending: true })
    .order("created_at", { ascending: false });
}
export function fromLatestEvents<Q extends string>(select: Q, limit = 25) {
  return fromEventList()
    .select(select)
    .or("fromDate.gte.NOW,toDate.gte.NOW")
    .order("created_at", {
      ascending: false,
    })
    .limit(limit);
}
export function fromTopThisWeekEvents<Q extends string>(select: Q, limit = 25) {
  return supabase.from("top_liked_week").select(select).limit(limit);
}

export const fromProfiles = () => supabase.from("profiles");

export function fromEventUpdates() {
  return supabase.from("event_updates");
}
