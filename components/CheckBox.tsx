import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { styled } from "../stitches.config";

const StyledIndicator = styled(CheckboxPrimitive.Indicator, {
  color: "$indigo11",
});

const StyledCheckbox = styled(CheckboxPrimitive.Root, {
  all: "unset",
  width: 20,
  height: 20,
  borderRadius: "$2",
  border: "2px solid $colors$slate7",
  color: "$slate12",
  flex: "0 0 auto",
  background: "$slate2",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  lineHeight: 1,

  "&:hover": { backgroundColor: "$indigo3" },
  "&:focus": { boxShadow: "0 0 1px 2px $colors$indigo10" },

  "&[data-state='checked']": {
    backgroundColor: "$indigo9",
    borderColor: "$indigo9",

    "&:focus": { boxShadow: "0 0 1px 5px $colors$indigo6" },

    [`${StyledIndicator}`]: {
      color: "$indigo1",
    },
  },
});

export const Checkbox = StyledCheckbox;
export const CheckboxIndicator = StyledIndicator;
