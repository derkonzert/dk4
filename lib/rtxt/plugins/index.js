import { BasePlugin } from "./BasePlugin"

export const defaultPlugin = BasePlugin.create({
  name: "default",
  test: ({ line }) => ({
    matches: true,
    skipLine: true,
    value: line,
  }),
  renderer: token => token.value,
  priority: -1,
})

export { Headlines } from "./Headlines"
export { Link } from "./Link"
export { Vimeo } from "./Vimeo"
export { YouTube } from "./YouTube"
export { Spotify } from "./Spotify"
