import { Resend } from "resend";
import { Nullable } from "typescript-nullable";

const from = "derkonzert <noreply@derkonzert.de>";

// Resend accepts at most 100 emails per batch request
const BATCH_SIZE = 100;
// Stay below Resend's default rate limit of 2 requests per second
const BATCH_DELAY_MS = 600;

type Mail = { subject: string; html: string; text: string };

export async function sendMails(
  recipients: string[],
  { subject, html, text }: Mail,
  idempotencyKey: string
) {
  if (Nullable.isNone(process.env.RESEND_API_KEY)) {
    throw new Error("No api key set for email service");
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  for (let start = 0; start < recipients.length; start += BATCH_SIZE) {
    if (start > 0) {
      await new Promise((resolve) => setTimeout(resolve, BATCH_DELAY_MS));
    }

    const chunk = recipients.slice(start, start + BATCH_SIZE);

    const { error } = await resend.batch.send(
      chunk.map((to) => ({ from, to, subject, html, text })),
      // Retrying a failed run within 24h won't re-send already delivered chunks
      { idempotencyKey: `${idempotencyKey}-${start}` }
    );

    if (error) {
      throw new Error(`Sending mails failed: ${error.name} ${error.message}`);
    }
  }
}
