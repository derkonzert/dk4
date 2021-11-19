import { InferGetStaticPropsType } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { Nullable } from "typescript-nullable";
import { EventDialog } from "../components/EventDialog";
import { Events } from "../components/Events";
import { Flex } from "../components/Flex";
import { HyperLink } from "../components/HyperLink";
import { TypoText } from "../components/Typo";
import { useEventCreatedListener } from "../lib/useEventCreatedListener";
import { eventsFetcher, fetchedEvent, useEvents } from "../lib/useEvents";
import { useLikes } from "../lib/useLikes";
import { useUser } from "../lib/UserContextProvider";

export const getStaticProps = async () => {
  const events = await eventsFetcher<fetchedEvent>("upcoming");

  // If there is a user, return it.
  return { props: { events }, revalidate: 1 };
};

const Favorites = ({
  events: eventsFromServer,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { events: allUpcomingEvents, mutate } = useEvents(
    "upcoming",
    eventsFromServer
  );
  const [events, setEvents] = useState<typeof allUpcomingEvents>([]);
  const { user } = useUser();
  const { likedEventIds } = useLikes();

  const { query } = useRouter();

  const refreshEventsList = useCallback(
    async function refreshEventsList() {
      mutate();
    },
    [mutate]
  );

  useEffect(() => {
    if (likedEventIds && allUpcomingEvents) {
      setEvents(
        allUpcomingEvents.filter((event) => likedEventIds.includes(event.id))
      );
    }
  }, [allUpcomingEvents, likedEventIds]);

  const handleEventCreated = useCallback(() => {
    refreshEventsList();
  }, [refreshEventsList]);

  useEventCreatedListener(handleEventCreated);

  return (
    <>
      {user ? (
        Nullable.maybe(
          null,
          (events) => (
            <Events
              events={events}
              currentFilter="favorites"
              groupByMonths={false}
            />
          ),
          events
        )
      ) : (
        <Flex
          direction="column"
          gap="3"
          css={{ marginTop: "$5", fontSize: "$5", fontFamily: "$heading" }}
        >
          <TypoText size="copy">
            <Link href="/account/sign-in" passHref>
              <HyperLink>Sign in</HyperLink>
            </Link>{" "}
            or{" "}
            <Link href="/account/sign-up" passHref>
              <HyperLink>create an account</HyperLink>
            </Link>{" "}
            to view your favorites.
          </TypoText>
          <TypoText size="copy">
            Why would you bother and bother and create an account?
            <br />
            <Link href="/about/features" passHref>
              <HyperLink>Learn about the features.</HyperLink>
            </Link>
          </TypoText>
        </Flex>
      )}

      <EventDialog
        id={query.eventId}
        onError={() => {
          mutate();
        }}
        onDeleted={() => refreshEventsList()}
      />
    </>
  );
};

export default Favorites;
