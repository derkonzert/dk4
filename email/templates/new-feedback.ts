import { definitions } from "../../types/supabase";
import { feedback, mail } from "./helpers";
import { join } from "./styles";

export function makeHtml(feedbackData: definitions["feedback"]) {
  return mail(join(`<p>New feedback arrived:</p>`, feedback(feedbackData)));
}

export function makeText(feedbackData: definitions["feedback"]) {
  return join(
    `derkonzert munich\n\nNew feedback arrived:`,
    feedbackData?.content ?? "" + feedbackData.mood
      ? ` ${feedbackData.mood}`
      : ""
  );
}

export function makeFeedbackEmail(feedback: definitions["feedback"]) {
  return {
    html: makeHtml(feedback),
    text: makeText(feedback),
    subject: `Feedback from derkonzert.de`,
  };
}
