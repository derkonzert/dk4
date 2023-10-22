import * as Dialog from "@radix-ui/react-dialog";
import { keyframes, styled } from "../stitches.config";

const overlayShow = keyframes({
  "0%": { opacity: 0 },
  "100%": { opacity: 1 },
});

const contentShowMobile = keyframes({
  "0%": { opacity: 0, transform: "translate(0%, 100%)" },
  "100%": { opacity: 1, transform: "translate(0%, 0%)" },
});

const contentShow = keyframes({
  "0%": { opacity: 0, transform: "translate(0%, 2%) scale(.96)" },
  "100%": { opacity: 1, transform: "translate(0%, 0%) scale(1)" },
});

const contentShowCentered = keyframes({
  "0%": { opacity: 0, transform: "translate(-50%, -48%) scale(.96)" },
  "100%": { opacity: 1, transform: "translate(-50%, -50%) scale(1)" },
});

export const DialogOverlay = styled(Dialog.Overlay, {
  backgroundColor: "$blackA8",
  position: "fixed",
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  zIndex: "$dialogOverlay",
  "@media (prefers-reduced-motion: no-preference)": {
    animation: `${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
  },
});

export const DialogContent = styled(Dialog.Content, {
  position: "fixed",
  backgroundColor: "$bg1",
  boxShadow: "$middle",
  border: "1px solid $slate7",
  padding: "$4 $3",
  borderRadius: "$3 $3 0 0",

  display: "flex",
  flexDirection: "column",

  overflowY: "auto",

  top: "auto",
  right: 0,
  bottom: 0,
  left: 0,
  maxHeight: "calc(var(--vh, 1vh) * 85)",

  zIndex: "$dialog",

  "@media (prefers-reduced-motion: no-preference)": {
    animation: `${contentShowMobile} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
    willChange: "transform",
  },

  "@bp2": {
    padding: "$6",
    borderRadius: "$3",

    "@media (prefers-reduced-motion: no-preference)": {
      animationName: contentShow,
      willChange: "transform",
    },
  },

  "&:focus": {
    outline: "none",
  },

  variants: {
    size: {
      small: {
        minHeight: "calc(var(--vh, 1vh) * 32)",
        "@bp2": {
          bottom: "auto",
          right: "auto",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          minHeight: 0,
          width: "90vw",
          maxWidth: "450px",
          maxHeight: "85vh",
          "@media (prefers-reduced-motion: no-preference)": {
            animation: `${contentShowCentered} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
            willChange: "transform",
          },
        },
      },
      medium: {
        minHeight: "calc(var(--vh, 1vh) * 56)",
        "@bp2": {
          top: 40,
          right: 40,
          bottom: 40,
          left: 40,
          marginInline: "auto",
          maxWidth: 880,
          maxHeight: "none",
        },
      },
    },
  },

  defaultVariants: {
    size: "medium",
  },
});

export const DialogClose = styled(Dialog.Close, {
  position: "absolute",
  insetInlineEnd: "$2",
  insetBlockStart: "$2",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "none",
  cursor: "pointer",
  padding: "$1",
  width: 30,
  height: 30,
  borderRadius: "50%",

  color: "$indigo12",

  backgroundColor: "$indigo1",

  "&:hover": {
    backgroundColor: "$indigo4",
  },

  [`& > svg`]: {
    width: 15,
    height: 15,
  },
});

export const DialogRoot = Dialog.Root;
export const DialogTitle = styled(Dialog.Title, {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
});
export const DialogDescription = Dialog.Description;
export const DialogTrigger = Dialog.Trigger;
export const DialogPortal = Dialog.Portal;
