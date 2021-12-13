import { Cross1Icon, Share2Icon } from "@radix-ui/react-icons";
import { id } from "date-fns/locale";
import dynamic from "next/dynamic";
import { useTranslation } from "../lib/TranslationContextProvider";
import { Button, ButtonIcon, ButtonProps } from "./Button";
import {
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTrigger,
} from "./Dialog";

const DynamicShareContent = dynamic(() =>
  import("./ShareContent").then((mod) => mod.ShareContent)
);

export function ShareButton(props: ButtonProps) {
  const { t } = useTranslation();

  return (
    <DialogRoot>
      <DialogOverlay />
      <DialogTrigger asChild>
        <Button variant="ghost" {...props}>
          <ButtonIcon as={Share2Icon} position="left" />
          {t("shareButton.label")}
        </Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogContent size="small" key={id + "-content"}>
          <DynamicShareContent />
          <DialogClose>
            <Cross1Icon />
          </DialogClose>
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  );
}
