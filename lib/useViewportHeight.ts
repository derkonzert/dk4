import { useEffect } from "react";

// Exposes 1% of the real inner window height as --vh (mobile browsers
// exclude their toolbars from innerHeight, unlike CSS vh).
export function useViewportHeight() {
  useEffect(() => {
    const update = () => {
      document.documentElement.style.setProperty(
        "--vh",
        `${window.innerHeight * 0.01}px`
      );
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
}
