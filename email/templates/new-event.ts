import { definitions } from "../../types/supabase";
import { event, mail } from "./helpers";
import { join } from "./styles";

export function makeHtml(evtData: definitions["events"]) {
  return mail(join(`<p>A new event was added:</p>`, event(evtData, "large")));
}

export function makeText(evtData: definitions["events"]) {
  return join(`derkonzert munich\n\nA new event was added:`, evtData.title);
}

export function makeEventEmail(event: definitions["events"]) {
  return {
    html: makeHtml(event),
    text: makeText(event),
    subject: `New event on derkonzert.de`,
  };
}
