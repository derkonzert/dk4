import { styled } from "../stitches.config";

export const HyperLink = styled("a", {
  color: "$primary",

  variants: {
    type: {
      ghost: {
        textDecoration: "none",
        "&:hover": {
          textDecoration: "underline",
        },
      },
    },
    muted: {
      true: {
        color: "$slate10",
      },
    },
    active: {
      true: {},
    },
  },
});
