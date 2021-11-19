import React from "react";
import { useShowEmbed } from "../lib/useShowEmbed";
import { styled } from "../stitches.config";
import { Button } from "./Button";

export function getHostName(url) {
  var match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
  if (
    match != null &&
    match.length > 2 &&
    typeof match[2] === "string" &&
    match[2].length > 0
  ) {
    return match[2];
  } else {
    return null;
  }
}

const Wrapper = styled("div", {
  display: "block",
  maxWidth: "680px",
  minWidth: "250px",
  width: "100%",
  margin: "1rem 0",
  background: "$indigo3",
});

const Scaler = styled("div", {
  display: "block",
  position: "relative",
  width: "100%",
  paddingTop: "60%",
});

const Frame = styled("iframe", {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
});
const ShowEmbedWarning = styled("div", {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  textAlign: "center",
});

export const Iframe = ({ src, id }) => {
  const hostname = getHostName(src);
  const [showEmbeded, setShowEmbeded] = useShowEmbed(hostname);

  return (
    <Wrapper>
      <Scaler>
        {showEmbeded ? (
          <Frame id={`iframe-${id}`} src={src} frameBorder="0" />
        ) : (
          <ShowEmbedWarning>
            <Button variant="ghost" onClick={() => setShowEmbeded(true)}>
              Click, to load content from {hostname}
            </Button>
          </ShowEmbedWarning>
        )}
      </Scaler>
    </Wrapper>
  );
};
