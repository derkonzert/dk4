import { SidebarPage } from "../components/SidebarPage";
import { TypoHeading, TypoText } from "../components/Typo";
import { useTranslation } from "../lib/TranslationContextProvider";

// pages/404.js
export default function Custom404() {
  const { t } = useTranslation();

  return (
    <SidebarPage>
      <TypoHeading size="h1">{t("global.404.title")}</TypoHeading>
      <TypoText>{t("global.404.description")}</TypoText>
    </SidebarPage>
  );
}
