import { CopyIcon } from "@radix-ui/react-icons";
import clipboardy from "clipboardy";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "../lib/TranslationContextProvider";
import { useNativeShareApi } from "../lib/useNativeShareApi";
import { styled } from "../stitches.config";
import { Button } from "./Button";
import { ChromelessButton } from "./ChromelessButton";
import { Flex } from "./Flex";
import { Grid } from "./Grid";
import { Input } from "./Input";
import { TypoHeading } from "./Typo";

const ShareOption = styled(ChromelessButton, {
  backgroundColor: "$slate4",
  borderRadius: "$2",
  padding: "$2",
  flex: "1 1 auto",
  textDecoration: "none",

  "&:hover": {
    textDecoration: "underline",
  },

  variants: {
    social: {
      os: {
        backgroundColor: "$slate11",
        color: "$slate3",
      },
      fb: {
        backgroundColor: "#3b5998",
        color: "white",
      },
      twitter: {
        backgroundColor: "#55acee",
        color: "white",
      },
    },
  },
});

export function ShareContent() {
  const { t } = useTranslation();
  const { shareData, shareNative, supported } = useNativeShareApi();
  const [twitterUrl, setTwitterUrl] = useState("");
  const [fbUrl, setFbUrl] = useState("");

  useEffect(() => {
    if (shareData?.url) {
      const encodedUrl = encodeURIComponent(shareData?.url);

      setTwitterUrl(`https://twitter.com/intent/tweet?text=${encodedUrl}`);
      setFbUrl(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`);
    }
  }, [shareData?.url]);

  const handleCopyClick = useCallback(async () => {
    const url = shareData?.url;

    if (!url) {
      throw new Error("No url to share");
    }

    await clipboardy.write(url);

    toast.success(t("shareContent.toast.copySuccess"));
  }, [shareData?.url, t]);

  return (
    <Grid columns={1} gap={"4"}>
      <TypoHeading size="h4">{t("shareContent.title")}</TypoHeading>

      <Grid columns={{ "@initial": 2, "@bp1": supported ? 4 : 3 }} gap="2">
        <ShareOption
          social="fb"
          as="a"
          href={fbUrl}
          rel="noopener noreferrer"
          target="_blank"
        >
          Facebook
        </ShareOption>
        <ShareOption
          social="twitter"
          as="a"
          href={twitterUrl}
          rel="noopener noreferrer"
          target="_blank"
        >
          Twitter
        </ShareOption>
        <ShareOption
          as="a"
          href={`mailto:?subject=${shareData?.title ?? "derkonzert"}&body=${
            shareData?.url ?? ""
          }`}
        >
          {t("shareContent.via.email")}
        </ShareOption>
        {supported && (
          <ShareOption social="os" onClick={shareNative}>
            {t("shareContent.via.other")}
          </ShareOption>
        )}
      </Grid>

      <Flex
        gap="1"
        css={{ padding: "$1", background: "$indigo4", borderRadius: "$3" }}
      >
        <Input readOnly value={shareData?.url ?? ""} css={{ width: "100%" }} />
        <Button
          title={t("shareContent.copyToClipboard")}
          variant="ghost"
          onClick={handleCopyClick}
        >
          <CopyIcon />
        </Button>
      </Flex>
    </Grid>
  );
}
