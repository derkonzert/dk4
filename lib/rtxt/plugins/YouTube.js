import { matchRegexp } from "./pluginUtils"
import { BasePlugin } from "./BasePlugin"

const youTubeMatcher = matchRegexp(
  /https?:\/\/(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube(?:-nocookie)?\.com\S*?[^\w\s-])([\w-]{11})(?=[^\w-]|$)(?![?=&+%\w.-]*(?:['"][^<>]*>|<\/a>))[?=&+%\w.-]*/gi
)
export const YouTube = BasePlugin.create({
  name: "youtube",
  test: ({ word }) => {
    const match = youTubeMatcher(word)
    if (match) {
      return {
        value: {
          id: match[1],
          embedUrl: `https://www.youtube.com/embed/${match[1]}`,
        },
      }
    }
  },
  priority: 10,
  renderer: token => `<iframe src="${token.value.embedUrl}" />`,
})
