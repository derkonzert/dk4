import { format } from "date-fns-tz";
import { definitions } from "../../types/supabase";
import {
  button,
  center,
  conditional,
  event,
  line,
  list,
  mail,
  text,
} from "./helpers";
import { join } from "./styles";

type events = Array<definitions["events"]>;

export function makeHtml(eventsThisWeek: events, recentlyAdded: events) {
  return mail(
    join(
      conditional(
        !!eventsThisWeek.length,
        text("p", "Upcoming events this week:", "5", "slate10"),
        list(eventsThisWeek, (evtData) => event(evtData, "large"))
      ),
      conditional(eventsThisWeek.length && recentlyAdded.length, line()),
      conditional(
        !!recentlyAdded.length,
        text("p", "Recently added events:", "5", "slate10"),
        list(recentlyAdded, (evtData) => event(evtData))
      ),
      center(button("View all on derkonzert.de", "https://derkonzert.de/")),
      center(
        text(
          "p",
          `W${format(Date.now(), "ww", { timeZone: "Europe/Berlin" })}Y${format(
            Date.now(),
            "yyyy",
            { timeZone: "Europe/Berlin" }
          )}`,
          "4",
          "slate9"
        )
      )
    )
  );
}

export function makeText(eventsThisWeek: events, recentlyAdded: events) {
  return join(
    `derkonzert munich\n\nEvents this week:`,
    eventsThisWeek.map((evtData) => evtData.title).join(", "),
    `\n\nRecently added: `,
    recentlyAdded.map((evtData) => evtData.title).join(", ")
  );
}

export function makeWeeklyEmail(eventsThisWeek: events, recentlyAdded: events) {
  return {
    html: makeHtml(eventsThisWeek, recentlyAdded),
    text: makeText(eventsThisWeek, recentlyAdded),
    subject: `derkonzert munich weekly`,
  };
}
