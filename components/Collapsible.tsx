import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { keyframes, styled } from "../stitches.config";

const open = keyframes({
  from: { height: 0 },
  to: { height: "var(--radix-collapsible-content-height)" },
});

const close = keyframes({
  from: { height: "var(--radix-collapsible-content-height)" },
  to: { height: 0 },
});

export const CollapsibleRoot = CollapsiblePrimitive.Root;
export const CollapsibleTrigger = styled(CollapsiblePrimitive.Trigger, {
  display: "flex",
  width: "100%",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "$2 $3",
  borderRadius: "$2",
  background: "$slate4",
  color: "$indigo11",
  border: "none",
  fontFamily: "inherit",
  fontSize: "$2",
  cursor: "pointer",

  "&:hover": {
    background: "$indigo4",
    color: "$indigo11",
  },

  "&[data-state=open]": {
    background: "$slate4",
    color: "$slate12",

    "&:after": {
      content: '"◀"',
    },
  },

  "&:after": {
    content: '"▼"',
    display: "inline-block",
    marginLeft: "$2",
    height: "1em",
    lineHeight: 1,
  },
});

export const CollapsibleContent = styled(CollapsiblePrimitive.Content, {
  overflow: "hidden",
  '&[data-state="open"]': { animation: `${open} 150ms ease-out` },
  '&[data-state="closed"]': { animation: `${close} 150ms ease-out` },
});
