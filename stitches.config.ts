import {
  blackA,
  indigo,
  indigoDark,
  red,
  redDark,
  slate,
  slateDark,
  whiteA,
} from "@radix-ui/colors";
import { createStitches } from "@stitches/react";

export const {
  styled,
  keyframes,
  css,
  config,
  getCssText,
  globalCss,
  theme,
  createTheme,
} = createStitches({
  media: {
    bp1: "(min-width: 640px)",
    bp2: "(min-width: 768px)",
    bp3: "(min-width: 1024px)",
  },
  theme: {
    colors: {
      ...indigo,
      ...slate,
      ...red,
      ...blackA,
      ...whiteA,

      secondary: "$indigo8",
      primary: "$indigo9",

      bg1: "$slate1",
      bg2: "$slate2",
    },
    space: {
      1: "5px",
      2: "10px",
      3: "15px",
      4: "20px",
      5: "25px",
      6: "35px",
      7: "45px",
      8: "60px",
    },
    fontSizes: {
      1: "12px",
      2: "14px",
      3: "16px",
      4: "18px",
      5: "22px",
      6: "26px",
      7: "30px",
      8: "38px",
      10: "56px",
      11: "68px",
      12: "78px",
    },
    fonts: {
      body: "IBM Plex Sans",
      heading: "IBM Plex Serif",
      untitled: "Untitled Sans, apple-system, sans-serif",
      mono: "Söhne Mono, menlo, monospace",
    },
    fontWeights: {},
    lineHeights: {},
    letterSpacings: {},
    sizes: {},
    borderWidths: {},
    borderStyles: {},
    radii: {
      1: "2px",
      2: "4px",
      3: "8px",
      round: "50%",
    },
    shadows: {
      middle:
        "hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px",
    },
    zIndices: {
      skipNav: 2,
      header: 1,
    },
    transitions: {},
  },
});

export const darkTheme = createTheme("dark-theme", {
  colors: {
    ...indigoDark,
    ...slateDark,
    ...redDark,

    primary: "$indigo11",
  },
});
