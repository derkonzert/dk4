import { BasePlugin } from "./BasePlugin"
export const Headlines = BasePlugin.create({
  name: "headline",
  test: ({ word, wordIndex, line }) => {
    if (wordIndex === 0) {
      let headlineType

      switch (word) {
        case "#":
          headlineType = "h1"
          break
        case "##":
          headlineType = "h2"
          break
        case "###":
          headlineType = "h3"
          break
        default:
        // Fall through is intended
      }

      if (headlineType) {
        return {
          value: { headlineType, line: line.substr(word.length + 1) },
          skipLine: true,
        }
      }
    }
  },
  renderer: token =>
    `<${token.value.headlineType}>${token.value.line}</${token.value.headlineType}>`,
})
