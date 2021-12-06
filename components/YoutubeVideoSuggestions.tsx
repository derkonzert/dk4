import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useThrottle } from "react-use";
import { throwIfNot200 } from "../lib/throwIfNot200";
import { useTranslation } from "../lib/TranslationContextProvider";
import { Button } from "./Button";
import { Flex } from "./Flex";
import { Iframe } from "./IFrame";
import { TypoHeading, TypoText } from "./Typo";

export interface YoutubeVideoSuggestionsOwnProps {
  search: string;
  onSuggestionChosen: (suggestion: YoutubeVideoSuggestion) => void;
}

// Unsafe, should be per component
let controllerCache: AbortController;

export function YoutubeVideoSuggestions({
  search,
  onSuggestionChosen,
}: YoutubeVideoSuggestionsOwnProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const searchThrottled = useThrottle(search, 500);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);

  const [videoSuggestions, setVideoSuggestions] = useState<
    YoutubeVideoSuggestion[]
  >([]);

  const fetchVideoSuggestions = useCallback(
    async (
      params: URLSearchParams,
      signal: AbortSignal
    ): Promise<{
      nextPageToken: string;
      items: YoutubeVideoSuggestion[];
    } | null> => {
      if (controllerCache) {
        controllerCache.abort();
      }

      setLoading(true);

      try {
        const result = await fetch(`/api/youtube-search?${params.toString()}`, {
          signal,
        })
          .then(throwIfNot200)
          .then((resp) => resp.json());

        setLoading(false);
        return result;
      } catch (err) {
        setLoading(false);

        if (err.name === "AbortError") {
          return null;
        }

        throw err;
      }
    },
    []
  );

  const handleFetchMore = useCallback(() => {
    const params = new URLSearchParams({
      q: searchThrottled,
      nextPageToken: nextPageToken ?? "",
    });
    const controller = new AbortController();
    const signal = controller.signal;

    fetchVideoSuggestions(params, signal).then(
      (result) => {
        if (result) {
          setNextPageToken(result.nextPageToken);
          setVideoSuggestions((prevItems) => [...prevItems, ...result.items]);
        }
      },
      (err) => {
        toast.error(err.message);
      }
    );

    controllerCache = controller;

    return () => {
      controller.abort();
    };
  }, [fetchVideoSuggestions, nextPageToken, searchThrottled]);

  useEffect(() => {
    const params = new URLSearchParams({
      q: searchThrottled,
    });

    const controller = new AbortController();
    const signal = controller.signal;

    fetchVideoSuggestions(params, signal).then(
      (result) => {
        if (result) {
          setNextPageToken(result.nextPageToken);
          setVideoSuggestions(result.items);
        }
      },
      (err) => {
        toast.error(err.message);
      }
    );

    return () => controller.abort();
  }, [fetchVideoSuggestions, searchThrottled]);

  return (
    <Flex gap="2" direction="column">
      {videoSuggestions.length ? (
        <>
          {videoSuggestions.map((videoSuggestion) => {
            return (
              <Flex
                key={videoSuggestion.videoId}
                direction="row"
                align="center"
                justify="between"
              >
                <Flex key={videoSuggestion.videoId} direction="column">
                  <TypoText>{videoSuggestion.title}</TypoText>

                  <Iframe
                    id={videoSuggestion.videoId}
                    src={`https://www.youtube.com/embed/${videoSuggestion.videoId}`}
                  />
                </Flex>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => onSuggestionChosen(videoSuggestion)}
                >
                  {t("youtubeSearch.choose")}
                </Button>
              </Flex>
            );
          })}
          {!!nextPageToken && (
            <Button type="button" variant="ghost" onClick={handleFetchMore}>
              {t("youtubeSearch.moreResultsButton")}
            </Button>
          )}
        </>
      ) : (
        !!searchThrottled &&
        !loading && (
          <TypoHeading>{t("youtubeSearch.noResults.title")}</TypoHeading>
        )
      )}
    </Flex>
  );
}
