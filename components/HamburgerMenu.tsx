import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { DotFilledIcon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "../lib/TranslationContextProvider";
import { useUser } from "../lib/UserContextProvider";
import { keyframes, styled } from "../stitches.config";
import { supabase } from "../utils/supabaseClient";
import { Button, ButtonIcon } from "./Button";

const slideUpAndFade = keyframes({
  "0%": { opacity: 0, transform: "translateY(2px)" },
  "100%": { opacity: 1, transform: "translateY(0)" },
});

const slideRightAndFade = keyframes({
  "0%": { opacity: 0, transform: "translateX(-2px)" },
  "100%": { opacity: 1, transform: "translateX(0)" },
});

const slideDownAndFade = keyframes({
  "0%": { opacity: 0, transform: "translateY(-2px)" },
  "100%": { opacity: 1, transform: "translateY(0)" },
});

const slideLeftAndFade = keyframes({
  "0%": { opacity: 0, transform: "translateX(2px)" },
  "100%": { opacity: 1, transform: "translateX(0)" },
});

const StyledContent = styled(DropdownMenuPrimitive.Content, {
  minWidth: 220,
  backgroundColor: "$slate1",
  borderRadius: 6,
  padding: 5,
  boxShadow:
    "0px 10px 38px -10px rgba(22, 23, 24, 0.35), 0px 10px 20px -15px rgba(22, 23, 24, 0.2)",
  "@media (prefers-reduced-motion: no-preference)": {
    animationDuration: "400ms",
    animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
    willChange: "transform, opacity",
    '&[data-state="open"]': {
      '&[data-side="top"]': { animationName: slideDownAndFade },
      '&[data-side="right"]': { animationName: slideLeftAndFade },
      '&[data-side="bottom"]': { animationName: slideUpAndFade },
      '&[data-side="left"]': { animationName: slideRightAndFade },
    },
  },
});

const itemStyles = {
  all: "unset",
  fontSize: "$4",
  lineHeight: 1.3,
  color: "$indigo11",
  display: "flex",
  alignItems: "center",
  fontFamily: "$body",
  cursor: "pointer",

  padding: "$2 $3 $2 $5",
  position: "relative",
  userSelect: "none",

  "&[data-disabled]": {
    color: "$slate8",
    pointerEvents: "none",
  },

  "&:focus": {
    backgroundColor: "$indigo9",
    color: "$indigo1",
  },
};
// @ts-ignore
const StyledItem = styled(DropdownMenuPrimitive.Item, { ...itemStyles });
// @ts-ignore
const StyledCheckboxItem = styled(DropdownMenuPrimitive.CheckboxItem, {
  ...itemStyles,
});
const StyledRadioGroup = styled(DropdownMenuPrimitive.RadioGroup, {
  borderRadius: 5,
});
// @ts-ignore
const StyledRadioItem = styled(DropdownMenuPrimitive.RadioItem, {
  ...itemStyles,
  paddingBlockStart: "$1",
  paddingBlockEnd: "$1",
  fontSize: "$2",
});
// @ts-ignore
const StyledTriggerItem = styled(DropdownMenuPrimitive.TriggerItem, {
  '&[data-state="open"]': {
    backgroundColor: "$indigo4",
    color: "$indigo11",
  },
  ...itemStyles,
});

const StyledLabel = styled(DropdownMenuPrimitive.Label, {
  paddingLeft: 5,
  fontSize: 12,
  fontFamily: "$body",
  lineHeight: "25px",
  color: "$slate11",
});

const StyledSeparator = styled(DropdownMenuPrimitive.Separator, {
  height: 1,
  backgroundColor: "$indigo6",
  margin: 5,
});

const StyledItemIndicator = styled(DropdownMenuPrimitive.ItemIndicator, {
  position: "absolute",
  left: 0,
  width: 25,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
});

const StyledArrow = styled(DropdownMenuPrimitive.Arrow, {
  fill: "$slate1",
});

// Exports
export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
export const DropdownMenuContent = StyledContent;
export const DropdownMenuItem = StyledItem;
export const DropdownMenuCheckboxItem = StyledCheckboxItem;
export const DropdownMenuRadioGroup = StyledRadioGroup;
export const DropdownMenuRadioItem = StyledRadioItem;
export const DropdownMenuItemIndicator = StyledItemIndicator;
export const DropdownMenuTriggerItem = StyledTriggerItem;
export const DropdownMenuLabel = StyledLabel;
export const DropdownMenuSeparator = StyledSeparator;
export const DropdownMenuArrow = StyledArrow;

export const HamburgerMenu = () => {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user } = useUser();
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    setOpen(false);
  }, [router.pathname]);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild aria-label="Menu" id="hamburger-dropdown">
        <Button variant="icon">
          <ButtonIcon as={HamburgerMenuIcon} position="left" />
          Menü
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent sideOffset={5}>
        <Link href="/about" passHref>
          <DropdownMenuItem asChild>
            <a>About</a>
          </DropdownMenuItem>
        </Link>

        {!!user && (
          <Link href="/account/profile" passHref>
            <DropdownMenuItem asChild>
              <a>Profile</a>
            </DropdownMenuItem>
          </Link>
        )}
        {user ? (
          <DropdownMenuItem
            onSelect={() => {
              supabase.auth.signOut();
              router.push("/");
            }}
          >
            Log out
          </DropdownMenuItem>
        ) : (
          <Link href="/account/sign-in" passHref>
            <DropdownMenuItem asChild>
              <a>Login</a>
            </DropdownMenuItem>
          </Link>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuLabel>Language</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={router.locale}
          onValueChange={(value) => {
            if (value && router.locale !== value) {
              router.replace(router.pathname, router.asPath, {
                locale: value,
                shallow: true,
              });

              toast.success(t("toast.languageSwitched"));
            }
          }}
        >
          <DropdownMenuRadioItem value="de">
            <DropdownMenuItemIndicator>
              <DotFilledIcon />
            </DropdownMenuItemIndicator>
            Deutsch
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="en">
            <DropdownMenuItemIndicator>
              <DotFilledIcon />
            </DropdownMenuItemIndicator>
            English
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>

        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
          <DropdownMenuRadioItem value="dark">
            <DropdownMenuItemIndicator>
              <DotFilledIcon />
            </DropdownMenuItemIndicator>
            Dark
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="light">
            <DropdownMenuItemIndicator>
              <DotFilledIcon />
            </DropdownMenuItemIndicator>
            Light
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>

        <DropdownMenuArrow />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
