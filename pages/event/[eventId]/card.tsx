import { useLayoutEffect, useRef } from "react";
import { TypoHeading, TypoText } from "../../../components/Typo";
import { useTranslation } from "../../../lib/TranslationContextProvider";
import { styled } from "../../../stitches.config";
import { definitions } from "../../../types/supabase";
import { fromEvents } from "../../../utils/supabaseClient";

const Card = styled("div", {
  display: "inline-block",
  flex: "0 1 auto",
  lineHeight: "1.25",

  fontSize: "calc(16px + 5vw)",
});

const Root = styled("div", {
  display: "flex",
  height: "calc(92vh)",
  paddingBlock: "4vh",
  paddingInline: "4vw",

  overflow: "hidden",

  alignItems: "center",
  justifyContent: "flex-start",
});

export async function getStaticPaths(context) {
  return {
    paths: [],
    fallback: "blocking",
  };
}

export const getStaticProps = async ({ params }) => {
  const { data: event } = await fromEvents<definitions["events"]>()
    .select(`*`)
    .eq("id", params.eventId)
    .single();

  if (!event) {
    return {
      notFound: true,
    };
  }

  return { props: { event }, revalidate: 1 };
};

const EventDetail = ({ event }: { event: definitions["events"] }) => {
  const { formatDateLocalized } = useTranslation();
  const rootRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (cardRef.current && rootRef.current) {
      let countdown = 5;
      let cardHeight = cardRef.current.getBoundingClientRect().height;
      const padding = 25;

      while (
        countdown > 0 &&
        cardHeight > rootRef.current.clientHeight - padding
      ) {
        countdown--;

        cardRef.current.style.fontSize = `calc(16px + ${countdown}vw)`;

        cardHeight = cardRef.current.getBoundingClientRect().height;
      }

      countdown--;

      if (countdown > 0) {
        cardRef.current.style.fontSize = `calc(16px + ${countdown}vw)`;
      }
    }
  }, []);

  return (
    <Root ref={rootRef}>
      <Card ref={cardRef}>
        <TypoHeading size="h6" css={{ color: "$primary" }}>
          derkonzert.de
        </TypoHeading>
        <TypoHeading size="h1">{event.title || ""}</TypoHeading>
        <TypoText as="p">
          {!!event.fromDate &&
            formatDateLocalized(new Date(event.fromDate), "PP")}
        </TypoText>
      </Card>
    </Root>
  );
};

export default EventDetail;
