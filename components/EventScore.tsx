import { styled } from "../stitches.config";
// TODO: maybe create box-shadow solution instead of rendering many elements?
const Item = styled("i", {
  display: "inline-block",
  width: "10px",
  aspectRatio: "1",
  verticalAlign: "middle",
  background: "$slate9",
  borderRadius: "50%",
  border: "2px solid $colors$indigo2",

  "&:hover": {
    background: "$indigo10",
  },

  "& + &": {
    marginLeft: -5,
  },
});

export function EventScore({ score, startChar = " " }) {
  const startAt = startChar.charCodeAt(0) * 10;

  return (
    <>
      {Array.from(new Array(score)).map((_, index) => (
        <Item
          key={index}
          style={{
            backgroundColor: `hsl(${(startAt + (index + 1) * 162) % 360},${
              ((1 + index) * 30) % 100
            }%,50%)`,
          }}
        />
      ))}
    </>
  );
}
