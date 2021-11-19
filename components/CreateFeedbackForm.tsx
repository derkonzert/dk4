import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "../lib/TranslationContextProvider";
import { styled } from "../stitches.config";
import { fromFeedback } from "../utils/supabaseClient";
import { Button } from "./Button";
import { Flex } from "./Flex";
import { FormFieldError } from "./FormFieldError";
import { Textarea } from "./Input";
import { Label } from "./Label";
import { ToggleGroup, ToggleGroupItem } from "./ToggleGroup";
import { TypoHeading, TypoText } from "./Typo";

const FormBox = styled("div", {
  color: "$slate12",
});

const Form = styled("form", {
  marginBlock: "$1",
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
  padding: "$4",
  background: "$slate1",
  color: "$slate12",
  borderRadius: "$3",
});

const MoodToggleGroupItem = styled(ToggleGroupItem, {
  fontSize: "$5",
});

export interface CreateFeedbackFormOwnProps {
  onFeedbackCreated?: () => void;
  onDirtyForm?: (isDirty: boolean) => void;
}

export function CreateFeedbackForm({
  onFeedbackCreated,
  onDirtyForm,
}: CreateFeedbackFormOwnProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const {
    register,
    formState: { errors, isSubmitting, isSubmitSuccessful, isDirty },
    setError,
    clearErrors,
    watch,
    setValue,
    handleSubmit,
  } = useForm();

  useEffect(() => {
    onDirtyForm?.(isDirty);
  }, [onDirtyForm, isDirty]);

  const onSubmit = async (formData) => {
    const { error } = await fromFeedback().insert(
      {
        ...formData,
      },
      {
        returning: "minimal",
      }
    );

    if (!error) {
      onFeedbackCreated?.();
    } else {
      setError("global", { message: error.message });
      throw error;
    }
  };

  const required = watch(["mood", "content"]).every((val) => !val);

  register("mood", { required });

  return (
    <FormBox data-test-id="create-feedback-form">
      <Form
        onSubmit={handleSubmit(onSubmit)}
        disabled={isSubmitting || isSubmitSuccessful}
      >
        <Flex gap="3" direction="column">
          <TypoHeading size="h6">{t("createFeedbackForm.title")}</TypoHeading>
          {errors.global && (
            <FormFieldError role="alert">
              {errors.global?.message || "Something went wrong."}
            </FormFieldError>
          )}
          <Flex gap="2" direction="column">
            <Flex gap="1" direction="column">
              <Label htmlFor="content">
                {t("createFeedbackForm.content.label")}
              </Label>
              <Textarea id="content" {...register("content", { required })} />
              {errors.content?.type === "required" && (
                <FormFieldError role="alert">
                  {t("createFeedbackForm.content.required")}
                </FormFieldError>
              )}
            </Flex>
          </Flex>

          <Flex gap="2" direction="column">
            <Label htmlFor="mood">{t("createFeedbackForm.mood.label")}</Label>
            <ToggleGroup
              id="mood"
              type="single"
              onValueChange={(value) => {
                clearErrors();
                setValue("mood", value, { shouldDirty: true });
              }}
              aria-label="Mood"
            >
              <MoodToggleGroupItem value="😭" aria-label="Crying">
                😭
              </MoodToggleGroupItem>
              <MoodToggleGroupItem value="😕" aria-label="Moody">
                😕
              </MoodToggleGroupItem>
              <MoodToggleGroupItem value="😊" aria-label="Happy">
                😊
              </MoodToggleGroupItem>
              <MoodToggleGroupItem value="🤩" aria-label="Super happy">
                🤩
              </MoodToggleGroupItem>
            </ToggleGroup>
          </Flex>

          <input
            id="page"
            disabled
            value={router.pathname}
            {...register("page")}
            type="hidden"
          />

          <Flex gap="1" direction="column">
            <Button
              type="submit"
              variant="primary"
              size="medium"
              css={{ flex: "0 0 auto", alignSelf: "flex-end" }}
              data-splitbee-event="Submit Feedback Form"
              data-test-id="create-feedback-submit"
            >
              {t("createFeedbackForm.submit")}
            </Button>
          </Flex>
        </Flex>
      </Form>
      {isSubmitting && (
        <Overlapping>
          <TypoHeading size="h2">
            {t("createFeedbackForm.loading.title")}
          </TypoHeading>
          <TypoText>{t("createFeedbackForm.loading.text")}</TypoText>
        </Overlapping>
      )}
      {isSubmitSuccessful && (
        <Overlapping>
          <TypoHeading size="h2" data-test-id="create-feedback-success">
            {t("createFeedbackForm.success.title")}
          </TypoHeading>
          <TypoText>{t("createFeedbackForm.success.text")}</TypoText>
        </Overlapping>
      )}
    </FormBox>
  );
}
