import { Logtail } from "@logtail/node";

const logtailSourceToken = process.env.LOGTAIL_SOURCE_TOKEN ?? "";

export const logtail = new Logtail(logtailSourceToken, {});

if (process.env.NODE_ENV !== "production") {
  logtail.pipe(process.stdout);
}
