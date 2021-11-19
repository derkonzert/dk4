import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { styled } from "../stitches.config";

const StyledSeparator = styled(SeparatorPrimitive.Root, {
  backgroundColor: "$slate5",
  "&[data-orientation=horizontal]": {
    height: 1,
    width: "100%",
    marginBlock: "$3",
  },
  "&[data-orientation=vertical]": {
    height: "100%",
    width: 1,
    marginInline: "$3",
  },
});

// Exports
export const Separator = StyledSeparator;
