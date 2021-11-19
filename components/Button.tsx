import type * as Stitches from "@stitches/react";
import { styled } from "../stitches.config";

export const Button = styled("button", {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  whiteSpace: "nowrap",
  borderRadius: "4px",
  fontSize: "13px",
  fontFamily: "$body",
  fontWeight: "500",
  lineHeight: 1,
  border: "2px solid",
  paddingBlock: "$2",
  paddingInline: "$3",
  cursor: "pointer",
  textDecoration: "none",

  variants: {
    size: {
      small: {
        fontSize: "$1",
        paddingBlock: "7px",
        paddingInline: "$2",
      },
      medium: {
        fontSize: "$2",
        paddingBlock: "7px",
        paddingInline: "$2",
      },
      large: {
        fontSize: "$4",
        paddingBlock: "$3",
        paddingInline: "$5",
        borderRadius: "6px",
      },
    },

    variant: {
      ghost: {
        borderColor: "transparent",
        color: "$indigo12",
        backgroundColor: "transparent",

        "&:hover": {
          borderColor: "$indigo5",
          backgroundColor: "$indigo5",
          color: "$indigo11",
        },
      },
      secondary: {
        borderColor: "$indigo3",
        color: "$indigo9",
        backgroundColor: "$indigo3",

        "&:hover": {
          borderColor: "$indigo5",
          backgroundColor: "$indigo5",
          color: "$indigo11",
        },
      },
      primary: {
        borderColor: "$indigo9",
        color: "$slate1",
        background: "$indigo9",

        "&:hover": {
          backgroundColor: "$indigo11",
        },

        "&:focus": {
          boxShadow:
            "0 0 0 1px $colors$indigo9, inset 0 0 0 1px $colors$slate1",
        },
      },

      header: {
        background: "$indigo1",
        border: "1px solid $colors$indigo1",
        borderRadius: 100,
        fontFamily: "$heading",
        fontSize: "inherit",

        "&:hover": {
          background: "$indigo4",
          border: "1px solid $colors$indigo4",
        },
      },

      icon: {
        borderRadius: 42,
        height: 42,

        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        color: "$indigo11",
        backgroundColor: "$indigo1",
        border: `1px solid $colors$indigo4`,

        "&:hover": {
          boxShadow: `0 0 0 2px $colors$indigo9`,
          color: "$indigo9",
        },
        "&:focus": { boxShadow: `0 0 0 2px $colors$indigo11` },
      },
    },

    danger: {
      true: {},
    },
  },

  compoundVariants: [
    {
      variant: "primary",
      danger: true,
      css: {
        borderColor: "$red9",
        background: "$red9",

        "&:hover": {
          borderColor: "$red11",
          background: "$red11",
          color: "$bg1",
        },
      },
    },
    {
      variant: "secondary",
      danger: true,
      css: {
        border: "none",
        background: "$red3",
        color: "$red10",

        "&:hover": {
          background: "$red4",
          color: "$red11",
        },
      },
    },
  ],

  defaultVariants: {
    variant: "primary",
  },
});

export const ButtonIcon = styled("i", {
  variants: {
    position: {
      right: {
        marginInlineStart: "1em",
      },
      left: {
        marginInlineEnd: "1em",
      },
    },
  },
});

export type ButtonProps = Stitches.VariantProps<typeof Button>;
