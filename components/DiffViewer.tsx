import { Diff } from "../lib/useDifferences";
import { styled } from "../stitches.config";
import { Flex } from "./Flex";
import { TypoHeading } from "./Typo";

export interface DiffViewerOwnProps {
  differences: Diff[];
}

const Wrapper = styled("ul", {
  margin: "$2 0",
  padding: "0",
});

const Item = styled("ul", {
  margin: "$4 0",
  padding: "0",
  display: "flex",
  flexDirection: "column",
  gap: "$2",

  "&+&": {
    paddingTop: "$3",
    borderTop: "1px solid $colors$slate4",
  },
});

const Removed = styled("del", {
  display: "block",
  textDecoration: "line-through",
  color: "$red10",
  background: "$red2",
  borderRadius: "$3",
  padding: "$1",
});
const ReplacedWithOrAdded = styled("span", {
  display: "block",
  fontWeight: "bold",
  color: "#297c3b",
  background: "#dff3df",
  borderRadius: "$3",
  padding: "$1",
});

export function DiffViewer({ differences }: DiffViewerOwnProps) {
  return (
    <Wrapper>
      {differences.map((difference, index) => (
        <Item key={index}>
          <TypoHeading
            size="h5"
            css={{ letterSpacing: 1.2, textTransform: "uppercase" }}
          >
            {difference.label}:
          </TypoHeading>
          <Flex wrap="wrap" gap="2">
            {!!difference.removed && <Removed>{difference.removed}</Removed>}
            {!!difference.replacedWith && (
              <ReplacedWithOrAdded>
                {difference.replacedWith}
              </ReplacedWithOrAdded>
            )}
          </Flex>
        </Item>
      ))}
    </Wrapper>
  );
}
