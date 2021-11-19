import { config, keyframes, styled, theme } from "../stitches.config";

const dotFade = keyframes({
  "0%": {
    opacity: 0.1,
  },
  "90%": {
    opacity: 1,
  },
  "100%": {
    opacity: 0.1,
  },
});

const Wrapper = styled("div", {
  display: "flex",
  padding: "$4",
  flex: "0 0 auto",
  placeSelf: "center",
  minWidth: 20,
  gap: "$2",
  borderRadius: "$2",

  variants: {
    size: {
      small: {
        padding: "$1",
      },
      medium: {
        padding: "$4",
      },
    },
  },
});

const Svg = styled("svg", {
  flex: "0 0 auto",
});

const Dot = styled("circle", {
  fill: "inherit",
  animation: `${dotFade} 1000ms infinite`,
  "&:nth-child(2)": {
    animationDelay: "150ms",
  },
  "&:nth-child(3)": {
    animationDelay: "300ms",
  },
});

const Label = styled("span", {
  fontSize: "$2",
  flex: "1 0 auto",
  whiteSpace: "nowrap",
});

type colorType = `$${keyof typeof config["theme"]["colors"] | (string & {})}`;

interface LoaderOwnProps {
  label?: string;
  size?: "small" | "medium";
  color?: colorType;
  background?: colorType;
}

export function Loader({
  label,
  color = "$indigo9",
  background = "$indigo3",
  size = "medium",
}: LoaderOwnProps) {
  return (
    <Wrapper size={size} css={{ color, backgroundColor: background }}>
      <Svg viewBox="0 0 20 10" width={20} css={{ fill: color }}>
        <Dot cx={5} cy={5} r={1.5} />
        <Dot cx={10} cy={5} r={1.5} />
        <Dot cx={15} cy={5} r={1.5} />
      </Svg>
      {label && <Label>{label}</Label>}
    </Wrapper>
  );
}
