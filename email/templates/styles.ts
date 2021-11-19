import { getCssText, globalCss, theme } from "../../stitches.config";

export const global = globalCss({
  html: {
    height: "100%",
  },
  body: {
    margin: 0,
    fontFamily:
      '"IBM Plex Sans",-apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif',
    backgroundColor: theme.colors.indigo1.value,
    display: "grid",
    gridTemplateRows: "auto 1fr auto",
    height: "100%",
  },
});

export const globalStyles = () => {
  global();
  return getCssText();
};

export const join = (...styles) => styles.filter(Boolean).join(" ");

export const color = (colorname: keyof typeof theme.colors) =>
  `color: ${theme.colors[colorname].value};`;

export const bg = (colorname: keyof typeof theme.colors) =>
  `background-color: ${theme.colors[colorname].value};`;

export const fontSize = (fontSize: keyof typeof theme.fontSizes) =>
  `font-size: ${theme.fontSizes[fontSize].value};`;

export const padding = (...spaces: Array<keyof typeof theme.space | string>) =>
  `padding: ${spaces
    .map((space) => theme.space[space]?.value ?? space)
    .join(" ")};`;

export const margin = (...spaces: Array<keyof typeof theme.space | string>) =>
  `margin: ${spaces
    .map((space) => theme.space[space]?.value ?? space)
    .join(" ")};`;
