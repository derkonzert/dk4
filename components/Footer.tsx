import { useTranslation } from "../lib/TranslationContextProvider";
import { styled } from "../stitches.config";
import ActiveLink from "./ActiveLink";
import { Box } from "./Box";
import { Flex } from "./Flex";
import { HyperLink } from "./HyperLink";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ShareButton } from "./ShareButton";
import { TypoHeading } from "./Typo";

export const FooterWrapper = styled("footer", {
  // For now, make it not overflow
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-around",
  borderTop: "1px solid $colors$slate3",
  paddingInline: "$5",
  paddingBlock: "$5",
  backgroundColor: "$indigo1",

  "@bp2": {
    paddingBlock: "$6",
    paddingInline: "$8",
  },
  "@bp3": {
    paddingBlock: "$8",
  },
});

export const FooterWrapperRow = styled(Flex, {
  alignItems: "center",

  gap: "$3",

  paddingBlock: "$2",
  flexGrow: 1,
  color: "$slate11",

  "@bp1": { paddingBlock: "0" },
});

export default function Footer() {
  const { t } = useTranslation();
  return (
    <FooterWrapper>
      <FooterWrapperRow
        direction={{ "@initial": "column", "@bp1": "row" }}
        align={{ "@initial": "center", "@bp1": "center" }}
        wrap="wrap"
      >
        <Box css={{ "@bp1": { marginRight: "auto" } }}>
          <TypoHeading size="h4" css={{ color: "$slate12" }}>
            {t("header.title")}
          </TypoHeading>
        </Box>
        <Box>
          <LanguageSwitcher />
        </Box>
      </FooterWrapperRow>
      <FooterWrapperRow
        direction={{ "@initial": "row", "@bp1": "row" }}
        justify="between"
        align={{ "@initial": "center", "@bp1": "center" }}
        css={{ paddingBlock: "$3" }}
      >
        <Flex
          gap="3"
          direction={{ "@initial": "row", "@bp1": "row" }}
          wrap="wrap"
        >
          <ActiveLink href="/about" passHref>
            <HyperLink type="ghost" muted>
              {t("sidebar.nav.about")}
            </HyperLink>
          </ActiveLink>
          <ActiveLink href="/about/imprint" passHref>
            <HyperLink type="ghost" muted>
              {t("sidebar.nav.imprint")}
            </HyperLink>
          </ActiveLink>
          <ActiveLink href="/about/privacy" passHref>
            <HyperLink type="ghost" muted>
              {t("sidebar.nav.privacy")}
            </HyperLink>
          </ActiveLink>
        </Flex>
        <ShareButton />
      </FooterWrapperRow>
    </FooterWrapper>
  );
}
