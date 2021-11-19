import { useRouter } from "next/router";
import React from "react";
import toast from "react-hot-toast";
import { useTranslation } from "../lib/TranslationContextProvider";
import { Flex } from "./Flex";
import { ToggleGroup, ToggleGroupItem } from "./ToggleGroup";

export const LanguageSwitcher = () => {
  const router = useRouter();
  const { pathname, asPath, locale } = router;
  const { t } = useTranslation();

  return (
    <Flex align="center" gap="3">
      <ToggleGroup
        type="single"
        value={locale}
        onValueChange={(value) => {
          if (value && locale !== value) {
            router.replace(pathname, asPath, { locale: value, shallow: false });

            toast.success(t("toast.languageSwitched"));
          }
        }}
        aria-label="Language Switcher"
      >
        <ToggleGroupItem value="de" aria-label="Deutsch">
          Deutsch
        </ToggleGroupItem>
        <ToggleGroupItem value="en" aria-label="English">
          English
        </ToggleGroupItem>
      </ToggleGroup>
    </Flex>
  );
};
