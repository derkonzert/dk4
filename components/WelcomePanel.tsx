import { parseISO } from "date-fns";
import Link from "next/link";
import { Nullable } from "typescript-nullable";
import { useTranslation } from "../lib/TranslationContextProvider";
import { useEvents, useTop5ThisWeek } from "../lib/useEvents";
import { styled } from "../stitches.config";
import { Box } from "./Box";
import { CompactEventList, CompactEventListItem } from "./CompactEventList";
import { HyperLink } from "./HyperLink";
import { LikeButton } from "./LikeButton";
import { LinkToEventDialog } from "./LinkToEvent";
import { TypoHeading, TypoText } from "./Typo";

const WelcomeCard = styled("div", {
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  // aspectRatio: 0.723,
  paddingBlock: "$6",
  paddingInline: "$4",
  width: "100%",
  flex: "1 0 auto",
  maxWidth: 400,
  borderRadius: "$3",
  color: "$indigo12",
  backgroundColor: "$indigo1",
  boxShadow: "0 4px 10px -5px $colors$blackA7, 0 1px 22px 0px $colors$blackA5",
});

export function WelcomePanel({ latest5fromServer, top5ThisWeekServer }) {
  const { t } = useTranslation();
  const { events: latest5 } = useEvents("latest", latest5fromServer, 5);
  const { events: top5ThisWeek, mutate: mutateTop5ThisWeek } = useTop5ThisWeek(
    top5ThisWeekServer,
    5
  );

  const now = new Date();

  return (
    <Box css={{ gridColumn: "1 / 4", background: "$bg1", maxWidth: "100%" }}>
      <Box
        css={{
          paddingTop: "$8",
          paddingInline: "$4",

          borderBottom: "1px solid $slate5",
          width: "100%",
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
          scrollSnapType: "x mandatory",
          paddingBottom: "$8",
          display: "flex",
          flexWrap: "nowrap",
          gap: "$5",

          "& > *": {
            scrollSnapAlign: "center",
          },

          "@bp2": {
            paddingInline: "$6",
          },
          "@bp3": { paddingInline: "$8", scrollSnapType: "none" },
        }}
      >
        <Box
          css={{
            paddingBlock: "$6",
            paddingRight: "$4",
            minWidth: 320,
            width: "100%",
            "@bp1": {
              minWidth: "35vw",
            },
          }}
        >
          <TypoHeading
            size={{ "@initial": "h2", "@bp1": "h1" }}
            css={{ marginBottom: "$8" }}
          >
            {t("welcomePanel.title")}
          </TypoHeading>
          <TypoText size="copy" css={{ width: "100%", maxWidth: 400 }}>
            <p>{t("welcomePanel.description[0]")}</p>
            <p>{t("welcomePanel.description[1]")}</p>

            <Link href="/about" passHref>
              <HyperLink>{t("welcomePanel.readMore")}</HyperLink>
            </Link>
          </TypoText>
        </Box>

        <WelcomeCard>
          <TypoHeading
            size={{ "@initial": "h3", "@bp1": "h2" }}
            css={{ marginBottom: "$8" }}
          >
            {t("welcomePanel.latest.title")}
          </TypoHeading>
          <CompactEventList>
            {Nullable.map((events) => {
              return events.map((evt) => {
                const fromDate = Nullable.maybe(now, parseISO, evt.fromDate);
                const isInPast =
                  (evt.toDate ? parseISO(evt.toDate) : fromDate) < now;

                return (
                  <LinkToEventDialog key={evt.id} id={evt.id}>
                    <CompactEventListItem isInPast={isInPast} title={evt.title}>
                      <TypoText
                        css={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          minWidth: 0,
                          textOverflow: "ellipsis",
                          marginRight: "$2",
                        }}
                      >
                        {evt.title}
                      </TypoText>

                      <LikeButton
                        size="small"
                        disabled={isInPast}
                        eventId={evt.id}
                      />
                    </CompactEventListItem>
                  </LinkToEventDialog>
                );
              });
            }, latest5)}
          </CompactEventList>
        </WelcomeCard>
        {!!top5ThisWeek && !!top5ThisWeek.length && (
          <WelcomeCard css={{ backgroundColor: "$indigo9", color: "$indigo1" }}>
            <TypoHeading
              size={{ "@initial": "h3", "@bp1": "h2" }}
              css={{ marginBottom: "$8" }}
            >
              {t("welcomePanel.popular.title")}
            </TypoHeading>
            <CompactEventList color="indigo">
              {top5ThisWeek.map((evt, index) => {
                const isInPast =
                  Nullable.maybe(now, parseISO, evt.fromDate) < now;

                return (
                  <LinkToEventDialog key={evt.id} id={evt.id}>
                    <CompactEventListItem
                      color="indigo"
                      isInPast={isInPast}
                      title={evt.title}
                    >
                      <TypoText
                        css={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          minWidth: 0,
                          textOverflow: "ellipsis",
                          marginRight: "$2",
                        }}
                      >
                        <strong>{index + 1}.</strong>
                        {` ${evt.title}`}
                      </TypoText>

                      <LikeButton
                        color="indigo"
                        size="small"
                        disabled={isInPast}
                        eventId={evt.id}
                        onLikeChanged={() => {
                          mutateTop5ThisWeek();
                        }}
                      />
                    </CompactEventListItem>
                  </LinkToEventDialog>
                );
              })}
            </CompactEventList>
          </WelcomeCard>
        )}
      </Box>
    </Box>
  );
}
