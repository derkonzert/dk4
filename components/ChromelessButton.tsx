import { styled } from "../stitches.config";

export const ChromelessButton = styled("button", {
  backgroundColor: "transparent",
  fontSize: "inherit",
  fontFamily: "inherit",
  border: "none",
  padding: "0",
  cursor: "pointer",
  color: "inherit",

  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  lineHeight: 1,
});
