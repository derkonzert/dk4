import Link from "next/link";
import { useRouter } from "next/router";

export const makeEventPathProps = (id, currentFilter?: string | string[]) => {
  const cf = currentFilter
    ? Array.isArray(currentFilter)
      ? currentFilter[0]
      : currentFilter
    : "";

  return {
    href: `${cf}/?eventId=${id}&currentFilter=${cf}`,
    as: `/event/${id}`,
  };
};

export function LinkToEventUpdate({ id, children }) {
  return (
    <Link href={`/event/${id}/update`} passHref>
      {children}
    </Link>
  );
}

export function LinkToEventDialog({ id, children }) {
  const { query } = useRouter();

  return (
    <Link {...makeEventPathProps(id, query.currentFilter)} passHref shallow>
      {children}
    </Link>
  );
}
