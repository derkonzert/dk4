import { MDXRemote } from "next-mdx-remote";
import { components } from "../../components/MdxTypoProvider";
import { SidebarPage } from "../../components/SidebarPage";
import { getMarkdownContent } from "../../lib/getMarkdownContent";

export function getFilePath(locale) {
  switch (locale) {
    case "de":
      return "features/features_de.mdx";
    default:
      return "features/features_en.mdx";
  }
}

export const getStaticProps = async ({ locale }) => {
  const filePath = getFilePath(locale);
  const props = await getMarkdownContent(filePath);

  return {
    props,
  };
};

export default function OpenSourcePage({ source }) {
  return (
    <SidebarPage>
      <MDXRemote {...source} components={components} />
    </SidebarPage>
  );
}
