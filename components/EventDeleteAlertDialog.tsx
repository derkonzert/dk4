import React from "react";
import { useTranslation } from "../lib/TranslationContextProvider";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./AlertDialog";
import { Button } from "./Button";
import { Flex } from "./Flex";

export function EventDeletAlertDialog({ children, onAction }) {
  const { t } = useTranslation();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>

      <AlertDialogPortal>
        <AlertDialogContent>
          <AlertDialogTitle>{t("event.delete.dialog.title")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("event.delete.dialog.description")}
          </AlertDialogDescription>
          <Flex css={{ justifyContent: "flex-end" }}>
            <AlertDialogCancel asChild>
              <Button variant="secondary" css={{ marginRight: 25 }}>
                {t("global.cancel")}
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild onClick={onAction}>
              <Button danger>{t("event.delete.dialog.action")}</Button>
            </AlertDialogAction>
          </Flex>
        </AlertDialogContent>
      </AlertDialogPortal>
    </AlertDialog>
  );
}
