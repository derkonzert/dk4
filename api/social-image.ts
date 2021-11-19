import screenshot from "../lib/screenshot";

export default async function socialImage(req, res) {
  try {
    const { eventId } = req.query;

    if (!eventId) {
      throw new Error("No eventId available");
    }

    const host = req.headers.host;
    if (!host) {
      throw new Error("No host available");
    }

    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

    const url = `${protocol}://${host}/event/${eventId}/card`;

    const file = await screenshot(url);
    res.setHeader("Content-Type", `image/png`);
    res.setHeader(
      "Cache-Control",
      `public, immutable, no-transform, s-maxage=31536000, max-age=31536000`
    );
    res.statusCode = 200;
    res.end(file);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating image");
  }
}
