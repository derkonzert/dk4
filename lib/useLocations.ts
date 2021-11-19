import { PostgrestError } from "@supabase/supabase-js";
import { useCallback } from "react";
import useSWR from "swr";
import { Nullable } from "typescript-nullable";
import { definitions } from "../types/supabase";
import { fromLocations } from "../utils/supabaseClient";

type fetchedLocation = Pick<definitions["locations"], "id" | "name">;

const locationsFetcher = async () => {
  const { data, error } = await fromLocations<fetchedLocation>()
    .select("id,name")
    .order("name");

  if (error) {
    throw error;
  }

  return data;
};

interface UseLocationsResult {
  locations: Nullable<fetchedLocation[]>;
  locationByName: (name: string) => Nullable<fetchedLocation>;
  locationById: (id: string) => Nullable<fetchedLocation>;
  addNewLocation: (name: string) => Promise<{
    data: Nullable<fetchedLocation>;
    error: Nullable<PostgrestError | Error>;
  }>;
  error?: any;
}

export function useLocations(fallbackData = undefined): UseLocationsResult {
  const { data: locations, error } = useSWR("locations", locationsFetcher, {
    fallbackData,
    revalidateOnMount: true,
  });

  const addNewLocation = useCallback(async (locationName) => {
    const { data, error } = await fromLocations<fetchedLocation>()
      .insert({
        name: locationName.trim(),
      })
      .single();

    if (data) {
      return { data, error };
    }

    if (error) {
      // The location might already exist, try fetching it instead
      const alreadyExistingLocation = await fromLocations<fetchedLocation>()
        .select("id,name")
        .match({
          name: locationName.trim(),
        })
        .single();

      return alreadyExistingLocation ?? null;
    }

    return { data: null, error: new Error("Could not create location.") };
  }, []);

  const locationByName = useCallback(
    (locationName) => {
      return locations
        ? locations.find(({ name }) => name === locationName)
        : null;
    },
    [locations]
  );

  const locationById = useCallback(
    (locationId): Nullable<fetchedLocation> => {
      return locations ? locations.find(({ id }) => id === locationId) : null;
    },
    [locations]
  );

  return { locations, locationById, locationByName, addNewLocation, error };
}
