import { useEffect } from "react";

export const eventName = "new-event-created";

export function dispatchEventCreatedEvent() {
    window.document.body.dispatchEvent(new CustomEvent(eventName));
}

export function useEventCreatedListener(handler) {
  useEffect(() => {
    window.document.body.addEventListener(eventName, handler);

    return () => {
      window.document.body.removeEventListener(eventName, handler);
    };
  }, [handler]);
}
