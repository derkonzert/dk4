import * as Tabs from "@radix-ui/react-tabs";
import { keyframes, styled } from "../stitches.config";

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
  borderBottom: "1px solid $slate5",
});

export const FloatingPanelTrigger = styled(Tabs.Trigger, {
  flex: "1 0 0px",
  textAlign: "center",
  padding: "10px 20px",
  color: "$slate11",
  userSelect: "none",

  "&:hover": {
    boxShadow: "inset 0 -1px 0 0 $colors$slate6, 0 1px 0 0 $colors$slate6",
  },

  '&[data-state="active"]': {
    color: "$slate12",
    boxShadow: "inset 0 -1px 0 0 currentColor, 0 1px 0 0 currentColor",
  },
});

export const FloatingPanelContent = styled(Tabs.Content, {
  flexGrow: 1,
  paddingBlock: "$4",
});
