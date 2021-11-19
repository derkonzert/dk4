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
        background: "$red10",
        color: "$red2",
      },
      warning: {
        background: "$red3",
        color: "$red11",
      },
    },
  },
});

export const StatusBadgeTooltip = ({ type, children, explanation }) => {
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
