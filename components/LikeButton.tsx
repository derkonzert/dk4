import { StarFilledIcon, StarIcon } from "@radix-ui/react-icons";
import type * as Stitches from "@stitches/react";
import { useMemo } from "react";
import { useLikes } from "../lib/useLikes";
import { styled } from "../stitches.config";
import { ChromelessButton } from "./ChromelessButton";

export const LikeButtonStyled = styled(ChromelessButton, {
  flex: "0 0 auto",
  padding: "$1",
  marginInlineStart: "auto",

  borderRadius: "$2",
  border: "1px solid",

  variants: {
    isLiked: {
      true: {
        color: "$primary",
        borderColor: "$primary",
        backgroundColor: "$indigo3",
      },
    },
    size: {
      small: {
        width: 22,
        height: 22,
        padding: "calc($1 / 2)",
        "@bp1": { width: 24, height: 24 },
        "@bp2": { padding: "$1", width: 32, height: 32 },
      },
      medium: {
        width: 32,
        height: 32,
        "@bp1": { width: 36, height: 36 },
        "@bp2": { width: 42, height: 42 },
      },
    },
    disabled: {
      true: {
        color: "$slate8",
        pointerEvents: "none",
        backgroundColor: "$slate3",
      },
    },

    color: {
      white: {
        color: "$slate12",
        borderColor: "$slate5",

        "&:hover": {
          borderColor: "$slate8",
        },
      },
      indigo: {
        color: "$indigo12",
        borderColor: "$indigo11",

        "&:hover": {
          borderColor: "$indigo8",
        },
      },
    },
  },
  defaultVariants: {
    color: "white",
    size: "medium",
  },
  compoundVariants: [
    {
      isLiked: true,
      color: "indigo",
      css: {
        color: "$indigo12",
        borderColor: "$indigo12",
        backgroundColor: "$indigo10",
      },
    },
    {
      isLiked: true,
      disabled: true,
      css: {
        color: "$indigo8",
        borderColor: "$indigo6",
        backgroundColor: "$indigo3",
      },
    },
  ],
});

export interface LikeButtonOwnProps
  extends Omit<Stitches.VariantProps<typeof LikeButtonStyled>, "isLiked"> {
  eventId: string;
  onLikeChanged?: (liked: boolean) => void;
}

export function LikeButton({
  eventId,
  onLikeChanged,
  ...props
}: LikeButtonOwnProps) {
  const { likedEventIds, toggleLike } = useLikes();

  const isLiked = useMemo(
    () => likedEventIds.includes(eventId),
    [eventId, likedEventIds]
  );

  return (
    <LikeButtonStyled
      isLiked={isLiked}
      title="Toggle event like"
      onClick={(e) => {
        // TODO: move button outside of link
        e.preventDefault();
        toggleLike(eventId, isLiked).then(() => {
          onLikeChanged?.(!isLiked);
        });
      }}
      data-splitbee-event="Event Toggle Like"
      {...props}
    >
      {isLiked ? (
        <StarFilledIcon width={22} height={22} />
      ) : (
        <StarIcon width={22} height={22} />
      )}
    </LikeButtonStyled>
  );
}
