import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { styled } from "../stitches.config";

const StyledToggleGroup = styled(ToggleGroupPrimitive.Root, {
  display: "inline-flex",
  backgroundColor: "$indigo3",
  borderRadius: "$2",
  boxShadow: `0 0px 0 1px $colors$blackA4`,
});

const StyledItem = styled(ToggleGroupPrimitive.Item, {
  all: "unset",
  backgroundColor: "$indigo3",
  color: "$indigo10",
  height: 35,
  paddingInline: "$2",
  display: "flex",
  flex: "1 0 auto",
  fontSize: 15,
  lineHeight: 1,
  alignItems: "center",
  justifyContent: "center",
  marginLeft: 1,
  "&:first-child": {
    marginLeft: 0,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  "&:last-child": { borderTopRightRadius: 4, borderBottomRightRadius: 4 },
  "&:hover": { textDecoration: "none", backgroundColor: "$indigo6" },
  "&[data-state=off]": {
    cursor: "pointer",
  },
  "&[data-state=on]": {
    backgroundColor: "$indigo1",

    color: "$slate12",
  },
  "&:focus": {
    position: "relative",
    boxShadow: `inset 0 0 0 2px $colors$primary`,
  },
});

// Exports
export const ToggleGroup = StyledToggleGroup;
export const ToggleGroupItem = StyledItem;
