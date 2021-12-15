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
} from "./AlertDialog";
import { Button } from "./Button";
import { Flex } from "./Flex";

export function CloseWithUnsavedChangesDialog({
  open,
  onOpenChange,
  onAction,
}) {
  const { t } = useTranslation();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogPortal>
        <AlertDialogContent>
          <AlertDialogTitle>
            {t("global.closeWithChangesDialog.title")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("global.closeWithChangesDialog.description")}
          </AlertDialogDescription>
          <Flex
            gap="3"
            justify={{ "@initial": "center", "@bp1": "between" }}
            direction={{ "@initial": "columnReverse", "@bp1": "row" }}
          >
            <AlertDialogCancel asChild>
              <Button variant="secondary">
                {t("global.closeWithChangesDialog.cancel")}
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction onClick={onAction} asChild>
              <Button danger>
                {t("global.closeWithChangesDialog.action")}
              </Button>
            </AlertDialogAction>
          </Flex>
        </AlertDialogContent>
      </AlertDialogPortal>
    </AlertDialog>
  );
}
