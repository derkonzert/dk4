import { createClient } from "@supabase/supabase-js";
import { endOfYear, parseISO, startOfYear } from "date-fns";
import { Nullable } from "typescript-nullable";
import { definitions } from "../types/supabase";
import { eventUpdateWithData } from "../types/supabaseManualEnhanced";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(
  Nullable.withDefault("", supabaseUrl),
  Nullable.withDefault("", supabaseAnonKey)
);

export function fromLikes<T extends Partial<definitions["likes"]>>() {
  return supabase.from<T>("likes");
}
export function fromEvents<T extends Partial<definitions["events"]>>() {
  return supabase.from<T>("events");
}
export function fromLocations<T extends Partial<definitions["locations"]>>() {
  return supabase.from<T>("locations");
}
export function fromFeedback<T extends Partial<definitions["feedback"]>>() {
  return supabase.from<T>("feedback");
}
export function fromEventList<T extends Partial<definitions["event_list"]>>() {
  return supabase.from<T>("event_list");
}
export function fromUpcomingEvents<
  T extends Partial<definitions["event_list"]>
>(select) {
  return fromEventList<T>()
    .select(select)
    .or("fromDate.gte.NOW,toDate.gte.NOW")
    .order("fromDate", {
      ascending: true,
    })
    .order("title", { ascending: true })
    .order("created_at", { ascending: false });
}
export function fromArchiveEvents<T extends Partial<definitions["event_list"]>>(
  select,
  year = new Date().toISOString()
) {
  const y = parseISO(year);

  const start = startOfYear(y).toISOString();
  const end = endOfYear(y).toISOString();

  return fromEventList<T>()
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
export function fromLatestEvents<T extends Partial<definitions["event_list"]>>(
  select,
  limit = 25
) {
  return fromEventList<T>()
    .select(select)
    .or("fromDate.gte.NOW,toDate.gte.NOW")
    .order("created_at", {
      ascending: false,
    })
    .limit(limit);
}
export function fromTopThisWeekEvents<
  T extends Partial<definitions["top_liked_week"]>
>(select, limit = 25) {
  return supabase.from<T>("top_liked_week").select(select).limit(limit);
}

export const fromProfiles = () =>
  supabase.from<definitions["profiles"]>("profiles");

export function fromEventUpdates<T extends Partial<eventUpdateWithData>>() {
  return supabase.from<T>("event_updates");
}
