import { useRouter } from "next/router";
import { useEffect } from "react";
import Account from "../../components/Account";
import { Loader } from "../../components/Loader";
import { SidebarPage } from "../../components/SidebarPage";
import { useUser } from "../../lib/UserContextProvider";

export function ProfileContent() {
  const { session } = useUser();
  const router = useRouter();

  useEffect(() => {
    // When the users session could not be retrieved within 2s, assume he is not logged in.

    function checkSession() {
      if (!session) {
        router.replace("/");
      }
    }
    const timeout = setTimeout(checkSession, 2000);

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [router, session]);

  if (!session) {
    return <Loader label="Loading account data" />;
  }

  return <Account session={session} />;
}

export default function Profile() {
  return (
    <SidebarPage>
      <ProfileContent />
    </SidebarPage>
  );
}
