import {
  addWeeks,
  differenceInDays,
  endOfWeek,
  format,
  startOfWeek,
  sub,
} from "date-fns";
import { NextApiRequest, NextApiResponse } from "next";
import { Nullable } from "typescript-nullable";
import { sendMails } from "../../../email/sendMail";
import { makeWeeklyEmail } from "../../../email/templates/weekly";
import { logtail } from "../../../utils/logtailServer";
import { supabaseServiceClient } from "../../../utils/supabaseServiceClient";
import { isEndToEndEventTitle } from "../e2e-reset";

export default async function notifyWeekly(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { debug } = req.query;

  const now = Date.now();
  const startDate = startOfWeek(now, { weekStartsOn: 1 });
  const endDate = endOfWeek(startDate, { weekStartsOn: 1 });

  if (differenceInDays(now, startDate) !== 0) {
    logtail.log("Weekly newsletter triggered during week");
    return res.status(400).end();
  }

  const emailIdentifierKey = `weekly-${format(now, "yyyy-MM-dd")}`;

  const { data: emailExists } = await supabaseServiceClient
    .from("emails")
    .select("id")
    .match({ key: emailIdentifierKey })
    .single();

  if (emailExists && !debug) {
    return res.status(405).end();
  }

  const { data: eventsThisWeek, error } = await supabaseServiceClient
    .from("events")
    .select("*")
    .filter("canceled", "not.eq", true)
    .filter("fromDate", "gte", startDate.toISOString())
    .filter("fromDate", "lte", endDate.toISOString())
    .order("fromDate", { ascending: true });

  if (error) {
    logtail.error("Events this week not fetchable", {
      code: error.code,
      message: error.message,
    });

    return res.status(500).end();
  }
  const { data: recentlyAdded, error: recentlyAddedError } =
    await supabaseServiceClient
      .from("events")
      .select("*")
      // Filter out events happening this week as they already are shown in "this week"s section
      .filter(
        "fromDate",
        "gte",
        addWeeks(startOfWeek(startDate), 1).toISOString()
      )
      // Filter for events added last week
      .filter("created_at", "gte", sub(startDate, { weeks: 1 }).toISOString())
      .filter("created_at", "lte", startDate.toISOString())
      .order("fromDate", { ascending: true });

  if (recentlyAddedError) {
    logtail.error("Message", {
      code: recentlyAddedError.code,
      message: recentlyAddedError.message,
    });

    return res.status(500).end();
  }

  if (Nullable.isNone(eventsThisWeek) || Nullable.isNone(recentlyAdded)) {
    logtail.error("Error receiving data.");

    return res.status(500).end();
  }

  // Skip leftover e2e test events, e.g. when the e2e reset failed
  const isRealEvent = ({ title }: { title: string | null }) =>
    !isEndToEndEventTitle(title ?? undefined);
  const eventsThisWeekFiltered = eventsThisWeek.filter(isRealEvent);
  const recentlyAddedFiltered = recentlyAdded.filter(isRealEvent);

  if (eventsThisWeekFiltered.length || recentlyAddedFiltered.length) {
    const { subject, html, text } = makeWeeklyEmail(
      eventsThisWeekFiltered,
      recentlyAddedFiltered
    );

    if (debug) {
      return res
        .status(200)
        .setHeader("Content-Type", "text/html; charset=utf-8")
        .send(html);
    }

    const { data: profiles } = await supabaseServiceClient
      .from("profiles")
      .select("id,email")
      .match({ weekly_updates: true });

    if (profiles) {
      await sendMails(
        profiles.flatMap(({ email }) => (email ? [email] : [])),
        { subject, html, text },
        emailIdentifierKey
      );
    }
  }

  try {
    const { data: createdEmail } = await supabaseServiceClient
      .from("emails")
      .insert({
        key: emailIdentifierKey,
      })
      .select("id")
      .single();

    return res.status(200).end(createdEmail?.id.toString());
  } catch (err) {
    logtail.error("Events this week not fetchable", err);
    return res.status(500).end("Could not create mail");
  }
}
