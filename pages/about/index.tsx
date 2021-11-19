import { MDXRemote } from "next-mdx-remote";
import { components } from "../../components/MdxTypoProvider";
import { SidebarPage } from "../../components/SidebarPage";
import { getMarkdownContent } from "../../lib/getMarkdownContent";

export function getFilePath(locale) {
  switch (locale) {
    case "de":
      return "about/about_de.mdx";
    default:
      return "about/about_en.mdx";
  }
}

export const getStaticProps = async ({ locale }) => {
  const filePath = getFilePath(locale);
  const props = await getMarkdownContent(filePath);

  return {
    props,
  };
};

export default function AboutPage({ source }) {
  return (
    <SidebarPage>
      <MDXRemote {...source} components={components} />
    </SidebarPage>
  );
}
