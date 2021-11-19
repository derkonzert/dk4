import { format, parseISO } from "date-fns";
import { useMemo } from "react";

export interface Diff {
  label: string;
  removed?: string;
  replacedWith?: string;
}

export function useDifferences(fields, compareTo) {
  const differencesMemo = useMemo(() => {
    const differences: Diff[] = [];

    for (const [fieldName, isDirty] of Object.entries(fields)) {
      if (fieldName === "summary") {
        continue;
      }
      if (isDirty) {
        switch (fieldName) {
          case "location":
            differences.push({
              label: fieldName,
              removed: compareTo.location?.name,
              replacedWith: fields[fieldName],
            });
            break;
          case "fromDate":
          case "toDate":
            const date = (
              typeof fields[fieldName] === "string"
                ? parseISO(fields[fieldName])
                : fields[fieldName]
            ) as Date;

            differences.push({
              label: fieldName,
              removed: format(parseISO(compareTo[fieldName]), "Pp"),
              replacedWith: format(date, "Pp"),
            });
            break;
          default:
            differences.push({
              label: fieldName,
              removed: compareTo[fieldName],
              replacedWith: fields[fieldName],
            });
        }
      }
    }

    return differences.filter(
      ({ removed, replacedWith }) => removed !== replacedWith
    );
  }, [fields, compareTo]);

  return differencesMemo;
}
