import { MDXRemote } from "next-mdx-remote";
import { components } from "../../components/MdxTypoProvider";
import { SidebarPage } from "../../components/SidebarPage";
import { getMarkdownContent } from "../../lib/getMarkdownContent";

export function getFilePath(_locale) {
  return "privacy/privacy_de.mdx";
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
