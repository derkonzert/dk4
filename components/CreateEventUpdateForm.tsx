import { Label } from "@radix-ui/react-label";
import { format, parseISO } from "date-fns";
import { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Nullable } from "typescript-nullable";
import { useTranslation } from "../lib/TranslationContextProvider";
import { Diff } from "../lib/useDifferences";
import { useLocations } from "../lib/useLocations";
import { eventWithLocation } from "../types/supabaseManualEnhanced";
import { fromEventUpdates } from "../utils/supabaseClient";
import { Button } from "./Button";
import { DiffViewer } from "./DiffViewer";
import {
  DescriptionField,
  FromDateField,
  LocationField,
  TicketPriceField,
  TitleField,
  ToDateField,
  UrlField,
} from "./EventFormFields";
import { Flex } from "./Flex";
import { FormFieldError } from "./FormFieldError";
import { Textarea } from "./Input";
import { TypoHeading, TypoText } from "./Typo";

interface CreateEventUpdateFormOwnProps {
  event: eventWithLocation;
  onChangesSubmitted: () => void;
}

export function CreateEventUpdateForm({
  event,
  onChangesSubmitted,
}: CreateEventUpdateFormOwnProps): JSX.Element {
  const { t, formatDateLocalized } = useTranslation();
  const { locationByName } = useLocations();

  const {
    register,
    formState: { errors, dirtyFields },
    getValues,
    watch,
    handleSubmit,
  } = useForm({
    defaultValues: {
      summary: "",
      title: event.title,
      fromDate: event.fromDate
        ? format(parseISO(event.fromDate), "yyyy-MM-dd'T'HH:mm")
        : undefined,
      toDate: event.toDate
        ? format(parseISO(event.toDate), "yyyy-MM-dd'T'HH:mm")
        : undefined,
      location: event.location?.name,
      url: event.url,
      ticketPrice: event.ticketPrice,
      description: event.description,
    },
  });

  const allValues = watch();

  const dirtyFieldsEntries = Object.entries(dirtyFields);
  const differencesMemo = useMemo(() => {
    const differences: Diff[] = [];

    for (const [fieldName, isDirty] of dirtyFieldsEntries) {
      if (fieldName === "summary") {
        continue;
      }
      if (isDirty) {
        switch (fieldName) {
          case "location":
            differences.push({
              label: fieldName,
              removed: event.location?.name,
              replacedWith: allValues[fieldName]?.toString(),
            });
            break;
          case "fromDate":
          case "toDate":
            // @ts-ignore
            const date = allValues[fieldName] as Date;

            differences.push({
              label: fieldName,
              removed: Nullable.maybe(
                "",
                (dateString) => formatDateLocalized(parseISO(dateString), "Pp"),
                event[fieldName]
              ),
              replacedWith: formatDateLocalized(date, "Pp"),
            });
            break;
          default:
            differences.push({
              label: fieldName,
              removed: event[fieldName],
              replacedWith: allValues[fieldName],
            });
        }
      }
    }
    return differences;
  }, [dirtyFieldsEntries, event, allValues, formatDateLocalized]);

  const [differences] = [differencesMemo];

  const onSubmit = useCallback(
    async ({ summary, ...formData }) => {
      const changes: any = Object.entries(formData).reduce(
        (changes, [field, value]) => {
          if (event[field] !== value) {
            switch (field) {
              case "location":
                const existingLocation = locationByName(value as string);

                if (existingLocation) {
                  changes[field] = existingLocation.id;
                }

                break;
              default:
                changes[field] = value;
                break;
            }
          }
          return changes;
        },
        {}
      );

      const { data, error } = await fromEventUpdates().insert({
        event_id: event.id,
        summary,
        changes,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      onChangesSubmitted();
    },
    [event, locationByName, onChangesSubmitted]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex gap="5" direction="column">
        <TypoHeading size="h2">{event.title}</TypoHeading>
        <TypoHeading size="h4">{t("updateEventForm.title")}</TypoHeading>
        <TypoText size="copy">{t("updateEventForm.description")}</TypoText>
        <Flex gap="3" direction="column">
          <TitleField register={register} errors={errors} />
          <Flex gap="4">
            <FromDateField register={register} errors={errors} />
            <ToDateField
              register={register}
              errors={errors}
              getFromDate={() => getValues().fromDate}
            />
          </Flex>
          <LocationField register={register} errors={errors} />
        </Flex>
        <Flex gap="3" direction="column">
          <UrlField register={register} />
          <TicketPriceField register={register} />
          <DescriptionField register={register} />

          {/* <ChildEventsFieldset
                  register={register}
                  remove={remove}
                  append={appendChildEvent}
                  fields={childEventFields}
                /> */}

          <Flex gap="1" direction="column">
            <Label htmlFor="summary">
              {t("updateEventForm.summary.label")}
            </Label>
            <Textarea
              id="summary"
              {...register("summary", { required: true })}
            />
            {errors.summary?.type === "required" && (
              <FormFieldError role="alert">
                {t("updateEventForm.summary.required")}
              </FormFieldError>
            )}
          </Flex>
        </Flex>
        <Button variant="primary">Submit</Button>
      </Flex>

      <DiffViewer differences={differences} />
    </form>
  );
}
