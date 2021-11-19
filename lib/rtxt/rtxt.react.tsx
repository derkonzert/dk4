import React, { createContext } from "react";
import * as Plugins from "./plugins";
import { createTokens } from "./rtxt";

export const Headlines = Plugins.Headlines.createCopy({
  meta: {
    Component: {
      h1: "h1",
      h2: "h2",
      h3: "h3",
    },
  },
  renderer(token, props) {
    return React.createElement(
      this.meta.Component[token.value.headlineType],
      props,
      token.value.line
    );
  },
});

export const Link = Plugins.Link.createCopy({
  meta: { Component: "a" },
  renderer(token, props) {
    return React.createElement(
      this.meta.Component,
      {
        ...props,
        href: token.value.href,
        target: "_blank",
        rel: "noopener noreferrer",
      },
      token.value.href
    );
  },
});

export const YouTube = Plugins.YouTube.createCopy({
  meta: { Component: "iframe" },
  renderer(token, props) {
    return React.createElement(this.meta.Component, {
      ...props,
      src: token.value.embedUrl,
    });
  },
});

export const Vimeo = Plugins.Vimeo.createCopy({
  meta: { Component: "iframe" },
  renderer(token, props) {
    return React.createElement(this.meta.Component, {
      ...props,
      src: token.value.embedUrl,
    });
  },
});

export const Spotify = Plugins.Spotify.createCopy({
  meta: { Component: "iframe" },
  renderer(token, props) {
    return React.createElement(this.meta.Component, {
      ...props,
      src: token.value.embedUrl,
    });
  },
});

export const DEFAULT_PLUGINS = [Headlines, Link, YouTube, Vimeo];

export const { Provider, Consumer } = createContext(DEFAULT_PLUGINS);

export interface RichTextOwnProps {
  value: string;
}

const RichText = React.memo(function Rtext({
  value,
  ...props
}: RichTextOwnProps) {
  return (
    <Consumer>
      {(plugins) => {
        const tokens = createTokens(value, plugins);

        return (
          <React.Fragment>
            {tokens.map((lineTokens, index) => (
              <React.Fragment key={index}>
                {lineTokens.map((token, windex) => (
                  <React.Fragment key={"token" + windex}>
                    {token.render(props)}
                    {windex !== lineTokens.length - 1 && " "}
                  </React.Fragment>
                ))}
                {index !== lineTokens.length - 1 && <br />}
              </React.Fragment>
            ))}
          </React.Fragment>
        );
      }}
    </Consumer>
  );
});

export default RichText;
