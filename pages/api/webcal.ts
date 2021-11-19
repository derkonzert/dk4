import { getVtimezoneComponent } from "@touch4it/ical-timezones";
import { addHours, parseISO } from "date-fns";
import ical, { ICalEventData } from "ical-generator";
// import { supabase } from "../../utils/supabaseClient";
import { NextApiRequest, NextApiResponse } from "next";
import { Nullable } from "typescript-nullable";
import { definitions } from "../../types/supabase";
import { supabaseServiceClient } from "../../utils/supabaseServiceClient";

export function generateCalendar(events: definitions["events"][]) {
  var cal = ical({
    // domain: "derkonzert.de",
    prodId: { company: "derkonzert.de", product: "derkonzert" },
    name: "derkonzert calendar",
    timezone: "UTC",
    ttl: 60 * 60 * 12,
  });

  cal.timezone({
    name: "UTC",
    generator: getVtimezoneComponent,
  });

  const createSummary = (event) => {
    if (event.canceled) {
      return `Canceled: ${event.title}`;
    }

    if (event.postponed) {
      return `Postponed: ${event.title}`;
    }

    if (event.location) {
      return `${event.title} @${event.location.name}`;
    }

    return `${event.title}`;
  };

  const createDescription = (event) => `https://derkonzert.de/event/${event.id}

    ${event.description}`;

  for (let event of events) {
    try {
      cal.createEvent({
        start: event.fromDate,
        end: Nullable.maybe(
          "",
          (fromDate) => addHours(parseISO(fromDate), 3).toISOString(),
          event.fromDate
        ),
        timestamp: new Date().toISOString(),
        timezone: "UTC",
        uid: event.id,
        summary: createSummary(event),
        description: createDescription(event),
      } as ICalEventData);
    } catch (err) {
      console.error(err);
    }
  }

  return cal;
}

// Example of how to verify and get user data server-side.
export default async function webcal(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = req.query.token;

  if (!token) {
    return res.status(401).end("Missing access token");
  }

  const { data: associatedProfile } = await supabaseServiceClient
    .from<Pick<definitions["profiles"], "id">>("profiles")
    .select("id")
    .match({ calendarToken: token })
    .single();

  if (!associatedProfile) {
    return res.status(404).end();
  }

  const { data: likedEvents } = await supabaseServiceClient
    .from("likes")
    .select(
      `id,
      events!event_id(
        *,
        location(name))`
    )
    .match({ profile_id: associatedProfile.id });

  if (likedEvents) {
    const events = likedEvents.flatMap((like) => like.events);
    const calendar = generateCalendar(events);

    calendar.serve(res);
  } else {
    return res.status(500).end();
  }

  //   if (error) return res.status(401).json({ error: error.message });
}
