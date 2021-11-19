import { DefaultSeoProps } from "next-seo";

export const defaultSeoConfig: DefaultSeoProps = {
  description:
    "Eine von Besuchern kuratierte Liste mit guten Konzerten in München.",
  defaultTitle: "derkonzert",
  titleTemplate: "%s | derkonzert",
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: "https://derkonzert.de/",
    site_name: "derkonzert",
  },
};
