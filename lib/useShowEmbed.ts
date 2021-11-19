import { useCallback, useEffect, useState } from "react";

const CUSTOM_EVENT_NAME = "dk4:use-show-embed-update";

function readValue(key) {
  if (process.browser) {
    return localStorage.getItem(`allow-embed-${key}`) === "true";
  }
  return false;
}
function setValue(key, value) {
  if (process.browser) {
    localStorage.setItem(`allow-embed-${key}`, JSON.stringify(value));
  }
}

export function useShowEmbed(key): [boolean, (boolean) => void] {
  const [embed, setEmbedInternal] = useState(false);

  useEffect(() => {
    const nEmbed = readValue(key);
    if (embed !== nEmbed) {
      setEmbedInternal(nEmbed);
    }
  }, [embed, key]);

  const setEmbed = useCallback(
    (val) => {
      setEmbedInternal(val);

      setValue(key, val);

      window.dispatchEvent(new CustomEvent(CUSTOM_EVENT_NAME));
    },
    [key]
  );

  useEffect(() => {
    function handleStorageUpdate() {
      setEmbedInternal(readValue(key));
    }

    window.addEventListener(CUSTOM_EVENT_NAME, handleStorageUpdate);
    return () =>
      window.removeEventListener(CUSTOM_EVENT_NAME, handleStorageUpdate);
  }, [key]);

  return [embed, setEmbed];
}
