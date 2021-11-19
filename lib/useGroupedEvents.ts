import { useMemo } from "react";
import { isoDateIsSameMonth } from "./isoDateCompare";

interface eventType {
  fromDate?: string;
}

export function useGroupedEvents<T extends eventType>(
  events: T[],
  enabled: boolean = true
): T[][] {
  const groups = useMemo(() => {
    const groups: T[][] = [];

    let lastDate;
    let currentGroupIndex = -1;

    events.forEach((evt) => {
      const ld = lastDate || "";
      const startNewGroup = enabled && !isoDateIsSameMonth(ld, evt.fromDate);

      if (enabled && (!lastDate || startNewGroup) && !!evt.fromDate) {
        lastDate = evt.fromDate;
        currentGroupIndex++;
        groups.push([]);
      }

      groups[currentGroupIndex].push(evt);
    });

    return groups;
  }, [enabled, events]);

  return groups;
}
