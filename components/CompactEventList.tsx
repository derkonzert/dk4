import { styled } from "../stitches.config";
import { LikeButton } from "./LikeButton";

export const CompactEventList = styled("nav", {
  display: "flex",
  flexWrap: "wrap",

  color: "$primary",
  marginBlock: "0",
  border: "1px solid ",
  padding: "0",
  marginLeft: "0",
  borderRadius: "$3",
  overflow: "hidden",

  variants: {
    color: {
      white: {
        color: "$primary",
        borderColor: "$slate4",
        backgroundColor: "$slate4",
      },
      indigo: {
        color: "$indigo1",
        borderColor: "$indigo11",
        backgroundColor: "$indigo11",
      },
    },
  },
  defaultVariants: {
    color: "white",
  },
});

export const CompactEventListItem = styled("a", {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",

  width: "100%",
  minWidth: 0,

  paddingInline: "$2",
  paddingBlock: "$1",

  textDecoration: "none",

  "& + &": {
    marginTop: "1px",
  },

  [`& ${LikeButton}`]: {
    marginLeft: "auto",
  },

  variants: {
    isInPast: {
      true: {
        color: "$slate11",
        backgroundColor: "$indigo3",
      },
    },
    isCanceled: {
      true: {
        textDecoration: "line-through",
      },
    },
    color: {
      white: {
        color: "$indigo12",
        backgroundColor: "$indigo1",

        "&:hover": {
          color: "$indigo9",
          backgroundColor: "$indigo3",
        },
      },
      indigo: {
        color: "$indigo1",
        backgroundColor: "$indigo9",

        "&:hover": {
          color: "$indigo1",
          backgroundColor: "$indigo10",
        },
      },
    },
  },
  defaultVariants: {
    color: "white",
  },
});
