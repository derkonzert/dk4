import { Cross1Icon } from "@radix-ui/react-icons";
import React from "react";
import { useTranslation } from "../lib/TranslationContextProvider";
import { useLocations } from "../lib/useLocations";
import { Button } from "./Button";
import { Flex } from "./Flex";
import { FormFieldError } from "./FormFieldError";
import { Input, InputWithAppendix, Textarea } from "./Input";
import { Label } from "./Label";

export function TitleField({ register, errors }) {
  const { t } = useTranslation();

  return (
    <Flex gap="1" direction="column" css={{ flex: "0 0 auto" }}>
      <Label htmlFor="title">{t("createEventForm.title.label")}</Label>
      <Input
        id="title"
        placeholder={t("createEventForm.title.placeholder")}
        {...register("title", { required: true })}
        type="text"
      />
      {errors.title?.type === "required" && (
        <FormFieldError role="alert">
          {t("createEventForm.title.required")}
        </FormFieldError>
      )}
    </Flex>
  );
}

export function FromDateField({ register, errors }) {
  const { t } = useTranslation();

  return (
    <Flex gap="1" direction="column">
      <Label htmlFor="fromDate">{t("createEventForm.fromDate.label")}</Label>
      <Input
        id="fromDate"
        css={{
          width: "min-content",
        }}
        {...register("fromDate", {
          required: true,
          valueAsDate: true,
          validate: (date) => {
            return date >= new Date();
          },
        })}
        type="datetime-local"
        step={"900"}
      />
      {errors.fromDate?.type === "required" && (
        <FormFieldError role="alert">
          {t("createEventForm.fromDate.required")}
        </FormFieldError>
      )}
      {errors.fromDate?.type === "validate" && (
        <FormFieldError role="alert">
          {t("createEventForm.fromDate.validate")}
        </FormFieldError>
      )}
    </Flex>
  );
}

export function ToDateField({
  register,
  errors,
  getFromDate,
  visible = true,
  required = false,
}) {
  const { t } = useTranslation();
  const registered = register("toDate", {
    valueAsDate: true,
    validate: {
      required: (date) => {
        if (required) {
          return date && !isNaN(date.getTime());
        } else {
          return true;
        }
      },
      inFuture: (date) => {
        return !date || isNaN(date.getTime()) ? true : date >= new Date();
      },
      afterFromDate: (date) => {
        if (!date || isNaN(date.getTime())) {
          return true;
        }

        const fromDate = getFromDate();

        if (fromDate && !isNaN(fromDate.getTime())) {
          return date > fromDate;
        } else {
          // No from Date is set, dont show an error for now
          return true;
        }
      },
    },
  });

  return visible ? (
    <Flex gap="1" direction="column">
      <Label htmlFor="toDate">{t("createEventForm.toDate.label")}</Label>
      <Input
        id="toDate"
        css={{
          width: "min-content",
        }}
        {...registered}
        type="datetime-local"
      />
      {errors.toDate?.type === "required" && (
        <FormFieldError role="alert">
          {t("createEventForm.toDate.required")}
        </FormFieldError>
      )}
      {errors.toDate?.type === "inFuture" && (
        <FormFieldError role="alert">
          {t("createEventForm.toDate.inFuture")}
        </FormFieldError>
      )}
      {errors.toDate?.type === "afterFromDate" && (
        <FormFieldError role="alert">
          {t("createEventForm.toDate.afterFromDate")}
        </FormFieldError>
      )}
    </Flex>
  ) : null;
}

export function LocationField({ register, errors }) {
  const { t } = useTranslation();
  const { locations } = useLocations();

  return (
    <Flex gap="1" direction="column">
      <Label htmlFor="location">{t("createEventForm.location.label")}</Label>
      <Input
        id="location"
        {...register("location", {
          required: true,
        })}
        type="search"
        list="locations"
      />
      <datalist id="locations">
        {!!locations?.length &&
          locations.map((location) => (
            <option key={location.id} value={location.name} />
          ))}
      </datalist>

      {errors.location?.type === "required" && (
        <FormFieldError role="alert">
          {t("createEventForm.location.required")}
        </FormFieldError>
      )}
    </Flex>
  );
}

export function UrlField({ register }) {
  const { t } = useTranslation();
  return (
    <Flex gap="1" direction="column">
      <Label htmlFor="url">{t("createEventForm.url.label")} (optional)</Label>
      <Input id="url" type="url" placeholder="https://" {...register("url")} />
    </Flex>
  );
}

export function TicketPriceField({ register }) {
  const { t } = useTranslation();

  return (
    <Flex gap="1" direction="column">
      <Label htmlFor="ticketPrice">
        {t("createEventForm.ticketPrice.label")} (optional)
      </Label>

      <InputWithAppendix
        id="ticketPrice"
        type="text"
        maxWidth={100}
        {...register("ticketPrice")}
      >
        €
      </InputWithAppendix>
    </Flex>
  );
}

export function DescriptionField({ register }) {
  const { t } = useTranslation();

  return (
    <Flex gap="1" direction="column">
      <Label htmlFor="description">
        {t("createEventForm.description.label")} (optional)
      </Label>
      <Textarea id="description" {...register("description")} />
    </Flex>
  );
}

export function ChildEventsFieldset({ register, remove, append, fields }) {
  const { t } = useTranslation();

  return (
    <Flex gap="2" direction="column">
      <Label htmlFor="childEvents">
        {t("createEventForm.childEvents.label")} (optional)
      </Label>
      <Flex direction="column" gap="2">
        {fields.map((field, index) => {
          return (
            <Flex key={field.id} gap="2" wrap="wrap">
              <Input
                size="small"
                key={`${field.id}-title`}
                {...register(`childEvents.${index}.title` as const, {
                  required: true,
                })}
                defaultValue={field.title}
              />
              <Input
                size="small"
                key={`${field.id}-fromDate`}
                {...register(`childEvents.${index}.fromDate` as const, {
                  required: true,
                  valueAsDate: true,
                })}
                type="datetime-local"
                // @ts-ignore
                defaultValue={field.fromDate}
              />
              <Button
                onClick={() => remove(index)}
                size="small"
                variant="secondary"
                danger
              >
                <Cross1Icon />
              </Button>
            </Flex>
          );
        })}
        <Button
          css={{
            flex: "0 0 auto",
            alignSelf: "flex-start",
          }}
          type="button"
          variant="ghost"
          onClick={append}
        >
          {t("createEventForm.childEvents.add")}
        </Button>
      </Flex>
    </Flex>
  );
}
