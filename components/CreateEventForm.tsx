import { CheckIcon, Cross1Icon } from "@radix-ui/react-icons";
import { add, addHours, format, startOfToday } from "date-fns";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { Nullable } from "typescript-nullable";
import { useTranslation } from "../lib/TranslationContextProvider";
import { useLocations } from "../lib/useLocations";
import { useUser } from "../lib/UserContextProvider";
import { styled } from "../stitches.config";
import { fromEvents } from "../utils/supabaseClient";
import { Button } from "./Button";
import { Checkbox, CheckboxIndicator } from "./CheckBox";
import {
  CollapsibleContent,
  CollapsibleRoot,
  CollapsibleTrigger,
} from "./Collapsible";
import {
  ChildEventsFieldset,
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
import { Label } from "./Label";
import { TypoHeading, TypoText } from "./Typo";

const FormBox = styled("div", {
  color: "$slate12",
});

const Form = styled("form", {
  marginBlock: "$2",
  variants: {
    disabled: {
      true: { opacity: 0.8, pointerEvents: "none" },
    },
  },
});

const Overlapping = styled("div", {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  gap: "$3",
  padding: "$5",
  background: "$bg1",
  color: "$slate12",
  borderRadius: "$3",
});

type FormValues = {
  title?: string;
  fromDate?: Date;
  toDate?: Date;
  url?: string;
  description?: string;
  location?: string;
  global?: string;

  childEvents: { title: string; fromDate: Date }[];
};

export interface CreateEventFormOwnProps {
  onEventCreated: () => void;
  onDirtyForm?: (isTouched: boolean) => void;
  onRequestClose?: () => void;
  defaultValues?: Partial<FormValues>;
}

export function CreateEventForm({
  onEventCreated,
  onDirtyForm,
  onRequestClose,
  defaultValues = {},
}: CreateEventFormOwnProps) {
  const { locationByName, addNewLocation } = useLocations();
  const { user } = useUser();
  const [lastsMultipleDays, setLastsMultipleDays] = useState(false);
  const { t } = useTranslation();
  const {
    register,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful, dirtyFields },
    setError,
    getValues,
    setValue,
    watch,
    handleSubmit,
    clearErrors,
    control,
  } = useForm<FormValues>({
    defaultValues: {
      title: "",
      url: "",
      description: "",
      location: "",
      childEvents: [],
      ...defaultValues,
      // @ts-ignore
      fromDate:
        defaultValues.fromDate && !isNaN(defaultValues.fromDate.getTime())
          ? format(defaultValues.fromDate, "yyyy-MM-dd'T'HH:mm")
          : format(
              add(startOfToday(), { days: 1, hours: 20 }),
              "yyyy-MM-dd'T'HH:mm"
            ),
      // @ts-ignore
      toDate:
        defaultValues.toDate && !isNaN(defaultValues.toDate.getTime())
          ? format(defaultValues.toDate, "yyyy-MM-dd'T'HH:mm")
          : format(
              add(startOfToday(), { days: 1, hours: 22 }),
              "yyyy-MM-dd'T'HH:mm"
            ),
    },
  });

  const {
    fields: childEventFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "childEvents",
  });

  const appendChildEvent = useCallback(() => {
    const fromDateValue = getValues().fromDate;
    const fromDateString =
      fromDateValue && !isNaN(fromDateValue.getTime())
        ? format(fromDateValue, "yyyy-MM-dd") + "T20:00"
        : "";

    append({
      id: Date.now().toString(),
      title: "",
      // @ts-ignore
      fromDate: fromDateString,
    });
  }, [append, getValues]);

  // Cant use isDirty as it somehow gets confused with Date objects
  const dirtyFieldsEntries = Object.entries(dirtyFields);
  const hasDirtyFields = useMemo(() => {
    for (let [, isDirtyFields] of dirtyFieldsEntries) {
      if (isDirtyFields) {
        return true;
      }
    }
    return false;
  }, [dirtyFieldsEntries]);

  useEffect(() => {
    onDirtyForm?.(isSubmitSuccessful ? false : hasDirtyFields);
  }, [onDirtyForm, hasDirtyFields, isSubmitSuccessful]);

  useEffect(() => {
    const subscription = watch((data, { name }) => {
      if (name === "fromDate") {
        if (data.fromDate && !lastsMultipleDays) {
          setValue(
            "toDate",
            // @ts-ignore
            format(addHours(data.fromDate, 3), "yyyy-MM-dd'T'HH:mm")
          );
        }
      }
    });

    return subscription.unsubscribe;
  }, [lastsMultipleDays, setValue, watch]);

  const onSubmit = async (formData) => {
    let existingLocation = locationByName(formData.location);

    if (Nullable.isNone(existingLocation)) {
      const { data: newLocation, error } = await addNewLocation(
        formData.location
      );

      existingLocation = newLocation;

      if (error) {
        setError("global", { message: "Could not find or create location" });
        throw error;
      }
    }

    if (Nullable.isNone(existingLocation)) {
      setError("global", { message: "Could not find or create location" });
    } else {
      const { childEvents, ...submitData } = formData;

      const { data: newEvent, error } = await fromEvents()
        .insert({
          ...submitData,
          location: existingLocation.id,
          author: user?.id ?? null,
        })
        .single();

      if (error) {
        setError("global", { message: error.message });
        throw error;
      }

      if (childEvents.length) {
        const { error } = await fromEvents().insert(
          childEvents.map((childEvent) => ({
            title: childEvent.title,
            fromDate: childEvent.fromDate,
            location: Nullable.maybe("", ({ id }) => id, existingLocation),
            author: user?.id ?? null,
            parent_event: newEvent?.id,
          })),
          {
            returning: "minimal",
          }
        );

        if (error) {
          setError("global", { message: error.message });
          throw error;
        }
      }

      onEventCreated();
    }
  };

  const title = watch("title");

  return (
    <FormBox data-test-id="create-event-form">
      <Form
        onSubmit={handleSubmit(onSubmit)}
        disabled={isSubmitting || isSubmitSuccessful}
      >
        <Flex gap="5" direction="column">
          <TypoHeading size="h2">{t("createEventForm.title")}</TypoHeading>
          {errors.global && (
            <FormFieldError role="alert">
              {errors.global?.message || "Something went wrong."}{" "}
              <Button
                size="small"
                danger
                variant="ghost"
                onClick={() => clearErrors()}
              >
                <Cross1Icon />
              </Button>
            </FormFieldError>
          )}
          <Flex gap="3" direction="column">
            <TitleField register={register} errors={errors} />
            <Flex
              gap={{ "@initial": "1", "@bp1": "4" }}
              align="start"
              direction={{ "@initial": "column", "@bp1": "row" }}
            >
              <FromDateField register={register} errors={errors} />
              <Flex
                gap="2"
                justify="start"
                align="center"
                css={{ marginTop: 26 }}
              >
                <Checkbox
                  id="lastsMultipleDays"
                  checked={lastsMultipleDays}
                  onCheckedChange={(checked) => {
                    setLastsMultipleDays(!!checked);
                  }}
                >
                  <CheckboxIndicator>
                    <CheckIcon />
                  </CheckboxIndicator>
                </Checkbox>
                <Label htmlFor="lastsMultipleDays" checkbox>
                  {t("createEventForm.multipleDays.label")}
                </Label>
              </Flex>
            </Flex>

            <ToDateField
              visible={lastsMultipleDays}
              required={lastsMultipleDays}
              register={register}
              errors={errors}
              getFromDate={() => getValues().fromDate}
            />

            <LocationField register={register} errors={errors} />
          </Flex>

          <CollapsibleRoot>
            <CollapsibleTrigger type="button">
              {t("createEventForm.moreDetails.label")} (optional)
            </CollapsibleTrigger>
            <CollapsibleContent>
              <Flex gap="3" css={{ marginTop: "$5" }} direction="column">
                <UrlField register={register} />
                <TicketPriceField register={register} />
                <DescriptionField
                  register={register}
                  initialSearch={title}
                  setDescription={(description) =>
                    setValue("description", description, {
                      shouldTouch: true,
                      shouldDirty: true,
                    })
                  }
                />
              </Flex>
            </CollapsibleContent>
          </CollapsibleRoot>
          <CollapsibleRoot>
            <CollapsibleTrigger type="button">
              {t("createEventForm.lineUp.label")} (optional)
            </CollapsibleTrigger>
            <CollapsibleContent>
              <Flex gap="3" css={{ marginTop: "$5" }} direction="column">
                <ChildEventsFieldset
                  register={register}
                  remove={remove}
                  append={appendChildEvent}
                  fields={childEventFields}
                />
              </Flex>
            </CollapsibleContent>
          </CollapsibleRoot>
          <Flex gap="1" direction="column">
            <Button
              type="submit"
              size="large"
              css={{ flex: "0 0 auto", alignSelf: "flex-start" }}
              data-splitbee-event="Submit Create Event Form"
              data-test-id="create-event-submit"
            >
              {t("createEventForm.submit")}
            </Button>
          </Flex>
        </Flex>
      </Form>

      {isSubmitting && (
        <Overlapping>
          <TypoHeading size="h2">
            {t("createEventForm.loading.title")}
          </TypoHeading>
          <TypoText>{t("createEventForm.loading.text")}</TypoText>
        </Overlapping>
      )}
      {isSubmitSuccessful && (
        <Overlapping>
          <TypoHeading size="h2" data-test-id="create-event-success">
            {t("createEventForm.success.title")}
          </TypoHeading>
          <TypoText>{t("createEventForm.success.text")}</TypoText>
          <Flex gap="4" direction="column" css={{ marginTop: "$4" }}>
            {!!onRequestClose && (
              <Button
                variant="primary"
                type="button"
                onClick={() => onRequestClose?.()}
              >
                {t("createEventForm.close")}
              </Button>
            )}
            <Button variant="secondary" type="button" onClick={() => reset()}>
              {t("createEventForm.submitAnother")}
            </Button>
          </Flex>
        </Overlapping>
      )}
    </FormBox>
  );
}
