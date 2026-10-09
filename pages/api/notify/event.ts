import { startOfDay, sub } from "date-fns";
import { NextApiRequest, NextApiResponse } from "next";
import { sendMails } from "../../../email/sendMail";
import { makeEventEmail } from "../../../email/templates/new-event";
import { logtail } from "../../../utils/logtailServer";
import { supabaseServiceClient } from "../../../utils/supabaseServiceClient";
import { isEndToEndEventTitle } from "../e2e-reset";

export default async function notifyEvent(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { record } = req.body;
  const { debug } = req.query;

  const eventId = record?.id ?? null;

  logtail.log(`Request notification for id ${eventId}`);

  if (!eventId) {
    return res.status(400).end();
  }

  const emailIdentifierKey = `event-${eventId}`;

  const { data: emailExists } = await supabaseServiceClient
    .from("emails")
    .select("id")
    .match({ key: emailIdentifierKey })
    .single();

  if (emailExists && !debug) {
    logtail.warn("Notification already exists");
    return res.status(405).end();
  }

  const { data: event } = await supabaseServiceClient
    .from("events")
    .select("*")
    .match({ id: eventId })
    .single();

  if (!event) {
    logtail.log("Event was not found");
    return res.status(404).end();
  }

  if (!event.title || isEndToEndEventTitle(event.title)) {
    logtail.log("Event was e2e test event");
    return res.status(200).end();
  }

  if (new Date(event.created_at) < sub(startOfDay(new Date()), { weeks: 1 })) {
    logtail.log("Event is too old");
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
    .from("profiles")
    .select("id,email")
    .match({ immediate_updates: true });

  logtail.log(`Send mail to ${profiles?.length ?? 0} users`);

  if (profiles) {
    await sendMails(
      profiles.map(({ email }) => email),
      { subject, html, text },
      emailIdentifierKey
    );
  }

  try {
    const { data: createdEmail } = await supabaseServiceClient
      .from("emails")
      .insert({
        key: emailIdentifierKey,
      })
      .select("id")
      .single();

    logtail.log(`Done - All good`);
    return res.status(200).end(createdEmail?.id.toString());
  } catch (err) {
    logtail.log(`Could not register email`);
    console.error(err);
    return res.status(500).end("Could not create mail");
  }
}
