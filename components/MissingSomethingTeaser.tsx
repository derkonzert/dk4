import { useTranslation } from "../lib/TranslationContextProvider";
import { styled } from "../stitches.config";
import { Button } from "./Button";
import { CreateEventFormDialog } from "./CreateEventFormDialog";
import { TypoHeading, TypoText } from "./Typo";

const Wrapper = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "$4",
  alignImtes: "flex-start",
  background: "$indigo1",
  boxShadow: "0 4px 15px $colors$indigo3",
  paddingInline: "$4",
  paddingBlock: "$5",
  maxWidth: 520,
  marginBlockStart: "$6",
  marginInline: "auto",
  borderRadius: 10,

  gridColumn: "1 / 4",

  "@bp1": {
    paddingInline: "$6",
    marginBlockEnd: "$8",
  },
});

export function MissingSomethingTeaser() {
  const { t } = useTranslation();

  return (
    <Wrapper>
      <TypoHeading size="h2">{t("missingSmthng.title")}</TypoHeading>
      <TypoText size="copy">{t("missingSmthng.description")}</TypoText>
      <CreateEventFormDialog>
        <Button css={{ flex: "0 0 auto" }} size="large" variant="primary">
          {t("missingSmthng.action")}
        </Button>
      </CreateEventFormDialog>
    </Wrapper>
  );
}
