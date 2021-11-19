import { styled } from "../stitches.config";

export const SidebarLayout = styled("div", {
  gridColumn: "1 / 4",

  background: "$indigo4",
  minHeight: "calc(var(--vh, 1vh) * 80.25)",
  paddingBlock: "$2",
  paddingInline: "$4",

  "@bp2": {
    display: "grid",

    gridColumnGap: "$7",
    justifyContent: "center",
    paddingInline: "$6",
    paddingBlock: "$7",
    gridTemplateColumns: "1fr 3fr",
  },
  "@bp3": {
    paddingInline: "$8",
    gridTemplateColumns: "260px minmax(auto, 980px)",
  },
});

export const SidebarSide = styled("div", {
  paddingBlock: "$2",
  background: "$indigo4",
  overflowX: "auto",

  "@bp2": {
    // Unset to make posistion sticky work in navigation
    overflow: "unset",
  },
});

export const SidebarContent = styled("div", {
  padding: "$6",
  background: "$slate1",
  borderRadius: "$3",

  boxShadow: "0 0 16px $colors$blackA3",

  "& > *:first-child": {
    marginTop: 0,
  },
});

export const SidebarNav = styled("nav", {
  display: "flex",
  flexWrap: "nowrap",

  "@bp2": {
    position: "sticky",
    top: 115,
    flexDirection: "column",
  },
});

export const SidebarNavLink = styled("a", {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  color: "$indigo12",
  padding: "$2 $3",
  borderRadius: "$3",
  textDecoration: "none",
  background: "$indigo4",
  whiteSpace: "nowrap",
  fontFamily: "$body",

  "@bp2": {
    "& + &": {
      marginTop: "$2",
    },
  },
  "&:hover": {
    background: "$indigo5",
  },

  variants: {
    active: {
      true: {
        background: "$slate1",
        color: "$indigo12",
        fontWeight: 500,
        boxShadow: "0 0 16px $colors$blackA3",

        "&:hover": {
          background: "$slate1",
        },
      },
    },
  },
});
