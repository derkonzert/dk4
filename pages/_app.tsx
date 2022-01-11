import { DefaultSeo } from "next-seo";
import { ThemeProvider } from "next-themes";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import useVH from "react-viewport-height";
import { CookieNotice } from "../components/CookieNotice";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { SkipToContent, SKIP_TO_CONTENT_ID } from "../components/SkipToContent";
import { getLocale } from "../lib/getLocale";
import { TranslationContextProvider } from "../lib/TranslationContextProvider";
import { UserContextProvider } from "../lib/UserContextProvider";
import { defaultSeoConfig } from "../next-seo.config";
import { darkTheme, globalCss, styled } from "../stitches.config";
import { supabase } from "../utils/supabaseClient";

function eraseCookie(name: string) {
  document.cookie = name + "=; Max-Age=-99999999;";
}

if (process.browser) {
  // Delete cookies from old dk3
  eraseCookie("cookieConsent");
  eraseCookie("token");
}
type locales = "de" | "en";

const globalStyles = globalCss({
  body: { margin: 0, background: "$bg1" },
  html: {
    fontFamily: "$body",
    lineHeight: "1.4",
    background: "$primary",
  },
});

const Root = styled("div", {
  backgroundColor: "$bg1",
  color: "$slate12",
  minHeight: "100vh",

  display: "flex",
  flexDirection: "column",
});

const Main = styled("main", {
  display: "grid",

  flex: "1 0 auto",
  background: "$indigo2",

  "&  > *": {
    gridColumn: "2",
  },

  variants: {
    withoutPadding: {
      true: {
        gridTemplateColumns: "0 1fr 0",
      },
      false: {
        gridTemplateColumns: "$space$2 1fr $space$2",

        "@bp2": { gridTemplateColumns: "$space$6 1fr $space$6" },
        "@bp3": { gridTemplateColumns: "$space$8 1fr $space$8" },
      },
    },
  },
});

const eventListPaths = ["/", "/latest", "/favorites", "/archive"];
const isEventListPage = (path, query) =>
  query.currentFilter !== undefined ||
  eventListPaths.includes(path.replace(/[#\?](.)*$/, ""));

function MyApp({ Component, pageProps }) {
  globalStyles();
  useVH();

  const router = useRouter();
  const { locale, asPath, query } = router;
  const isPlainPage = asPath.endsWith("/card");

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        switch (event) {
          case "PASSWORD_RECOVERY":
            router.replace("/account/update-password");
            break;
          case "SIGNED_OUT":
            toast.success("👋");
            break;
        }
      }
    );

    return () => {
      authListener?.unsubscribe();
    };
  }, [router]);

  const headerSecondRow = isEventListPage(asPath, query) ? "events" : "none";

  return (
    <ThemeProvider
      disableTransitionOnChange
      attribute="class"
      value={{ light: "light-theme", dark: darkTheme.toString() }}
      defaultTheme="system"
    >
      <Root>
        <TranslationContextProvider<locales> translations={getLocale(locale)}>
          <UserContextProvider supabaseClient={supabase}>
            <DefaultSeo {...defaultSeoConfig} />
            <Head>
              <title>derkonzert</title>
            </Head>

            <SkipToContent />

            {!isPlainPage && <Header secondRow={headerSecondRow} />}

            <Main id={SKIP_TO_CONTENT_ID} withoutPadding={isPlainPage}>
              <Component {...pageProps} />
            </Main>

            {!isPlainPage && <Footer />}

            <Toaster containerStyle={{ zIndex: 99999 }} />

            {!isPlainPage && <CookieNotice />}
          </UserContextProvider>
        </TranslationContextProvider>
      </Root>
    </ThemeProvider>
  );
}

export default MyApp;
