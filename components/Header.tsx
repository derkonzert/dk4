import { Cross1Icon, PlusCircledIcon } from "@radix-ui/react-icons";
import clamp from "clamp";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Nullable } from "typescript-nullable";
import { useTranslation } from "../lib/TranslationContextProvider";
import { useUser } from "../lib/UserContextProvider";
import { styled } from "../stitches.config";
import { definitions } from "../types/supabase";
import { fromProfiles, supabase } from "../utils/supabaseClient";
import ActiveLink from "./ActiveLink";
import { Avatar } from "./Avatar";
import { Box } from "./Box";
import { Button } from "./Button";
import { CreateEventFormDialog } from "./CreateEventFormDialog";
import { CreateFeedbackForm } from "./CreateFeedbackForm";
import { HamburgerMenu } from "./HamburgerMenu";
import {
  Popover,
  PopoverArrow,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "./Popover";
import { VerticalScrollArea } from "./VerticalScrollArea";

const headerHeight = 160;
const headerHeightBp2 = 140;
const headerHeightBp3 = 180;

export const HeaderWrapper = styled("header", {
  // For now, make it not overflow
  overflow: "hidden",
  position: "sticky",
  top: `${headerHeight * -0.618}px`,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-around",
  borderBottom: "1px solid $colors$slate5",
  backgroundColor: "$bg1",
  zIndex: "$header",
  height: headerHeight,
  marginBottom: "0",
  fontSize: "$4",

  "@bp2": {
    paddingInline: "$6",
    fontSize: "$7",
    top: `${headerHeightBp2 * -0.618}px`,
    height: headerHeightBp2,
  },
  "@bp3": {
    paddingInline: "$8",
    fontSize: "$8",
    top: `${headerHeightBp3 * -0.618}px`,
    height: headerHeightBp3,
  },

  variants: {
    noSecondRow: {
      true: {
        position: "sticky",
        top: 0,
        height: headerHeight * 0.382,

        "@bp2": {
          top: 0,
          height: headerHeightBp2 * 0.382,
        },
        "@bp3": {
          top: 0,
          height: headerHeightBp3 * 0.382,
        },
      },
    },
  },
});

export const HeaderWrapperRow = styled("div", {
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  alignItems: "center",
  gap: "$3",

  paddingInline: "$2",
  flexGrow: 1,

  "@bp2": { paddingInline: "0" },

  variants: {
    size: {
      large: {
        flexBasis: "61.8%",
      },
      small: {
        gap: "$1",
        flexBasis: "38.2%",

        fontSize: "$2",

        "@bp2": { fontSize: "$3" },
        "@bp3": { fontSize: "$4" },
      },
    },
  },
});

export const HeaderMainLink = styled("a", {
  textDecoration: "none",
  color: "$primary",
  fontFamily: "$heading",

  fontWeight: "bold",
});

export const HeaderLink = styled("a", {
  backgroundColor: "transparent",
  border: "none",
  textDecoration: "none",
  color: "inherit",
  fontFamily: "$heading",

  fontWeight: "normal",
  display: "inline-block",
  paddingInline: "$3",
  paddingBlock: "$2",
  borderRadius: "$2",
  "&:hover": {
    backgroundColor: "$bg2",
  },

  variants: {
    active: {
      true: {
        backgroundColor: "$bg2",
      },
    },

    icon: {
      true: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0",

        width: 36,
        height: 36,
        borderRadius: "$round",
        fontSize: "$3",
      },
    },
  },
});

export const HeaderLinkSecondary = styled("a", {
  backgroundColor: "transparent",
  border: "none",
  textDecoration: "none",
  color: "inherit",
  fontFamily: "$heading",
  fontWeight: "normal",
  fontSize: "inherit",
  display: "inline-block",
  lineHeight: 1,

  paddingInline: "$2",
  paddingBlock: "$2",

  borderRadius: 50,

  "@bp2": { paddingInline: "$3" },

  "&:hover": {
    backgroundColor: "$indigo4",
  },

  variants: {
    active: {
      true: {
        backgroundColor: "$primary",
        color: "$bg1",

        "&:hover": {
          backgroundColor: "$primary",
        },
      },
    },
  },
});

const PlusIcon = styled(PlusCircledIcon, {
  marginRight: "0.5em",
  fontSize: "1.25em",
});

interface HeaderOwnProps {
  secondRow: "none" | "events";
}

type HeaderProfile = Pick<definitions["profiles"], "avatar_url" | "username">;

export default function Header({ secondRow = "none" }: HeaderOwnProps) {
  const [profile, setProfile] = useState<Nullable<HeaderProfile>>(null);
  const headerRef = useRef<HTMLHeadingElement>(null);
  const { user } = useUser();
  const { t } = useTranslation();

  useEffect(() => {
    function onScroll() {
      const scrollY = clamp(window.scrollY, 0, headerHeight);

      if (headerRef.current) {
        const percentage = ((100 / headerHeight) * scrollY) / 100;
        const boxShadow = `0 0 ${percentage * 16}px rgba(0,0,0,${
          percentage * 0.15
        })`;

        headerRef.current.style.setProperty("box-shadow", boxShadow);
      }
    }

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const fetchProfile = useCallback(
    async function () {
      if (!user) {
        return;
      }
      const { data, error, status } = await fromProfiles()
        .select(`avatar_url,username`)
        .eq("id", user.id)
        .single();

      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error("No profile found.");
      }

      const profile: HeaderProfile = {
        username: data.username,
        avatar_url: undefined,
      };

      if (data.avatar_url) {
        const { data: file, error } = await supabase.storage
          .from("avatars")
          .getPublicUrl(data.avatar_url);

        if (error) {
          throw error;
        }

        profile.avatar_url = file?.publicURL;
      }

      setProfile(profile);
    },
    [user]
  );

  useEffect(() => {
    if (user?.id) {
      fetchProfile();
    }
  }, [user?.id, fetchProfile]);

  return (
    <HeaderWrapper ref={headerRef} noSecondRow={secondRow === "none"}>
      <HeaderWrapperRow size="large">
        <Link href="/" passHref>
          <HeaderMainLink css={{ marginRight: "auto" }}>
            {t("header.title")}
            <Box
              as="span"
              css={{
                display: "block",
                color: "$slate12",
                fontSize: "0.85em",
                "@bp1": {
                  fontSize: "1em",
                  display: "inline",
                  paddingBlock: "0",
                  paddingInline: "$2",
                },
              }}
            >
              {t("header.title.city")}
            </Box>
          </HeaderMainLink>
        </Link>
        <Popover>
          <PopoverTrigger asChild aria-controls="feedbackpopup">
            <Button
              variant="ghost"
              size="medium"
              css={{
                display: "none",
                "@bp2": {
                  display: "inline-flex",
                },
                "&[data-state=open]": {
                  borderColor: "$slate6",
                  backgroundColor: "$slate6",
                  color: "$slate11",
                },
              }}
            >
              {t("header.feedback")}
            </Button>
          </PopoverTrigger>
          <PopoverContent id="feedbackpopup">
            <PopoverArrow />
            <CreateFeedbackForm />
            <PopoverClose>
              <Cross1Icon />
            </PopoverClose>
          </PopoverContent>
        </Popover>
        <HamburgerMenu />
        {!!user && (
          <Link href="/account/profile" passHref>
            <Button
              as="a"
              variant="icon"
              title="Show Profile"
              css={{
                padding: "0",
                boxSizing: "border-box",
                height: 38,
                width: 38,
              }}
            >
              <Avatar src={profile?.avatar_url} size="medium" />
            </Button>
          </Link>
        )}
      </HeaderWrapperRow>
      {secondRow === "events" && (
        <HeaderWrapperRow size="small">
          <VerticalScrollArea>
            <ActiveLink href="/" passHref currentFilterMatch="">
              <HeaderLinkSecondary>
                {t("events.filter.all")}
              </HeaderLinkSecondary>
            </ActiveLink>
            <ActiveLink href="/latest" passHref currentFilterMatch="latest">
              <HeaderLinkSecondary>
                {t("events.filter.latest")}
              </HeaderLinkSecondary>
            </ActiveLink>
            <ActiveLink
              href="/favorites"
              passHref
              currentFilterMatch="favorites"
            >
              <HeaderLinkSecondary>
                {t("events.filter.favorites")}
              </HeaderLinkSecondary>
            </ActiveLink>
            <ActiveLink href="/archive" passHref currentFilterMatch="favorites">
              <HeaderLinkSecondary>
                {t("events.filter.archive")}
              </HeaderLinkSecondary>
            </ActiveLink>
          </VerticalScrollArea>

          <CreateEventFormDialog>
            <Button
              css={{
                marginLeft: "auto",
                fontFamily: "$heading",
                fontSize: "inherit",
              }}
              variant="ghost"
              size={{ "@initial": "small", "@bp2": "medium" }}
            >
              <PlusIcon />
              {t("header.create")}
            </Button>
          </CreateEventFormDialog>
        </HeaderWrapperRow>
      )}
    </HeaderWrapper>
  );
}
