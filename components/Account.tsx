import { nanoid } from "nanoid";
import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Nullable } from "typescript-nullable";
import { useTranslation } from "../lib/TranslationContextProvider";
import { useUser } from "../lib/UserContextProvider";
import { definitions } from "../types/supabase";
import { supabase } from "../utils/supabaseClient";
import AvatarUpload from "./AvatarUpload";
import { Box } from "./Box";
import { Button } from "./Button";
import { CheckboxHookForm } from "./CheckboxHookForm";
import { Flex } from "./Flex";
import { FormFieldError } from "./FormFieldError";
import { Input, Textarea } from "./Input";
import { Label } from "./Label";
import { Loader } from "./Loader";
import { Separator } from "./Separator";
import { TypoHeading, TypoText } from "./Typo";

interface AccountFormData {
  id: string;
  username?: string;
  avatar_url?: string;
  weekly_updates?: boolean;
  immediate_updates?: boolean;
  calendarToken: Nullable<string>;
}

export default function Account({ session }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [defaultValues, setDefaultValues] = useState<Partial<AccountFormData>>(
    {}
  );
  const { user } = useUser();

  const {
    register,
    setValue,
    reset,
    formState: { errors },
    handleSubmit,
    watch,
    control,
  } = useForm<AccountFormData>({
    defaultValues,
  });

  const getProfile = useCallback(
    async function getProfile() {
      try {
        setLoading(true);

        let { data, error, status } = await supabase
          .from<
            Pick<
              definitions["profiles"],
              | "id"
              | "username"
              | "avatar_url"
              | "immediate_updates"
              | "weekly_updates"
              | "calendarToken"
            >
          >("profiles")
          .select(
            `id, username, avatar_url, immediate_updates, weekly_updates, calendarToken`
          )
          .eq("id", user?.id)
          .single();

        if (error && status !== 406) {
          throw error;
        }

        if (data) {
          setDefaultValues(data);
          reset(data);
        }
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    },
    [reset, user?.id]
  );

  useEffect(() => {
    getProfile();
  }, [getProfile, session]);

  const updateProfile = useMemo(
    () =>
      async function updateProfile(accountData: Partial<AccountFormData>) {
        try {
          setLoading(true);
          const user = supabase.auth.user();

          const updates = {
            ...accountData,
            id: user?.id,
            updated_at: new Date(),
          };

          let { error } = await supabase
            .from<AccountFormData>("profiles")
            .update(updates, {
              returning: "minimal", // Don't return the value after inserting
            })
            .eq("id", user?.id);

          if (error) {
            throw error;
          }

          toast.success(t("profileForm.toast.success"), {
            id: "profile-form-success",
          });
        } catch (error) {
          alert(error.message);
        } finally {
          setLoading(false);
        }
      },
    [t]
  );

  const handleNewCalendarToken = useCallback(() => {
    const newId = nanoid(38);
    setValue("calendarToken", newId);
  }, [setValue]);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (
        name === "immediate_updates" ||
        name === "weekly_updates" ||
        name === "calendarToken" ||
        name === "avatar_url"
      ) {
        updateProfile({ [name]: value[name] ?? null });
      }
    });
    return () => subscription.unsubscribe();
  }, [updateProfile, watch]);

  register("calendarToken");
  register("avatar_url");

  const calendarToken = watch("calendarToken");

  return (
    <>
      <Flex direction="column" gap="3">
        <TypoHeading size="h4">Avatar</TypoHeading>

        <AvatarUpload
          url={defaultValues.avatar_url ?? ""}
          size={75}
          onUpload={(url) => {
            setDefaultValues((s) => ({ ...s, avatar_url: url }));
            setValue("avatar_url", url);
          }}
        />

        <Separator />

        <form onSubmit={handleSubmit(updateProfile)}>
          <Flex direction="column" gap="3">
            <Flex direction="column" gap="3">
              <Flex justify="between">
                <TypoHeading size="h4">
                  {t("profileForm.section.profile")}
                </TypoHeading>
                {loading && <Loader size="small" />}
              </Flex>

              <Flex gap="1" direction="column" css={{ flex: "0 0 auto" }}>
                <Label htmlFor="email">{t("profileForm.email.label")}</Label>
                <Input
                  id="email"
                  value={session.user.email}
                  disabled
                  type="email"
                />
                {/* {errors.title?.type === "required" && (
            <FormFieldError role="alert">
              {t("createEventForm.title.required")}
            </FormFieldError>
          )} */}
              </Flex>

              <Flex gap="1" direction="column" css={{ flex: "0 0 auto" }}>
                <Label htmlFor="username">
                  {t("profileForm.username.label")}
                </Label>
                <Input
                  id="username"
                  type="text"
                  {...register("username", {
                    required: true,
                    minLength: 3,
                  })}
                />
                {errors.username?.type === "required" && (
                  <FormFieldError role="alert">
                    {t("profileForm.username.required")}
                  </FormFieldError>
                )}
                {errors.username?.type === "minLength" && (
                  <FormFieldError role="alert">
                    {t("profileForm.username.minLength")}
                  </FormFieldError>
                )}
              </Flex>
              {/* 
        <div>
          <label htmlFor="website">Website</label>
          <input
            id="website"
            type="website"
            value={website || ""}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div> */}
              <Flex gap="1" direction="row" css={{ flex: "0 0 auto" }}>
                <Button disabled={loading}>
                  {t("auth.action.updateProfile")}
                </Button>
              </Flex>
              <Separator />

              <TypoHeading size="h4">
                {t("profileForm.section.security")}
              </TypoHeading>
              <Box>
                <Link href="/account/update-password" passHref>
                  <Button as="a" variant="secondary">
                    {t("profileForm.updatePassword")}
                  </Button>
                </Link>
              </Box>
            </Flex>
            <Separator />
            <TypoHeading size="h4">
              {t("profileForm.section.notifications")}
            </TypoHeading>
            <Flex direction="column" gap="3">
              <Flex
                gap="2"
                justify="start"
                align="center"
                css={{ marginTop: 26 }}
              >
                <CheckboxHookForm
                  name="weekly_updates"
                  control={control}
                  setValue={setValue}
                />
                <Label htmlFor="weekly_updates" checkbox>
                  <strong>{t("profileForm.weeklyUpdates.label")}</strong>
                  <br />
                  <TypoText color="muted">
                    {t("profileForm.weeklyUpdates.description")}
                  </TypoText>
                </Label>
              </Flex>
              <Flex
                gap="2"
                justify="start"
                align="center"
                css={{ marginTop: 26 }}
              >
                <CheckboxHookForm
                  name="immediate_updates"
                  control={control}
                  setValue={setValue}
                />
                <Label htmlFor="immediate_updates" checkbox>
                  <strong>{t("profileForm.immediateUpdates.label")}</strong>
                  <br />
                  <TypoText color="muted">
                    {t("profileForm.immediateUpdates.description")}
                  </TypoText>
                </Label>
              </Flex>
            </Flex>
            <Separator />
            <TypoHeading size="h4">
              {t("profileForm.section.calendar")}
            </TypoHeading>
            <Flex gap="3" direction="column" css={{ flex: "0 0 auto" }}>
              <TypoText color="muted">
                {t("profileForm.calendarToken.description")}
              </TypoText>

              {!!calendarToken ? (
                <>
                  <Flex gap="1" direction="row" css={{ flex: "0 0 auto" }}>
                    <Button
                      variant="primary"
                      as="a"
                      href={`webcal://derkonzert.de/api/webcal/${calendarToken}.ics`}
                    >
                      {t("profileForm.calendarToken.link")}
                    </Button>
                  </Flex>

                  <TypoText color="muted">
                    {t("profileForm.calendarToken.copy")}
                  </TypoText>
                  <Textarea
                    id="calendarToken"
                    disabled
                    readOnly
                    value={`webcal://derkonzert.de/api/webcal/${calendarToken}.ics`}
                  />
                  <Flex gap="2" direction="row" css={{ flex: "0 0 auto" }}>
                    <Button
                      type="button"
                      variant="secondary"
                      size="small"
                      danger
                      onClick={handleNewCalendarToken}
                    >
                      {t("profileForm.calendarToken.reset")}
                    </Button>
                    <Button
                      type="button"
                      variant="primary"
                      size="small"
                      danger
                      onClick={() => {
                        setValue("calendarToken", null);
                      }}
                    >
                      {t("profileForm.calendarToken.disable")}
                    </Button>
                  </Flex>
                  <TypoText color="muted">
                    {t("profileForm.calendarToken.reset.info")}
                  </TypoText>
                </>
              ) : (
                <Flex gap="1" direction="row" css={{ flex: "0 0 auto" }}>
                  <Button variant="primary" onClick={handleNewCalendarToken}>
                    {t("profileForm.calendarToken.enable")}
                  </Button>
                </Flex>
              )}
            </Flex>
          </Flex>
        </form>
      </Flex>
    </>
  );
}
