import { matchRegexp } from "./pluginUtils"
import { BasePlugin } from "./BasePlugin"

const vimeoMatcher = matchRegexp(/https?:\/\/(www\.)?vimeo.com\/(\d+)($|\/)/)

export const Vimeo = BasePlugin.create({
  name: "vimeo",
  test: ({ word }) => {
    const match = vimeoMatcher(word)
    if (match) {
      return {
        value: {
          id: match[2],
          embedUrl: `https://player.vimeo.com/video/${match[2]}`,
        },
      }
    }
  },
  priority: 10,
  renderer: token => `<iframe src="${token.value.embedUrl}" />`,
})
