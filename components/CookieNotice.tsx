import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { CookieNoticeDialogOwnProps } from "./CookieNoticeDialog";

const DynamicDialog = dynamic<CookieNoticeDialogOwnProps>(() =>
  import("./CookieNoticeDialog").then((mod) => mod.CookieNoticeDialog)
);

const localStorageKey = "cookie_note_read";
const statusRead = "read";

const useCookieNoteStatus = (): [boolean, (v: boolean) => void] => {
  const [isRead, setIsReadState] = useState(true);

  useEffect(() => {
    const status = localStorage.getItem(localStorageKey);
    if (status !== statusRead) {
      setIsReadState(false);
    }
  }, []);

  const setIsRead = useCallback((v: boolean) => {
    if (v) {
      localStorage.setItem(localStorageKey, statusRead);
    }
    setIsReadState(v);
  }, []);

  return [isRead, setIsRead];
};

export function CookieNotice() {
  const [isRead, setIsRead] = useCookieNoteStatus();

  return (
    <>{!isRead ? <DynamicDialog onAction={() => setIsRead(true)} /> : null}</>
  );
}
