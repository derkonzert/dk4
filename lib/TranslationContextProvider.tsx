import { format } from "date-fns";
import { useRouter } from "next/router";
import { createContext, useCallback, useContext } from "react";
import { dateFnsLocales } from "./dateFnsLocales";

interface TranslationContextType {
  t: (key: string) => string;
  locale: string;
  formatDateLocalized: (date: Date, formatString: string) => string;
}

const TranslationContext = createContext<TranslationContextType>({
  t: (string) => string,
  locale: "de",
  formatDateLocalized: (date: Date, formatString: string) => "string",
});

export function TranslationContextProvider<T extends string>({
  translations,
  ...props
}: React.PropsWithChildren<{
  translations: Record<string, string>;
}>) {
  const router = useRouter();
  const currentLocale = router.locale as T;

  const t = useCallback(
    (key: string) => {
      const translation = translations[key];

      return translation ?? key;
    },
    [translations]
  );

  const formatDateLocalized = useCallback(
    (date, formatString) =>
      format(date, formatString, {
        locale: dateFnsLocales[router.locale ?? "de"],
      }),
    [router.locale]
  );

  const value = {
    t,
    locale: currentLocale,
    formatDateLocalized,
  };

  return <TranslationContext.Provider value={value} {...props} />;
}

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error(
      `useTranslation must be used within a TranslationContextProvider.`
    );
  }
  return context;
};
