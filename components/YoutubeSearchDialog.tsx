import { Cross1Icon } from "@radix-ui/react-icons";
import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useTranslation } from "../lib/TranslationContextProvider";
import {
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogRoot,
  DialogTrigger,
} from "./Dialog";
import { Flex } from "./Flex";
import { Input } from "./Input";
import { Label } from "./Label";
import { TypoHeading, TypoText } from "./Typo";
import { YoutubeVideoSuggestions } from "./YoutubeVideoSuggestions";

export interface YoutubeSearchDialogOwnProps {
  initialSearch?: string;
  onSuggestionChosen: (suggestion: YoutubeVideoSuggestion) => void;
}

export const YoutubeSearchDialog = ({
  initialSearch,
  onSuggestionChosen,
  children,
}: PropsWithChildren<YoutubeSearchDialogOwnProps>) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(initialSearch ?? "");

  const handleOpenChange = useCallback(
    (shouldBeOpen) => {
      setOpen(shouldBeOpen);
      if (shouldBeOpen === false) {
        setSearch(initialSearch ?? "");
      }
    },
    [initialSearch]
  );

  const handleSuggestionChosen = useCallback(
    (suggestion) => {
      setOpen(false);
      onSuggestionChosen(suggestion);
    },
    [onSuggestionChosen]
  );

  useEffect(() => {
    if (open) {
      setSearch(initialSearch ?? "");
    }
  }, [open, initialSearch]);

  return (
    <>
      <DialogRoot open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger
          data-splitbee-event="Opened Youtube Search Dialog"
          asChild
        >
          {children}
        </DialogTrigger>
        <DialogOverlay />
        <DialogContent size="small">
          <Flex gap="3" direction="column">
            <TypoHeading size="h3">Find a video on youtube</TypoHeading>
            <TypoText color="muted">
              This helps others to get to know the kind of artist…
            </TypoText>
            <Flex gap="1" direction="column">
              <Label htmlFor="title">{t("youtubeSearch.search.label")}</Label>
              <Input
                id="title"
                placeholder={t("youtubeSearch.search.placeholder")}
                value={search}
                onChange={(e) => setSearch(e.currentTarget.value)}
                type="text"
              />
            </Flex>

            <YoutubeVideoSuggestions
              search={search}
              onSuggestionChosen={handleSuggestionChosen}
            />
          </Flex>

          <DialogClose data-splitbee-event="Closed Youtube Search Dialog">
            <Cross1Icon />
          </DialogClose>
        </DialogContent>
      </DialogRoot>
    </>
  );
};
