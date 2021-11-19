import { useCallback, useEffect, useState } from "react";
import { Nullable } from "typescript-nullable";

export function useNativeShareApi(title?: string, url?: string) {
  const [hasShareFeatures, setHasShareFeatures] = useState(false);
  const [shareData, setShareData] = useState<Nullable<ShareData>>(null);

  useEffect(() => {
    setHasShareFeatures(typeof window.navigator.share === "function");

    setShareData({
      title: title || document.title,
      url:
        url || document.querySelector("link[rel=canonical]")
          ? (document.querySelector("link[rel=canonical]") as HTMLLinkElement)
              .href
          : document.location.href,
    });
  }, [title, url]);

  const shareNative = useCallback(async () => {
    if (hasShareFeatures && Nullable.isSome(shareData)) {
      try {
        await window.navigator.share?.(shareData);
      } catch (err) {
        // Silently fail…
      }
    }
  }, [hasShareFeatures, shareData]);

  return {
    shareData,
    shareNative,
    supported: hasShareFeatures,
  };
}
