import sortBy from "lodash.sortby";
import { definitions } from "../types/supabase";

export function sortChildEvents(
  childEvents: Pick<definitions["events"], "fromDate">[]
) {
  return childEvents ? sortBy(childEvents, (evt) => evt.fromDate) : [];
}
