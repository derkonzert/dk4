import { Fallback, Image, Root } from "@radix-ui/react-avatar";
import { AvatarIcon } from "@radix-ui/react-icons";
import { styled } from "../stitches.config";

const StyledAvatar = styled(Root, {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  verticalAlign: "middle",
  overflow: "hidden",
  userSelect: "none",
  flex: "0 0 auto",

  variants: {
    size: {
      small: {
        width: 30,
        height: 30,
        borderRadius: 24,
      },
      medium: {
        width: 38,
        height: 38,
        borderRadius: 24,
      },
      large: {
        width: 75,
        height: 75,
        borderRadius: 80,
      },
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

const StyledImage = styled(Image, {
  width: "100%",
  height: "100%",
  objectFit: "cover",
});

const StyledFallback = styled(Fallback, {
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});
const StyledAvatarIcon = styled(AvatarIcon, {
  width: 22,
  height: 22,
});

export function Avatar({ src, size }) {
  return (
    <StyledAvatar size={size}>
      <StyledImage src={src} />
      <StyledFallback>
        <StyledAvatarIcon />
      </StyledFallback>
    </StyledAvatar>
  );
}
