import { forwardRef, PropsWithChildren } from "react";
import { styled } from "../stitches.config";
import { Box } from "./Box";

export const Input = styled("input", {
  boxSizing: "border-box",
  width: "fill-available",
  border: "2px solid $slate6",
  color: "$slate12",
  background: "$slate2",
  borderRadius: "$2",
  lineHeight: 1,
  fontFamily: "$body",
  fontSize: "$3",
  minHeight: 36,
  maxWidth: 460,
  paddingInline: "$2",

  "&:focus": {
    outline: "none",
    color: "$indigo12",
    borderColor: "$indigo8",
    backgroundColor: "$indigo3",
  },

  "&:disabled": {
    color: "$slate10",
  },

  "&[readonly]": {
    borderColor: "$slate2",
  },

  variants: {
    size: {
      small: {
        minHeight: 30,
        paddingInline: "$1",
      },
    },
  },
});

export const Textarea = styled("textarea", {
  boxSizing: "border-box",
  width: "fill-available",
  border: "2px solid $slate6",
  color: "$slate12",
  background: "$slate2",
  borderRadius: "$2",
  lineHeight: 1,
  fontFamily: "$body",
  fontSize: "$3",
  minHeight: 68,
  paddingBlock: "$2",
  paddingInline: "$2",
  resize: "vertical",

  "&:focus": {
    outline: "none",
    color: "$indigo12",
    borderColor: "$indigo8",
    backgroundColor: "$indigo3",
  },
});

interface InputWithAppendixOwnProps {
  maxWidth?: number;
}

export const InputWithAppendix = forwardRef<HTMLInputElement>(
  function InputWithAppendixInner(
    {
      children,
      maxWidth = 460,
      ...inputProps
    }: PropsWithChildren<InputWithAppendixOwnProps>,
    ref
  ) {
    return (
      <Box css={{ maxWidth, position: "relative" }}>
        <Input
          css={{ maxWidth, width: "100%", paddingRight: "$5" }}
          ref={ref}
          {...inputProps}
        />
        <Box
          css={{
            position: "absolute",
            right: 2,
            top: "50%",
            transform: "translateY(-50%)",
            marginLeft: "$1",
            padding: "$1",

            borderRadius: "0 $1 $1 0",
            color: "$indigo12",
            backgroundColor: "$blackA3",
            userSelect: "none",
            pointerEvents: "none",
          }}
        >
          {children}
        </Box>
      </Box>
    );
  }
);

// @ts-ignore
export const Select = styled("select", Input);
