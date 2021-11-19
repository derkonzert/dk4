import { useRouter } from "next/router";
import { useCallback } from "react";
import { CreateEventUpdateForm } from "../../../components/CreateEventUpdateForm";
import { makeEventPathProps } from "../../../components/LinkToEvent";
import { Loader } from "../../../components/Loader";
import { SidebarPage } from "../../../components/SidebarPage";
import { eventFetcher, useEvent } from "../../../lib/useEvent";
import { eventWithLocation } from "../../../types/supabaseManualEnhanced";

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

export const getStaticProps = async ({ params }) => {
  const event = await eventFetcher(params.eventId);

  if (!event) {
    return {
      notFound: true,
    };
  }

  // If there is a user, return it.
  return { props: { event }, revalidate: 1 };
};

interface EventDetailPageOwnProps {
  event: eventWithLocation;
}

const EventDetailPage = ({
  event: eventFromServer,
}: EventDetailPageOwnProps) => {
  const router = useRouter();
  const { event, error } = useEvent(eventFromServer.id, eventFromServer);

  const onChangesSubmitted = useCallback(() => {
    if (!event) {
      return;
    }

    const pathProps = makeEventPathProps(event.id, router.query.currentFilter);

    router.push(pathProps.href, pathProps.as);
  }, [event, router]);

  if (error) {
    return <div>Error</div>;
  }

  return (
    <SidebarPage>
      {!event ? (
        <Loader />
      ) : (
        <CreateEventUpdateForm
          event={event}
          onChangesSubmitted={onChangesSubmitted}
        />
      )}
    </SidebarPage>
  );
};

export default EventDetailPage;
