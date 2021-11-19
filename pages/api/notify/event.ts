import { startOfDay, sub } from "date-fns";
import { NextApiRequest, NextApiResponse } from "next";
import { sendMail } from "../../../email/sendMail";
import { makeEventEmail } from "../../../email/templates/new-event";
import { definitions } from "../../../types/supabase";
import { supabaseServiceClient } from "../../../utils/supabaseServiceClient";
import { isEndToEndEventTitle } from "../e2e-reset";

function log(...args) {
  console.log(...args);
}

export default async function notifyEvent(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { record } = req.body;
  const { debug } = req.query;

  const eventId = record?.id ?? null;

  log(`Request notification for id ${eventId}`);

  if (!eventId) {
    return res.status(400).end();
  }

  const emailIdentifierKey = `event-${eventId}`;

  const { data: emailExists } = await supabaseServiceClient
    .from<definitions["emails"]>("emails")
    .select("id")
    .match({ key: emailIdentifierKey })
    .single();

  if (emailExists && !debug) {
    log("Notification already exists");
    return res.status(405).end();
  }

  const { data: event } = await supabaseServiceClient
    .from<definitions["events"]>("events")
    .select("*")
    .match({ id: eventId })
    .single();

  if (!event) {
    log("Event was not found");
    return res.status(404).end();
  }

  if (!event.title || isEndToEndEventTitle(event.title)) {
    log("Event was e2e test event");
    return res.status(200).end();
  }

  if (new Date(event.created_at) < sub(startOfDay(new Date()), { weeks: 1 })) {
    log("Event is too old");
    // Event is too old. Fail-safe for migrated events
    return res.status(400).end();
  }

  const { subject, html, text } = makeEventEmail(event);

  if (debug) {
    return res
      .status(200)
      .setHeader("Content-Type", "text/html; charset=utf-8")
      .send(html);
  }

  const { data: profiles } = await supabaseServiceClient
    .from<definitions["profiles"]>("profiles")
    .select("id,email")
    .match({ immediate_updates: true });

  log(`Send mail to ${profiles?.length ?? 0} users`);

  if (profiles) {
    for (let profile of profiles) {
      await sendMail({ to: profile.email, html, text, subject });
    }
  }

  try {
    const { data: createdEmail } = await supabaseServiceClient
      .from<definitions["emails"]>("emails")
      .insert({
        key: emailIdentifierKey,
      })
      .single();

    log(`Done - All good`);
    return res.status(200).end(createdEmail?.id.toString());
  } catch (err) {
    log(`Could not register email`);
    console.error(err);
    return res.status(500).end("Could not create mail");
  }
}
