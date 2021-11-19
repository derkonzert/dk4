import { styled } from "../stitches.config";
import { definitions } from "../types/supabase";
import { TypoHeading } from "./Typo";

export type locationDetails = definitions["locations"];

interface LocationDetailDataOwnProps {
  location: locationDetails;
}

const Hero = styled("div", {
  background: "$indigo4",
  padding: "$7 $8",
  gridColumn: "1 / 4",
});

export function LocationDetailData({ location }: LocationDetailDataOwnProps) {
  return (
    <>
      <Hero>
        <TypoHeading as="h1" size="h1">
          {location.name}
        </TypoHeading>
      </Hero>
    </>
  );
}
