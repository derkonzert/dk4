import { PersonIcon } from "@radix-ui/react-icons";
import { useTranslation } from "../lib/TranslationContextProvider";
import { useUser } from "../lib/UserContextProvider";
import ActiveLink from "./ActiveLink";
import {
  SidebarContent,
  SidebarLayout,
  SidebarNav,
  SidebarNavLink,
  SidebarSide,
} from "./Sidebar";

export function SidebarPage({ children }) {
  const { t } = useTranslation();
  const { user } = useUser();

  return (
    <SidebarLayout>
      <SidebarSide>
        <SidebarNav>
          <ActiveLink href="/" passHref>
            <SidebarNavLink>{t("sidebar.nav.events")}</SidebarNavLink>
          </ActiveLink>
          {user && (
            <ActiveLink href="/account/profile" passHref>
              <SidebarNavLink>
                {t("sidebar.nav.profile")} <PersonIcon />
              </SidebarNavLink>
            </ActiveLink>
          )}
          <ActiveLink href="/about" passHref>
            <SidebarNavLink>{t("sidebar.nav.about")}</SidebarNavLink>
          </ActiveLink>
          <ActiveLink href="/about/features" passHref>
            <SidebarNavLink>{t("sidebar.nav.features")}</SidebarNavLink>
          </ActiveLink>
        </SidebarNav>
      </SidebarSide>
      <SidebarContent>{children}</SidebarContent>
    </SidebarLayout>
  );
}
