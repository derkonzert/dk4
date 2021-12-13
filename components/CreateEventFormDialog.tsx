import { Cross1Icon } from "@radix-ui/react-icons";
import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import { dispatchEventCreatedEvent } from "../lib/useEventCreatedListener";
import { CloseWithUnsavedChangesDialog } from "./CloseWithUnsavedChangesDialog";
import { CreateEventFormOwnProps } from "./CreateEventForm";
import {
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTrigger,
} from "./Dialog";

const DynamicCreateEventForm = dynamic<CreateEventFormOwnProps>(() =>
  import("./CreateEventForm").then((mod) => mod.CreateEventForm)
);

export const CreateEventFormDialog = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [isFormDirty, setIsFormDirty] = useState(false);

  const handleEventCreated = useCallback(() => {
    dispatchEventCreatedEvent();
    setIsFormDirty(false);
  }, []);

  const handleOpenChange = useCallback(
    (shouldBeOpen) => {
      if (!shouldBeOpen && isFormDirty) {
        setShowAlert(true);
      } else {
        setOpen(shouldBeOpen);
      }
    },
    [isFormDirty]
  );

  const handleForceClose = useCallback(() => {
    setShowAlert(false);
    setOpen(false);
    setIsFormDirty(false);
  }, []);

  return (
    <>
      <DialogRoot open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger
          data-splitbee-event="Open Create Event Form"
          data-test-id="create-event-floating-button"
          asChild
        >
          {children}
        </DialogTrigger>
        <DialogPortal>
          <DialogOverlay />
          <DialogContent>
            <DynamicCreateEventForm
              onEventCreated={handleEventCreated}
              onDirtyForm={(isDirty) => {
                setIsFormDirty(isDirty);
              }}
              onRequestClose={handleForceClose}
            />
            <DialogClose
              data-splitbee-event="Close Create Event Form"
              data-test-id="create-event-close"
            >
              <Cross1Icon />
            </DialogClose>
          </DialogContent>
        </DialogPortal>
      </DialogRoot>
      <CloseWithUnsavedChangesDialog
        open={showAlert}
        onOpenChange={(args) => {
          setShowAlert(false);
        }}
        onAction={handleForceClose}
      />
    </>
  );
};
