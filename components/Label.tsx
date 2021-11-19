import { Root as LabelRoot } from "@radix-ui/react-label";
import { styled } from "../stitches.config";

export const Label = styled(LabelRoot, {
  display: "block",
  fontSize: "$1",
  color: "$slate12",
  fontWeight: "bold",
  fontFamily: "$body",
  cursor: "pointer",

  variants: {
    checkbox: {
      true: {
        fontSize: "$3",
        fontWeight: "normal",
      },
    },
  },
});
