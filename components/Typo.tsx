import { styled } from "../stitches.config";

export const TypoHeading = styled("div", {
  margin: "0",
  fontFamily: "$heading",
  fontWeight: "bold",
  lineHeight: 1.3,

  variants: {
    size: {
      h0: {
        fontSize: "$10",

        "@bp1": {
          fontSize: "$11",
        },
        "@bp2": {
          fontSize: "$12",
        },
      },
      h1: {
        fontSize: "$7",

        "@bp1": {
          fontSize: "$8",
        },
        "@bp2": {
          fontSize: "$10",
        },
      },
      h2: {
        fontSize: "$6",

        "@bp1": {
          fontSize: "$7",
        },
        "@bp2": {
          fontSize: "$8",
        },
      },
      h3: {
        fontSize: "$5",

        "@bp1": {
          fontSize: "$6",
        },
        "@bp2": {
          fontSize: "$7",
        },
      },
      h4: {
        fontSize: "$4",

        "@bp2": {
          fontSize: "$5",
        },
      },
      h5: {},
      h6: {},
    },
  },
});

export const TypoText = styled("div", {
  margin: "0",
  fontFamily: "$body",
  lineHeight: 1.5,

  variants: {
    size: {
      copy: {
        fontFamily: "$heading",
        color: "$slate11",
        fontSize: "$3",
        lineHeight: 1.8,

        "@bp1": {
          fontSize: "$4",
        },
      },
      small: {
        fontSize: "$2",
      },
    },
    color: {
      warning: {
        color: "$red11",
        background: "$red4",
      },
      muted: {
        color: "$slate11",
      },
    },
    strong: {
      true: {
        fontWeight: "bold",
      },
    },
  },
});

export const TypoLink = styled("a", {
  fontFamily: "$body",
  color: "$primary",
});
