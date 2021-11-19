import Link from "next/link";
import toast from "react-hot-toast";
import { HyperLink } from "../components/HyperLink";

export function loginRequiredToast(t) {
  return toast((instance) => (
    <span>
      {t("toast.notLoggedIn")}{" "}
      <Link href="/account/sign-in" passHref>
        <HyperLink onClick={() => toast.dismiss(instance.id)}>
          {t("toast.notLoggedIn.link")}
        </HyperLink>
      </Link>
    </span>
  ));
}
