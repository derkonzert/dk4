import { Events } from "../../../components/Events";
import { Loader } from "../../../components/Loader";
import {
  LocationDetailData,
  locationDetails,
} from "../../../components/LocationDetailData";
import { eventsFetcher, fetchedEvent, useEvents } from "../../../lib/useEvents";
import { definitions } from "../../../types/supabase";
import { fromLocations } from "../../../utils/supabaseClient";

export async function getStaticPaths(context) {
  return {
    paths: [],
    fallback: "blocking",
  };
}

export const getStaticProps = async ({ params }) => {
  const { data: location } = await fromLocations<locationDetails>()
    .select(`*`)
    .eq("id", params.locationId)
    .single();

  if (!location) {
    return {
      notFound: true,
    };
  }

  const events = await eventsFetcher(
    "upcoming",
    undefined,
    undefined,
    params.locationId
  );

  return { props: { location, events }, revalidate: 1 };
};

interface LocationDetailPageOwnProps {
  location: definitions["locations"];
  eventsFromServer: fetchedEvent[];
}

const LocationDetailPage = ({
  location,
  eventsFromServer,
}: LocationDetailPageOwnProps) => {
  const { events } = useEvents(
    "upcoming",
    eventsFromServer,
    undefined,
    undefined,
    location.id
  );

  return (
    <>
      <LocationDetailData location={location} />
      {events ? (
        <Events events={events} currentFilter="" />
      ) : (
        <Loader label="Fetching events" />
      )}
    </>
  );
};

export default LocationDetailPage;
