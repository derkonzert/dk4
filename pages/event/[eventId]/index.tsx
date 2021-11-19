import {
  eventDetailData,
  EventDetailData,
} from "../../../components/EventDetailData";
import { SidebarPage } from "../../../components/SidebarPage";
import { TypoHeading } from "../../../components/Typo";
import {
  getEventShortIdFromLegacyEventSlug,
  isLegacyEventSlug,
} from "../../../lib/legacyEventSlut";
import { definitions } from "../../../types/supabase";
import { fromEvents, fromUpcomingEvents } from "../../../utils/supabaseClient";

export async function getStaticPaths(context) {
  // Only pre-build upcoming event detail pages
  const { data: events } = await fromUpcomingEvents(`id,title,fromDate,toDate`);

  return {
    paths: events
      ? context.locales.flatMap((locale) =>
          events.map((event) => ({ params: { eventId: event.id }, locale }))
        )
      : [],
    fallback: "blocking",
  };
}

export const getStaticProps = async ({ params }) => {
  // // TODO: extend event model and views with legacyId
  if (isLegacyEventSlug(params.eventId)) {
    const legacyId = getEventShortIdFromLegacyEventSlug(params.eventId);

    if (!legacyId) {
      return {
        notFound: true,
      };
    }

    const { data: event } = await fromEvents<
      eventDetailData & { legacyId: string }
    >()
      .select(`*`)
      .eq("legacyId", legacyId)
      .single();

    if (!event) {
      return {
        notFound: true,
      };
    }

    return {
      redirect: {
        destination: `/event/${event?.id}`,
        permanent: true,
      },
    };
  }

  const { data: event } = await fromEvents<eventDetailData>()
    .select(`*`)
    .eq("id", params.eventId)
    .single();

  if (!event) {
    return {
      notFound: true,
    };
  }

  const { data: childEvents } = await fromEvents<eventDetailData>()
    .select("*")
    .eq("parent_event", params.eventId);

  // If there is a user, return it.
  return { props: { event, childEvents }, revalidate: 1 };
};

interface EventDetailPageOwnProps {
  event: definitions["events"];
  childEvents: definitions["events"][];
}

const EventDetailPage = ({ event, childEvents }: EventDetailPageOwnProps) => {
  return (
    <SidebarPage>
      <TypoHeading as="h1" size="h1" css={{ marginTop: "$5" }}>
        {event.title}
      </TypoHeading>
      <EventDetailData event={event} childEvents={childEvents} />
    </SidebarPage>
  );
};

export default EventDetailPage;
