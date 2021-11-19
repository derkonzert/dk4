import { InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { Nullable } from "typescript-nullable";
import { EventDialog } from "../components/EventDialog";
import { Events } from "../components/Events";
import { MissingSomethingTeaser } from "../components/MissingSomethingTeaser";
import { useEventCreatedListener } from "../lib/useEventCreatedListener";
import { eventsFetcher, fetchedEvent, useEvents } from "../lib/useEvents";

export const getStaticProps = async ({}) => {
  const events = await eventsFetcher<fetchedEvent>("latest");

  // If there is a user, return it.
  return { props: { events }, revalidate: 1 };
};

const Latest = ({
  events: eventsFromServer,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { events, mutate } = useEvents("latest", eventsFromServer);
  const { query } = useRouter();

  const handleEventCreated = useCallback(() => {
    mutate();
  }, [mutate]);

  useEventCreatedListener(handleEventCreated);

  return (
    <>
      {Nullable.isSome(events) && (
        <Events events={events} currentFilter="latest" groupByMonths={false} />
      )}

      <MissingSomethingTeaser />

      <EventDialog
        id={query.eventId}
        onError={() => {
          mutate();
        }}
        onDeleted={handleEventCreated}
      />
    </>
  );
};

export default Latest;
