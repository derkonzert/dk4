import { useRouter } from "next/router";
import { useEffect } from "react";
import Auth from "../../components/Auth";
import { Box } from "../../components/Box";
import { FloatingPanel } from "../../components/FloatingPanel";
import { useTranslation } from "../../lib/TranslationContextProvider";
import { useUser } from "../../lib/UserContextProvider";
import { supabase } from "../../utils/supabaseClient";

const fetcher = (url, token) =>
  fetch(url, {
    method: "GET",
    headers: new Headers({ "Content-Type": "application/json", token }),
    credentials: "same-origin",
  }).then((res) => res.json());

const Index = () => {
  const router = useRouter();
  const { action } = router.query;
  const { t } = useTranslation();

  const { user } = useUser();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, _session) => {
        if (event === "PASSWORD_RECOVERY")
          router.push("/account/update-password");
        if (event === "USER_UPDATED")
          setTimeout(() => router.push("/account/sign-in"), 1000);
      }
    );

    return () => {
      authListener?.unsubscribe();
    };
  }, [router]);

  useEffect(() => {
    if (user && action === "sign-in") {
      router.replace("/account/profile");
    }
  }, [action, router, user]);

  if (!action) {
    return null;
  }

  let title;
  switch (action) {
    case "sign-in":
    case "sign-up":
      title = "";
      break;
    case "magic-link":
      title = t("auth.title.magicLink");
      break;
    case "forgotten-password":
      title = t("auth.title.passwordForgotton");
      break;
    case "update-password":
      title = t("auth.title.updatePassword");
      break;
  }

  return (
    <div>
      <FloatingPanel
        css={{ "@bp1": { maxWidth: 360, width: "100%" }, marginInline: "auto" }}
      >
        <Box
          as="h1"
          css={{
            fontSize: "$5",
            marginTop: "$1",
            marginBottom: "$4",
            padding: "0",
            textAlign: "center",
          }}
        >
          {title}
        </Box>
        {action === "update-password" && (
          <Auth.UpdatePassword supabaseClient={supabase} />
        )}
        {!user && <Auth supabaseClient={supabase} action={action} />}
      </FloatingPanel>
    </div>
  );
};

export default Index;
