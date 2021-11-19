import { styled } from "../stitches.config";

export const IconButton = styled("button", {
  all: "unset",
  fontFamily: "inherit",
  borderRadius: "100%",
  height: 42,
  width: 42,
  cursor: "pointer",
  display: "flex",
  boxSizing: "border-box",
  alignItems: "center",
  justifyContent: "center",
  color: "$indigo11",
  backgroundColor: "$indigo1",
  border: `1px solid $colors$indigo4`,
  "&:hover": { boxShadow: `0 0 0 1px $colors$indigo9`, color: "$indigo9" },
  "&:focus": { boxShadow: `0 0 0 2px $colors$indigo11` },
});
