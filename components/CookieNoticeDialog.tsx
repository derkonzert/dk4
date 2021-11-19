import { CookieIcon } from "@radix-ui/react-icons";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import React from "react";
import { useTranslation } from "../lib/TranslationContextProvider";
import { styled } from "../stitches.config";
import { Button } from "./Button";

const CookieNoticeDialogContent = styled("div", {
  position: "sticky",
  bottom: "$4",
  width: "max-content",
  maxWidth: "calc(100% - 2 * $space$4)",
  backgroundColor: "$bg1",
  boxShadow: "$middle",
  border: "1px solid $slate7",
  paddingBlock: "$2",
  paddingInline: "$3",
  margin: "$4",
  borderRadius: "$3",
  gap: "$3",
  overflowY: "auto",
  display: "flex",
  alignItems: "center",
  boxSizing: "border-box",

  maxHeight: "calc(var(--vh, 1vh) * 85)",
});
const StyledCookieIcon = styled(CookieIcon, {
  flex: "0 0 auto",
});
export interface CookieNoticeDialogOwnProps {
  onAction: () => void;
}

export function CookieNoticeDialog({ onAction }: CookieNoticeDialogOwnProps) {
  const { t } = useTranslation();

  return (
    <CookieNoticeDialogContent>
      <VisuallyHidden.Root>{t("cookie.dialog.title")}</VisuallyHidden.Root>
      <StyledCookieIcon /> {t("cookie.dialog.description")}
      <Button onClick={onAction}>{t("cookie.dialog.action")}</Button>
    </CookieNoticeDialogContent>
  );
}
