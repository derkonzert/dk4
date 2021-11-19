import { defaultPlugin } from "./plugins";
import { BasePlugin, Token } from "./plugins/BasePlugin";

export const splitByLine = (string) =>
  string.split("\n").map((part) => part.trim());

export const sortPluginsByPriority = (plugins) =>
  [...plugins].sort((a, b) => (a.priority < b.priority ? 1 : -1));

export const createTokens = (string, plugins: BasePlugin[] = []) => {
  const sortedPlugins = sortPluginsByPriority(plugins);

  const lines = splitByLine(string).map((line) => ({
    line,
  }));

  return lines.reduce((tokens, context) => {
    const words = context.line.split(" ");
    const wordCount = words.length;

    const lineTokens: Token[] = [];

    let skipLine = false;
    let pluginDidMatchInLine = false;
    let lastPluginAtIndex = -1;

    for (let i = 0; i < wordCount; i++) {
      if (skipLine) {
        break;
      }
      const word = words[i];
      const testPayload = {
        word,
        wordIndex: i,
        wordCount,
        line: context.line,
      };

      for (let plugin of sortedPlugins) {
        const match = plugin.test(testPayload);

        if (match) {
          const isFirstMatchAndFirstWord = !pluginDidMatchInLine && i === 0;

          if (
            !match.skipLine &&
            lastPluginAtIndex !== i &&
            !isFirstMatchAndFirstWord
          ) {
            /* No match until now, create default Token from last match until now */
            lineTokens.push(
              Token.create({
                plugin: defaultPlugin,
                value: words.slice(lastPluginAtIndex + 1, i).join(" "),
              })
            );
          }

          if (match.skipLine) {
            skipLine = true;
          }

          lineTokens.push(
            Token.create({
              plugin,
              value: match.value,
            })
          );

          lastPluginAtIndex = i;
          pluginDidMatchInLine = true;

          break;
        }
      }

      if (i === wordCount - 1) {
        if (!pluginDidMatchInLine) {
          // No plugin matched at all in the entire line
          lineTokens.push(
            Token.create({
              plugin: defaultPlugin,
              value: context.line,
            })
          );
        } else if (lastPluginAtIndex < i) {
          lineTokens.push(
            Token.create({
              plugin: defaultPlugin,
              value: words.slice(lastPluginAtIndex + 1, wordCount).join(" "),
            })
          );
        }
      }
    }

    return [...tokens, lineTokens];
  }, []);
};
export const renderTokens = (tokens, props) => {
  return tokens
    .map((tokenLine) => tokenLine.map((token) => token.render(props)).join(" "))
    .join("\n");
};

// <RichText.Provider plugins={[
//   RichText.Plugin.Text,
//   RichText.Plugin.Headlines,
//   RichText.Plugin.Youtube,
//   RichText.Plugin.Vimeo
// ]}>
//   <App someText={"My awesome string with"} />
// <RichText.Provider>

// const App = ({ someText }) => (
//   <RichText.Provider plugins={[
//     RichText.Plugin.Text,
//     RichText.Plugin.Headlines,
//     RichText.Plugin.Youtube,
//     RichText.Plugin.Vimeo
//   ]}>
//     <RichText value={someText}>
//   </RichText.Provider>
// )

// const RichText = React.memo(({ value} ) => (
//   <RichText.Consumer>
//     {({ plugins }) => {
//       const tokens = createTokens(value, plugins);

//       return (
//         renderTokens(tokens)
//       )
//     }}
//   </RichText.Consumer>
// ))
