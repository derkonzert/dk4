/* This Route is used to restore data that is added during e2e tests. There might be a better solution, for now this is good enough; */

import { NextApiRequest, NextApiResponse } from "next";
import { supabaseServiceClient } from "../../utils/supabaseServiceClient";

export function isEndToEndEventTitle(title: string | string[]) {
  if (!title) {
    return false;
  }
  return (Array.isArray(title) ? title : [title]).every((stringTitle) =>
    stringTitle.startsWith("E2E Test Event")
  );
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { title } = req.query;

  if (!isEndToEndEventTitle(title)) {
    res.status(404);
    res.end();
    return;
  }

  const { error } = await supabaseServiceClient
    .from("events")
    .delete({ returning: "minimal" })
    .match({ title });

  if (error) {
    res.status(400);
    res.end(error.message);
  } else {
    res.status(200);
    res.end("Ok");
  }
}
