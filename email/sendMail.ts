import sgMail from "@sendgrid/mail";
import { Nullable } from "typescript-nullable";

export async function sendMail({ to, text, html, subject }) {
  if (Nullable.isNone(process.env.SENDGRID_API_KEY)) {
    throw new Error("No api key set for email service");
  }

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const from = "noreply@derkonzert.de";

  return await sgMail.send({
    to,
    from,
    text,
    html,
    subject,
  });
}
