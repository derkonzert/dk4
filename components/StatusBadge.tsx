import type * as Stitches from "@stitches/react";
import { PropsWithChildren } from "react";
import { styled } from "../stitches.config";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipTrigger,
} from "./Tooltip";

export const StatusBadge = styled("div", {
  display: "inline-block",
  paddingBlock: "$1",
  paddingInline: "$2",
  borderRadius: "$2",
  fontSize: "$1",
  fontWeight: 500,
  verticalAlign: "middle",
  marginInline: "$2",

  variants: {
    type: {
      danger: {
        background: "$red11",
        color: "$red1",
      },
      warning: {
        background: "$red3",
        color: "$red11",
      },
    },
  },
});

export interface StatusBadgeTooltipOwnProps {
  type?: Stitches.VariantProps<typeof StatusBadge>["type"];
  explanation: string;
}

export const StatusBadgeTooltip = ({
  type,
  children,
  explanation,
}: PropsWithChildren<StatusBadgeTooltipOwnProps>) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <StatusBadge type={type}>{children}</StatusBadge>
      </TooltipTrigger>
      <TooltipContent sideOffset={5}>
        {explanation}
        <TooltipArrow />
      </TooltipContent>
    </Tooltip>
  );
};
