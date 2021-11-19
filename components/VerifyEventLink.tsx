import { useCallback } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "../lib/TranslationContextProvider";
import { fromEvents } from "../utils/supabaseClient";
import { Button } from "./Button";

interface VerifyEventLinkOwnProps {
  id: string;
  onVerified: () => void;
}

export function VerifyEventLinkLink({
  id,
  onVerified,
}: VerifyEventLinkOwnProps) {
  const { t } = useTranslation();

  const verifyEvent = useCallback(async () => {
    const { error } = await fromEvents()
      .update({ verified: true }, { returning: "minimal" })
      .match({ id })
      .single();

    if (error) {
      toast.error(t("global.permissionDenied"));
    } else {
      toast.success(t("event.verify.success"));
      onVerified();
    }
  }, [id, onVerified, t]);

  return (
    <Button variant="secondary" onClick={verifyEvent}>
      {t("event.verify")}
    </Button>
  );
}
