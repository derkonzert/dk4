import { youtube } from "@googleapis/youtube";
import { NextApiRequest, NextApiResponse } from "next";
import { logtail } from "../../utils/logtailServer";

const yt = youtube({
  version: "v3",
  auth: process.env.YOUTUBE_AUTH_KEY,
});

// Example of how to verify and get user data server-side.
export default async function webcal(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { q, nextPageToken } = req.query;

  if (!q) {
    return res.status(401).end("Missing query");
  }

  try {
    const ytResponse = await yt.search.list({
      q: Array.isArray(q) ? q[0] : q,
      pageToken: Array.isArray(nextPageToken)
        ? nextPageToken[0]
        : nextPageToken,
      type: ["video"],
      videoEmbeddable: "true",
      part: ["snippet"],
    });

    if (ytResponse.status !== 200) {
      logtail.error(ytResponse.statusText);

      return res.status(503).end("Service unavailable");
    }

    console.log(ytResponse.data);
    const items = ytResponse.data.items ?? [];

    const itemsWithReducedInfo = items.map(
      (responseItem): YoutubeVideoSuggestion => ({
        videoId: responseItem.id?.videoId,
        thumbnail: responseItem.snippet?.thumbnails?.default,
        title: responseItem.snippet?.title,
      })
    );

    return res.status(200).json({
      nextPageToken: ytResponse.data.nextPageToken,
      items: itemsWithReducedInfo,
    });
  } catch (err) {
    logtail.error(err);
    return res.status(503).end("Service unavailable");
  }
}
