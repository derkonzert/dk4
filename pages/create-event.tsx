import { parseISO } from "date-fns";
import { useRouter } from "next/router";
import { useMemo } from "react";
import toast from "react-hot-toast";
import { Nullable } from "typescript-nullable";
import { CreateEventForm } from "../components/CreateEventForm";

function ensureString(string: string | string[]): string {
  return Array.isArray(string) ? string[0] : string;
}

export default function CreateEvent() {
  const { query } = useRouter();

  const fromDate = useMemo(() => {
    const dateString = Nullable.map(ensureString, query.fromDate);

    if (dateString) {
      return parseISO(dateString);
    }
    return undefined;
  }, [query.fromDate]);

  return (
    <CreateEventForm
      defaultValues={{
        title: Nullable.maybe("", ensureString, query.title),
        location: Nullable.maybe("", ensureString, query.location),
        fromDate,
        url: Nullable.maybe("", ensureString, query.url),
      }}
      onEventCreated={() => {
        toast.success("🎉");
      }}
    />
  );
}
