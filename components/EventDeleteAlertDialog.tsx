import React from "react";
import { useTranslation } from "../lib/TranslationContextProvider";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./AlertDialog";
import { Button } from "./Button";
import { Flex } from "./Flex";

export function EventDeletAlertDialog({ children, onAction }) {
  const { t } = useTranslation();
  return (
    <AlertDialog>
      {/* TODO: check why children are not allowed */}
      {/* @ts-ignore */}
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogTitle>{t("event.delete.dialog.title")}</AlertDialogTitle>
        <AlertDialogDescription>
          {t("event.delete.dialog.description")}
        </AlertDialogDescription>
        <Flex css={{ justifyContent: "flex-end" }}>
          {/* TODO: check why children are not allowed */}
          {/* @ts-ignore */}
          <AlertDialogCancel asChild>
            <Button variant="secondary" css={{ marginRight: 25 }}>
              {t("global.cancel")}
            </Button>
          </AlertDialogCancel>
          {/* @ts-ignore */}
          <AlertDialogAction asChild onClick={onAction}>
            <Button danger>{t("event.delete.dialog.action")}</Button>
          </AlertDialogAction>
        </Flex>
      </AlertDialogContent>
    </AlertDialog>
  );
}
