import { matchRegexp } from "./pluginUtils"
import { BasePlugin } from "./BasePlugin"

const spotifyMatcher = matchRegexp(
  // /https?:\/\/(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube(?:-nocookie)?\.com\S*?[^\w\s-])([\w-]{11})(?=[^\w-]|$)(?![?=&+%\w.-]*(?:['"][^<>]*>|<\/a>))[?=&+%\w.-]*/gi
  /https?:\/\/open\.spotify.com\/(artist|track|album|playlist)\/([0-9a-zA-Z]*)/gi
)
export const Spotify = BasePlugin.create({
  name: "spotify",
  test: ({ word }) => {
    const match = spotifyMatcher(word)
    if (match) {
      return {
        value: {
          type: match[1],
          id: match[2],
          embedUrl: `https://embed.spotify.com/?uri=spotify:${match[1]}:${match[2]}`,
        },
      }
    }
  },
  priority: 10,
  renderer: token => `<iframe src="${token.value.embedUrl}" />`,
})
