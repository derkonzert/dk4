import { NextApiRequest, NextApiResponse } from "next";
import { sendMail } from "../../../email/sendMail";
import { makeFeedbackEmail } from "../../../email/templates/new-feedback";
import { definitions } from "../../../types/supabase";
import { logtail } from "../../../utils/logtailServer";
import { supabaseServiceClient } from "../../../utils/supabaseServiceClient";

type UserRoleWithEmail = {
  user_id: { email: string };
};

export default async function notifyEvent(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const record: definitions["feedback"] = req.body.record;
  const { debug } = req.query;

  const feedbackID = record?.id ?? null;

  logtail.log(`Request notification for id ${feedbackID}`);

  if (!feedbackID) {
    return res.status(400).end();
  }

  const emailIdentifierKey = `feedback-${feedbackID}`;

  const { data: emailExists } = await supabaseServiceClient
    .from<definitions["emails"]>("emails")
    .select("id")
    .match({ key: emailIdentifierKey })
    .single();

  if (emailExists && !debug) {
    logtail.warn("Notification already exists");
    return res.status(405).end();
  }

  const { subject, html, text } = makeFeedbackEmail(record);

  if (debug) {
    return res
      .status(200)
      .setHeader("Content-Type", "text/html; charset=utf-8")
      .send(html);
  }

  const { data: adminusersIds } = await supabaseServiceClient
    .from<UserRoleWithEmail>("user_roles")
    .select("user_id")
    .match({ role: "admin" });
  const { data: adminuserprofiles } = await supabaseServiceClient
    .from<definitions["profiles"]>("profiles")
    .select("email")
    .match({ id: adminusersIds?.map(({ user_id }) => user_id) });

  logtail.log(`Send mail to ${adminuserprofiles?.length ?? 0} users`);

  if (adminuserprofiles) {
    for (let adminUser of adminuserprofiles) {
      await sendMail({ to: adminUser.email, html, text, subject });
    }
  }

  try {
    const { data: createdEmail } = await supabaseServiceClient
      .from<definitions["emails"]>("emails")
      .insert({
        key: emailIdentifierKey,
      })
      .single();

    logtail.log(`Done - All good`);
    return res.status(200).end(createdEmail?.id.toString());
  } catch (err) {
    logtail.error(`Could not register email`);
    console.error(err);
    return res.status(500).end("Could not create mail");
  }
}
