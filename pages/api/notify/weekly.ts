import {
  differenceInDays,
  endOfWeek,
  format,
  startOfWeek,
  sub,
} from "date-fns";
import { NextApiRequest, NextApiResponse } from "next";
import { Nullable } from "typescript-nullable";
import { sendMail } from "../../../email/sendMail";
import { makeWeeklyEmail } from "../../../email/templates/weekly";
import { definitions } from "../../../types/supabase";
import { logtail } from "../../../utils/logtailServer";
import { supabaseServiceClient } from "../../../utils/supabaseServiceClient";

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
    .from<definitions["emails"]>("emails")
    .select("id")
    .match({ key: emailIdentifierKey })
    .single();

  if (emailExists && !debug) {
    return res.status(405).end();
  }

  const { data: eventsThisWeek, error } = await supabaseServiceClient
    .from<definitions["events"]>("events")
    .select("*")
    .filter("fromDate", "gte", startDate.toISOString())
    .filter("fromDate", "lte", endDate.toISOString());

  if (error) {
    logtail.error("Events this week not fetchable", error);

    return res.status(500).end();
  }
  const { data: recentlyAdded, error: recentlyAddedError } =
    await supabaseServiceClient
      .from<definitions["events"]>("events")
      .select("*")
      .filter("created_at", "gte", sub(startDate, { weeks: 1 }).toISOString())
      .filter("created_at", "lte", startDate.toISOString());

  if (recentlyAddedError) {
    logtail.error("Message", recentlyAddedError);

    return res.status(500).end();
  }

  if (Nullable.isNone(eventsThisWeek) || Nullable.isNone(recentlyAdded)) {
    logtail.error("Error receiving data.");

    return res.status(500).end();
  }

  if (eventsThisWeek?.length || recentlyAdded?.length) {
    const { subject, html, text } = makeWeeklyEmail(
      eventsThisWeek,
      recentlyAdded
    );

    if (debug) {
      return res
        .status(200)
        .setHeader("Content-Type", "text/html; charset=utf-8")
        .send(html);
    }

    const { data: profiles } = await supabaseServiceClient
      .from<definitions["profiles"]>("profiles")
      .select("id,email")
      .match({ weekly_updates: true });

    if (profiles) {
      for (let profile of profiles) {
        if (profile.email) {
          await sendMail({ to: profile.email, html, text, subject });
        }
      }
    }
  }

  try {
    const { data: createdEmail } = await supabaseServiceClient
      .from<definitions["emails"]>("emails")
      .insert({
        key: emailIdentifierKey,
      })
      .single();

    return res.status(200).end(createdEmail?.id.toString());
  } catch (err) {
    logtail.error("Events this week not fetchable", err);
    return res.status(500).end("Could not create mail");
  }
}
