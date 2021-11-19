import { useTranslation } from "../lib/TranslationContextProvider";
import { styled } from "../stitches.config";

export const SKIP_TO_CONTENT_ID = "start-of-content";

export const SkipToContentStyled = styled("a", {
  position: "absolute",
  width: 1,
  height: 1,
  margin: 0,
  overflow: "hidden",
  clip: "rect(1px, 1px, 1px, 1px)",
  background: "$indigo9",
  color: "$indigo1",
  padding: "$2",
  textDecoration: "none",

  "&:focus": {
    zIndex: "$skipNav",
    width: "auto",
    height: "auto",
    clip: "auto",
  },
});

export function SkipToContent() {
  const { t } = useTranslation();

  return (
    <SkipToContentStyled href={`#${SKIP_TO_CONTENT_ID}`}>
      {t("skipToContent.label")}
    </SkipToContentStyled>
  );
}
