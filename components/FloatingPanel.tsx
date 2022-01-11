import * as Tabs from "@radix-ui/react-tabs";
import { keyframes, styled } from "../stitches.config";
import { ChromelessButton } from "./ChromelessButton";

const floatIn = keyframes({
  "0%": {
    opacity: 0,
    transform: "translateY(10px)",
  },
  "100%": {
    opacity: "1",
    transform: "translateY(0px)",
  },
});

export const FloatingPanel = styled("div", {
  marginTop: "$7",
  padding: "$5",
  backgroundColor: "$slate1",
  boxShadow: "$middle",
  borderRadius: "$2",
  color: "$slate12",

  animation: `150ms ${floatIn} 200ms both 1`,
  animationTimingFunction: "ease-out",
  animationFillMode: "backwards",
});

export const FloatingPanelTabs = styled(Tabs.Root, {
  display: "flex",
  flexDirection: "column",
});

export const FloatingPanelList = styled(Tabs.List, {
  flexShrink: 0,
  display: "flex",
  borderBottom: "1px solid $indigo5",
  backgroundColor: "$indigo1",
});

export const FloatingPanelTrigger = styled(Tabs.Trigger, ChromelessButton, {
  flex: "1 0 0px",
  textAlign: "center",
  padding: "$4 $2",
  color: "$indigo12",
  fontWeight: "bold",
  backgroundColor: "transparent",
  border: "none",
  userSelect: "none",

  "&:hover": {
    boxShadow: "inset 0 -1px 0 0 $colors$indigo6, 0 1px 0 0 $colors$indigo6",
  },

  '&[data-state="active"]': {
    color: "$indigo9",
    backgroundColor: "$indigo1",
    boxShadow: "inset 0 -1px 0 0 currentColor, 0 1px 0 0 currentColor",
  },
});

export const FloatingPanelContent = styled(Tabs.Content, {
  flexGrow: 1,
  paddingBlock: "$4",
});
