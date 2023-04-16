import { parseISO } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/router";
import { Nullable } from "typescript-nullable";
import { useTranslation } from "../lib/TranslationContextProvider";
import { isoDateIsSameDay } from "../lib/isoDateCompare";
import { sortChildEvents } from "../lib/sortChildEvents";
import { useGroupedEvents } from "../lib/useGroupedEvents";
import { styled } from "../stitches.config";
import { definitions } from "../types/supabase";
import { Flex } from "./Flex";
import { Grid } from "./Grid";
import { LikeButton, LikeButtonStyled } from "./LikeButton";
import { StatusBadgeTooltip } from "./StatusBadge";
import { TypoHeading } from "./Typo";

const Wrapper = styled(Grid, {
  marginBlock: "$6",
  gridTemplateRows: "min-content",
});

const EventList = styled(Grid, {
  width: "100%",
  gridTemplateColumns: "100%",
});

const EventsGroup = styled("div", {
  position: "relative",
});

const EventsMonth = styled(TypoHeading, {
  position: "sticky",
  top: 90,
  boxShadow: "0 1px 12px -4px $colors$indigo8",
  padding: "$1 $3",
  transform: "translate(-$space$3, -$space$1)",
  width: "fit-content",
  backgroundColor: "$indigo9",
  borderRadius: "$2",
  color: "$indigo1",
  marginTop: "$3",
  marginBottom: "$3",
  marginLeft: "$3",

  fontSize: "$2",
  "@bp1": { fontSize: "$4", marginLeft: 0 },
});

const EventTitle = styled("div", {
  color: "$slate12",
  fontSize: "$5",
  "@bp1": { fontSize: "$7" },
  "@bp2": { fontSize: "$8" },
  fontWeight: "bold",
  fontFamily: "$heading",
  wordBreak: "break-word",
});

const EventData = styled("div", {
  color: "$indigo11",
  fontSize: "$2",
  fontWeight: "bold",
  fontFamily: "$heading",
  "@bp1": { fontSize: "$3" },
  "@bp2": { fontSize: "$3" },
});

const ChildEvents = styled("ol", {
  display: "flex",
  flexWrap: "wrap",
  gap: "$1",
  color: "$primary",
  marginBottom: "0",
  paddingInlineStart: "$3",
  marginInlineStart: "$2",
  borderInlineStart: "3px solid $colors$indigo6",
});

const ChildEventItem = styled("li", {
  color: "$slate11",
  listStyle: "none",

  "&:not(:first-child):before": {
    content: '" / "',
    color: "$indigo9",
  },
});

const EventListItemLink = styled("a", {
  display: "flex",
  flexWrap: "nowrap",
  flex: "0 0 auto",
  color: "$slate12",
  textDecoration: "none",

  "&:hover": {
    color: "$primary",

    [`& ${LikeButtonStyled}`]: {
      borderColor: "$indigo11",
    },

    [`& ${EventTitle}`]: {
      textDecoration: "underline",
    },
  },

  variants: {
    selected: {
      true: {
        [`& ${EventTitle}`]: {
          textDecoration: "underline",
        },
      },
    },

    canceled: {
      true: {
        [`& ${EventTitle}`]: {
          textDecoration: "line-through",
        },
        "&:hover": {
          [`& ${EventTitle}`]: {
            textDecoration: "line-through",
          },
        },
      },
    },
  },
  compoundVariants: [
    {
      canceled: true,
      selected: true,
      css: {
        textDecoration: "line-through",
      },
    },
  ],
});

type eventsProp = definitions["event_list"] & { id: string };
interface EventsProps {
  events: eventsProp[];
  currentFilter: "" | "latest" | "favorites" | "archive";
  groupByMonths?: boolean;
}

type childEventType = Pick<
  definitions["events"],
  "id" | "title" | "fromDate" | "toDate"
>;

export function Events({
  events,
  currentFilter,
  groupByMonths = true,
}: EventsProps) {
  const { t, formatDateLocalized } = useTranslation();

  const { query } = useRouter();
  const now = new Date();

  const groups = useGroupedEvents(events);

  return (
    <Wrapper gapY="6">
      {groups.map((events) => {
        const firstEvent = events[0];
        const dateString = formatDateLocalized(
          Nullable.maybe(now, parseISO, firstEvent.fromDate),
          "MMMM yyyy"
        );

        return (
          <EventsGroup key={firstEvent.id}>
            {groupByMonths && <EventsMonth>{dateString}</EventsMonth>}
            <EventList gapY={{ "@initial": "6", "@bp1": "5" }}>
              {events.map((evt) => {
                const fromDate = Nullable.maybe(now, parseISO, evt.fromDate);
                const childEventsUnsorted =
                  // @ts-ignore (openapi generates string intead of event)
                  evt.child_events as childEventType[];

                const childEvents = sortChildEvents(
                  childEventsUnsorted.filter((evt) =>
                    evt.toDate ? new Date(evt.toDate) : fromDate >= now
                  )
                );

                return (
                  <Link
                    key={evt.id}
                    href={`${currentFilter}/?eventId=${evt.id}&currentFilter=${currentFilter}`}
                    as={`/event/${evt.id}`}
                    passHref
                    shallow
                  >
                    <EventListItemLink
                      data-test-id="event-list-item"
                      title={evt.title}
                      selected={query.eventId === evt.id}
                      canceled={evt.canceled}
                    >
                      <Flex direction="column">
                        <EventTitle>
                          {evt.title}
                          {/* <EventScore
                            score={2 + (index % 4)}
                            startChar={evt.title.substr(0, 1)}
                          /> */}
                          {evt.canceled && (
                            <StatusBadgeTooltip
                              type="danger"
                              explanation={t("badge.canceled.explanation")}
                            >
                              {t("badge.canceled")}
                            </StatusBadgeTooltip>
                          )}
                          {!evt.verified && (
                            <StatusBadgeTooltip
                              type="warning"
                              explanation={t("badge.notVerified.explanation")}
                            >
                              {t("badge.notVerified")}
                            </StatusBadgeTooltip>
                          )}
                        </EventTitle>

                        <EventData>
                          {formatDateLocalized(fromDate, "PPp")}
                          {!!evt.toDate &&
                            !isoDateIsSameDay(evt.fromDate, evt.toDate) && (
                              <>
                                {" — "}
                                {formatDateLocalized(
                                  new Date(evt.toDate),
                                  "PPp"
                                )}
                              </>
                            )}
                          {!!evt.location_name && (
                            <> &mdash; {evt.location_name}</>
                          )}
                        </EventData>
                        {childEvents?.length > 0 && (
                          <ChildEvents>
                            {childEvents.map((childEvent) => (
                              <ChildEventItem key={childEvent.id}>
                                {childEvent.title}
                              </ChildEventItem>
                            ))}
                          </ChildEvents>
                        )}
                      </Flex>
                      <LikeButton
                        eventId={evt.id}
                        data-splitbee-event="Event Toggle Like"
                      />
                    </EventListItemLink>
                  </Link>
                );
              })}
            </EventList>
          </EventsGroup>
        );
      })}
    </Wrapper>
  );
}
