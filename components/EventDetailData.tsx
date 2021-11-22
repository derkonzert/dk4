import { ExternalLinkIcon } from "@radix-ui/react-icons";
import { isSameDay } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { Nullable } from "typescript-nullable";
import { isoDateIsSameDay } from "../lib/isoDateCompare";
import RichText, {
  Headlines as HeadlinesPlugin,
  Link as LinkPlugin,
  Provider as RichTextProvider,
  Spotify as SpotifyPlugin,
  Vimeo as VimeoPlugin,
  YouTube as YouTubePlugin,
} from "../lib/rtxt/rtxt.react";
import { sortChildEvents } from "../lib/sortChildEvents";
import { useTranslation } from "../lib/TranslationContextProvider";
import { useLocations } from "../lib/useLocations";
import { useUser } from "../lib/UserContextProvider";
import { definitions } from "../types/supabase";
import { Button, ButtonIcon } from "./Button";
import { CompactEventList, CompactEventListItem } from "./CompactEventList";
import { EventDeleteLink } from "./EventDeleteLink";
import { EventUpdates } from "./EventUpdates";
import { Flex } from "./Flex";
import { HyperLink } from "./HyperLink";
import { Iframe } from "./IFrame";
import { LikeButton } from "./LikeButton";
import { LinkToEventUpdate } from "./LinkToEvent";
import { Separator } from "./Separator";
import { ShareButton } from "./ShareButton";
import { TypoHeading, TypoText } from "./Typo";
import { VerifyEventLinkLink } from "./VerifyEventLink";

const rtxtPlugins = [
  HeadlinesPlugin.createCopy({
    meta: {
      Component: {
        h1: TypoHeading,
        h2: TypoHeading,
        h3: TypoHeading,
      },
    },
  }),
  LinkPlugin.createCopy({ meta: { Component: HyperLink } }),
  VimeoPlugin.createCopy({ meta: { Component: Iframe } }),
  YouTubePlugin.createCopy({ meta: { Component: Iframe } }),
  SpotifyPlugin.createCopy({ meta: { Component: Iframe } }),
];

export type eventDetailData = Pick<
  definitions["event_list"],
  | "title"
  | "fromDate"
  | "toDate"
  | "description"
  | "parent_event"
  | "verified"
  | "location"
  | "ticketPrice"
  | "url"
  | "canceled"
> & { id: string };

interface EventDetailDataOwnProps {
  event: eventDetailData;
  childEvents: eventDetailData[];
  onDeleted?: (id: string) => void;
  onVerified?: (id: string) => void;
}

export const EventDetailData = ({
  event,
  childEvents,
  onDeleted,
  onVerified,
}: EventDetailDataOwnProps) => {
  const { hasRole } = useUser();
  const { t, formatDateLocalized } = useTranslation();
  const { query } = useRouter();
  const currentFilter = query.currentFilter || "";
  const now = new Date();
  const { locationById } = useLocations();

  const location = useMemo(
    () => Nullable.maybe(null, locationById, event?.location),
    [event, locationById]
  );

  const from = Nullable.maybe(new Date(), (d) => new Date(d), event.fromDate);
  const to = event.toDate ? new Date(event.toDate) : null;

  return (
    <Flex direction="column" css={{ flexGrow: 1 }}>
      <Flex
        gap="2"
        align="center"
        justify="between"
        css={{ marginBlock: "$2" }}
      >
        <TypoText size="copy" as="p" css={{ color: "$primary" }}>
          {formatDateLocalized(from, "PPp")}
          {!!to &&
            " - " +
              formatDateLocalized(to, isSameDay(from, to) ? "p" : "PPp")}{" "}
          <Link passHref href={`/location/${event.location}`}>
            <HyperLink type="ghost">
              {location && `@${location.name}`}
            </HyperLink>
          </Link>
        </TypoText>
        <LikeButton eventId={event.id} />
      </Flex>

      {!event.verified && (
        <TypoText
          color="warning"
          css={{
            marginBlock: "$4",
            padding: "$2",
            borderRadius: "$2",
            border: "1px solid $red6",
          }}
        >
          {t("badge.notVerified.explanation")}
        </TypoText>
      )}
      {event.canceled && (
        <TypoText
          color="warning"
          css={{
            marginBlock: "$4",
            padding: "$2",
            borderRadius: "$2",
            border: "1px solid $red6",
          }}
        >
          {t("badge.canceled.explanation")}
        </TypoText>
      )}

      <Flex
        gap="2"
        align="center"
        justify="start"
        css={{
          borderTop: "1px solid $slate5",
          borderBottom: "1px solid $slate5",
          marginBlock: "$2",
          paddingBlock: "$2",
        }}
      >
        {!!event.url && (
          <Button
            variant="ghost"
            size="small"
            as="a"
            href={event.url}
            rel="noopener noreferrer"
            target="_blank"
          >
            <ButtonIcon as={ExternalLinkIcon} position="left" />
            {t("eventDetail.externalLink")}
          </Button>
        )}

        <ShareButton size="small" />

        {hasRole("admin") && (
          <Flex gap="4" css={{ marginLeft: "auto" }}>
            <EventDeleteLink
              id={event.id}
              onDeleted={() => {
                onDeleted?.(event.id);
              }}
            />
            {!event?.verified && (
              <VerifyEventLinkLink
                id={event.id}
                onVerified={() => {
                  onVerified?.(event.id);
                }}
              />
            )}
          </Flex>
        )}
      </Flex>

      {!!event.ticketPrice && (
        <Flex justify="end">
          <TypoText
            size="small"
            css={{
              backgroundColor: "$indigo3",
              color: "$indigo10",
              borderRadius: "$3",
              fontWeight: "bold",
              padding: "$1 $2",
            }}
          >
            Ticket: ~{event.ticketPrice}€
          </TypoText>
        </Flex>
      )}

      {!!childEvents.length && (
        <>
          <TypoHeading css={{ marginTop: "$2" }} as="h3">
            {t("eventDetail.childEventsTitle")}
          </TypoHeading>
          <CompactEventList css={{ marginBlock: "$4" }}>
            {sortChildEvents(childEvents).map((childEvent) => {
              const isInPast =
                (childEvent.toDate
                  ? new Date(childEvent.toDate)
                  : new Date(childEvent.fromDate)) < now;

              return (
                <Link
                  key={childEvent.id}
                  href={`${currentFilter}/?eventId=${childEvent.id}&currentFilter=${currentFilter}`}
                  as={`/event/${childEvent.id}`}
                  passHref
                  shallow
                >
                  <CompactEventListItem
                    isInPast={isInPast}
                    title={childEvent.title}
                  >
                    <TypoText
                      strong
                      css={{ marginRight: "$1" }}
                    >{`${childEvent.title}`}</TypoText>
                    <TypoText>
                      {isoDateIsSameDay(event.fromDate, childEvent.fromDate)
                        ? formatDateLocalized(
                            new Date(childEvent.fromDate),
                            "p"
                          )
                        : formatDateLocalized(
                            new Date(childEvent.fromDate),
                            "Pp"
                          )}
                    </TypoText>
                    <LikeButton
                      disabled={isInPast}
                      eventId={childEvent.id}
                      size="small"
                    />
                  </CompactEventListItem>
                </Link>
              );
            })}
          </CompactEventList>
          <Separator decorative orientation="horizontal" />
        </>
      )}

      {!!event.description && (
        <>
          <RichTextProvider value={rtxtPlugins}>
            <TypoText size="copy">
              <RichText value={event.description} />
            </TypoText>
          </RichTextProvider>
        </>
      )}

      <EventUpdates event={event} />

      <Flex
        css={{
          marginTop: "auto",
          marginBottom: "$5",
          paddingBlock: "$3",
          paddingInline: "$3",
          background: "$indigo4",
          borderRadius: "$3",
          color: "$indigo12",
        }}
        justify="between"
        align="center"
        direction={{ "@initial": "column", "@bp1": "row" }}
        gap="2"
      >
        <Flex gap="1" direction="column">
          <TypoHeading>{t("eventDetail.createUpdate.label")}</TypoHeading>
          <TypoText>{t("eventDetail.createUpdate.description")}</TypoText>
        </Flex>

        <LinkToEventUpdate id={event.id}>
          <Button variant="primary" as="a">
            {t("eventDetail.createUpdate.action")}
          </Button>
        </LinkToEventUpdate>
      </Flex>
    </Flex>
  );
};
