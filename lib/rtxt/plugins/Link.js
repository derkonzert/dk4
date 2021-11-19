import { matchRegexp } from "./pluginUtils"
import { BasePlugin } from "./BasePlugin"

const linkRegexMatcher = matchRegexp(
  // eslint-disable-next-line no-useless-escape
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
)

export const Link = BasePlugin.create({
  name: "link",
  test: ({ word }) => {
    const match = linkRegexMatcher(word)

    if (match) {
      return {
        value: { href: match[0] },
      }
    }
  },
  priority: 5,
  renderer: token => `<a href="${token.value.href}">${token.value.href}</a>`,
})
