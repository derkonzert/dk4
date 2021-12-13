import { ArrowUpIcon, Cross1Icon } from "@radix-ui/react-icons";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Nullable } from "typescript-nullable";
import { useTranslation } from "../lib/TranslationContextProvider";
import { fetchedEvent } from "../lib/useEvents";
import { fromEvents } from "../utils/supabaseClient";
import {
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from "./Dialog";
import { eventDetailData, EventDetailData } from "./EventDetailData";
import { HyperLink } from "./HyperLink";
import { LinkToEventDialog, makeEventPathProps } from "./LinkToEvent";
import { TypoHeading } from "./Typo";

type parentEvent = Pick<fetchedEvent, "id" | "title">;

type eventWithChildEvents = eventDetailData & {
  childEvents: eventDetailData[];
};

export const EventDialog = ({ id, onDeleted, onError }) => {
  const router = useRouter();
  const { t } = useTranslation();
  const currentFilter = router.query.currentFilter || "";
  const [event, setEvent] = useState<Nullable<eventWithChildEvents>>(null);
  const [parentEvent, setParentEvent] = useState<Nullable<parentEvent>>(null);

  const fetchEvent = useCallback(async () => {
    const { data: event, error } = await fromEvents<eventWithChildEvents>()
      .select("*, childEvents:events!parent_event(id,title,fromDate,toDate)")
      .match({ id })
      .single();

    if (error || !event) {
      console.error(error);
      toast.error(t("toast.eventLoadingError"));

      await router.push(`/${currentFilter}`, `/${currentFilter}`, {
        shallow: true,
      });

      return onError(error || new Error("Could not load event"));
    } else {
      setEvent(event);
    }

    if (event.parent_event) {
      const { data: parentEvent } = await fromEvents<parentEvent>()
        .select("id,title")
        .match({ id: event.parent_event })
        .single();

      if (parentEvent) {
        setParentEvent(parentEvent);
      } else {
        setParentEvent(null);
      }
    }
  }, [currentFilter, id, onError, router, t]);

  useEffect(() => {
    if (id) {
      fetchEvent();
    } else {
      setEvent(null);
    }
  }, [fetchEvent, id]);

  useEffect(() => {
    if (event && !event.parent_event && parentEvent) {
      setParentEvent(null);
    }
  }, [event, parentEvent]);

  return (
    <DialogRoot
      open={!!id}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          if (parentEvent) {
            const pathProps = makeEventPathProps(parentEvent.id, currentFilter);
            router.replace(pathProps.href, pathProps.as, { shallow: true });
          } else {
            router.push(`/${currentFilter}`, `/${currentFilter}`, {
              shallow: true,
            });
          }
        }
      }}
    >
      <DialogPortal>
        <DialogOverlay />
        {event && (
          <DialogContent data-test-id="event-dialog">
            {event.parent_event && ( // TODO: Fix this
              <LinkToEventDialog id={event.parent_event}>
                <HyperLink css={{ textDecoration: "none" }}>
                  <ArrowUpIcon /> {parentEvent ? parentEvent.title : ""}
                </HyperLink>
              </LinkToEventDialog>
            )}
            <DialogTitle
              size="h1"
              as={TypoHeading}
              data-test-id="event-dialog-title"
            >
              {event.title}
            </DialogTitle>
            {Nullable.isSome(event) && (
              <EventDetailData
                event={event}
                childEvents={event.childEvents}
                onDeleted={() => {
                  onDeleted();
                  router.back();
                }}
                onVerified={() => {
                  fetchEvent();
                }}
              />
            )}

            <DialogClose>
              <Cross1Icon />
            </DialogClose>
          </DialogContent>
        )}
      </DialogPortal>
    </DialogRoot>
  );
};
