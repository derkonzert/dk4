import { InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";
import React, { useCallback } from "react";
import { Nullable } from "typescript-nullable";
import { EventDialog } from "../components/EventDialog";
import { Events } from "../components/Events";
import { MissingSomethingTeaser } from "../components/MissingSomethingTeaser";
import { WelcomePanel } from "../components/WelcomePanel";
import { useEventCreatedListener } from "../lib/useEventCreatedListener";
import {
  eventsFetcher,
  fetchedEvent,
  top5fetcher,
  useEvents,
} from "../lib/useEvents";

export const getStaticProps = async () => {
  const events = await eventsFetcher<fetchedEvent>("upcoming");
  const latest5 = await eventsFetcher<fetchedEvent>("latest", 5);
  const top5ThisWeek = await top5fetcher(5);

  // If there is a user, return it.
  return { props: { events, latest5, top5ThisWeek }, revalidate: 1 };
};

const Index = ({
  events: eventsFromServer,
  latest5: latest5FromServer,
  top5ThisWeek: top5ThisWeekServer,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { events, mutate } = useEvents("upcoming", eventsFromServer);

  const { query } = useRouter();

  const handleEventCreated = useCallback(async () => {
    mutate();
    // Ping home to trigger regeneration of static page
    await Promise.all([fetch("/"), fetch("/latest")]);
  }, [mutate]);

  useEventCreatedListener(handleEventCreated);

  return (
    <>
      <WelcomePanel
        latest5fromServer={latest5FromServer}
        top5ThisWeekServer={top5ThisWeekServer}
      />

      {Nullable.maybe(
        null,
        (events) => (
          <Events events={events} currentFilter="" />
        ),
        events
      )}

      <MissingSomethingTeaser />

      <EventDialog
        id={query.eventId}
        onError={() => {
          mutate();
        }}
        onDeleted={() => mutate()}
      />
    </>
  );
};

export default Index;
