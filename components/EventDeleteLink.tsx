import { useCallback } from "react";
import { useTranslation } from "../lib/TranslationContextProvider";

import { EventDeletAlertDialog } from "./EventDeleteAlertDialog";
import { fromEvents } from "../utils/supabaseClient";
import toast from "react-hot-toast";
import { Button } from "./Button";

interface EventDeleteOwnProps {
  id: string;
  onDeleted: () => void;
}

export function EventDeleteLink({ id, onDeleted }: EventDeleteOwnProps) {
  const { t } = useTranslation();

  const deleteEvent = useCallback(async () => {
    const { error, data } = await fromEvents()
      .delete({})
      .match({ id })
      .single();

    if (error) {
      toast.error(t("global.permissionDenied"));
    } else {
      onDeleted();
      toast.success(t("event.delete.success"));
    }
  }, [id, onDeleted, t]);

  return (
    <EventDeletAlertDialog onAction={deleteEvent}>
      <Button data-test-id="event-delete-link" variant="secondary" danger>
        {t("event.delete")}
      </Button>
    </EventDeletAlertDialog>
  );
}
