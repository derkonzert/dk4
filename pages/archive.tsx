import { InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { EventDialog } from "../components/EventDialog";
import { Events } from "../components/Events";
import { Flex } from "../components/Flex";
import { Select } from "../components/Input";
import { Loader } from "../components/Loader";
import { TypoHeading, TypoText } from "../components/Typo";
import { useTranslation } from "../lib/TranslationContextProvider";
import { useEvents } from "../lib/useEvents";
import { Maybe } from "../types/maybe";
import { supabase } from "../utils/supabaseClient";

export const getStaticProps = async ({ params }) => {
  const { data: eventData, error } = await supabase.rpc<{
    events_per_year: number;
    from_year: string;
  }>("archive_event_stats", {});

  const eventStats = eventData
    ? eventData.map((year) => [parseInt(year.from_year), year.events_per_year])
    : [];

  const { data: locationData, error: lError } = await supabase.rpc<
    Maybe<{ location_count: number }>
  >("location_stats", {});

  const locationCount = locationData?.[0]?.location_count ?? 0;

  return { props: { eventStats, locationCount }, revalidate: 1 };
};

const ArchivePage = ({
  locationCount,
  eventStats,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation();
  const { query } = useRouter();

  const [year, setYear] = useState(new Date().getFullYear());
  const yearAsDate = useMemo(() => {
    return new Date(year, 1, 1);
  }, [year]);

  const { events, mutate, isValidating } = useEvents(
    "archived",
    undefined,
    undefined,
    yearAsDate.toISOString()
  );

  return (
    <>
      <Flex
        direction="column"
        css={{
          paddingBlock: "$8",
          gridColumn: "1 / 4",
          background: "$indigo4",
          borderBottom: "1px solid $colors$slate5",
        }}
      >
        <TypoHeading
          css={{
            alignSelf: "center",
            textAlign: "center",
            color: "$indigo10",
            maxWidth: 520,
          }}
          size="h1"
        >
          {t("archive.overview")}
        </TypoHeading>

        <Flex
          direction="row"
          wrap="wrap"
          justify="between"
          css={{
            marginTop: "$8",
            marginBottom: "$6",
            maxWidth: 1248,
            marginInline: "auto",
            width: "100%",
          }}
        >
          <Flex direction="column" align="center" css={{ flex: "1 0 0px" }}>
            <TypoHeading size="h0">
              {eventStats.reduce(
                (soFar, [_from_year, events_per_year]) =>
                  soFar + events_per_year,
                0
              )}
            </TypoHeading>

            <TypoText css={{ color: "$slate11" }}>
              {t("archive.eventCount")}
            </TypoText>
          </Flex>
          <Flex direction="column" align="center" css={{ flex: "1 0 0px" }}>
            <TypoHeading size="h0">{locationCount}</TypoHeading>
            <TypoText css={{ color: "$slate11" }}>
              {t("archive.locationCount")}
            </TypoText>
          </Flex>
          <Flex direction="column" align="center" css={{ flex: "1 0 0px" }}>
            <TypoHeading size="h0">{eventStats.length}</TypoHeading>
            <TypoText css={{ color: "$slate11" }}>
              {t("archive.yearsSince")}{" "}
              {eventStats.length ? eventStats[eventStats.length - 1][0] : ""}
            </TypoText>
          </Flex>
        </Flex>
      </Flex>
      <Flex align="center" gap="3" css={{ marginTop: "$8" }}>
        <TypoHeading css={{ color: "$slate12" }} size="h4">
          {t("archive.filter.label")}
        </TypoHeading>
        <Select
          name="year"
          onChange={(e) => {
            setYear(parseInt(e.currentTarget.value));
          }}
        >
          {eventStats.map(([year, totalCount]) => (
            <option key={year} value={year}>
              {year} ({totalCount})
            </option>
          ))}
        </Select>
        {isValidating && <Loader size="small" />}
      </Flex>
      {!!events && <Events events={events} currentFilter="archive" />}

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

export default ArchivePage;
