import { TrashIcon } from "@radix-ui/react-icons";
import { useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "../lib/TranslationContextProvider";
import { useDifferences } from "../lib/useDifferences";
import { useEventUpdates } from "../lib/useEventUpdates";
import { useUser } from "../lib/UserContextProvider";
import { styled } from "../stitches.config";
import { eventUpdateWithData } from "../types/supabaseManualEnhanced";
import { fromEvents, fromEventUpdates } from "../utils/supabaseClient";
import { Box } from "./Box";
import { Button } from "./Button";
import {
  CollapsibleContent,
  CollapsibleRoot,
  CollapsibleTrigger,
} from "./Collapsible";
import { DiffViewer } from "./DiffViewer";
import { Flex } from "./Flex";
import { Loader } from "./Loader";
import { TypoHeading } from "./Typo";

const List = styled("ol", {
  border: "1px solid $colors$slate7",
  padding: "0",
  margin: "$4 0",
  borderRadius: "$3",
  overflow: "hidden",
});

const Item = styled("li", {
  listStyle: "none",
});

const Trigger = styled(CollapsibleTrigger, {});
const Content = styled(CollapsibleContent, {});

const StyledTrashIcon = styled(TrashIcon, {});

const EventUpdateContent = ({ update, event, onApply, onDiscard }) => {
  const { hasRole } = useUser();
  const differences = useDifferences(update.changes, event);

  return (
    <>
      <Box css={{ padding: "$3", borderTop: "1px solid $colors$slate5" }}>
        <DiffViewer differences={differences} />
      </Box>
      {hasRole("admin") && (
        <Flex
          justify="between"
          direction="rowReverse"
          css={{ background: "$slate3", padding: "$1" }}
        >
          <Button size="small" variant="ghost" onClick={() => onApply(update)}>
            Apply
          </Button>
          <Button
            size="small"
            variant="secondary"
            danger
            onClick={() => onDiscard(update)}
          >
            <StyledTrashIcon css={{ marginRight: "$1" }} /> Discard
          </Button>
        </Flex>
      )}
    </>
  );
};

export function EventUpdates({ event }) {
  const { t } = useTranslation();
  const { eventUpdates, isValidating, mutate } = useEventUpdates(event.id, []);

  useEffect(() => {
    mutate();
  }, [mutate]);

  const handleApply = useCallback(
    async (update: eventUpdateWithData) => {
      if (update.changes && typeof update.changes !== "string") {
        const { error } = await fromEvents().upsert({
          id: event.id,
          // @ts-ignore
          ...update.changes,
        });
        if (!error) {
          await fromEventUpdates().delete().match({ id: update.id });
          mutate();

          toast.success("Updates applied");
        }
      }
    },
    [event.id, mutate]
  );
  const handleDiscard = useCallback(
    async (update: eventUpdateWithData) => {
      const { error } = await fromEventUpdates()
        .delete()
        .match({ id: update.id });
      mutate();

      if (!error) {
        toast.success("Update discarded");
      }
    },
    [mutate]
  );

  if (!eventUpdates || !eventUpdates.length) {
    return null;
  }

  return (
    <>
      <Flex css={{ paddingBlock: "$2" }} justify="between" align="center">
        <TypoHeading>{t("eventUpdates.pending.title")}</TypoHeading>
        {isValidating && (
          <Loader background="$slate1" color="$indigo11" size="small" />
        )}
      </Flex>
      <List>
        {eventUpdates.map((update) => (
          <CollapsibleRoot key={update.id} asChild>
            <Item>
              <Trigger>{update.summary}</Trigger>
              <Content>
                <EventUpdateContent
                  update={update}
                  event={event}
                  onApply={handleApply}
                  onDiscard={handleDiscard}
                />
              </Content>
            </Item>
          </CollapsibleRoot>
        ))}
      </List>
    </>
  );
}
