import fs from "fs";
import matter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import path from "path";

const CONTENT_PATH = path.join(process.cwd(), "contents");

export async function getMarkdownContent(filePath) {
  const postFilePath = path.join(CONTENT_PATH, filePath);
  const source = fs.readFileSync(postFilePath);

  const { content, data } = matter(source);

  const mdxSource = await serialize(content, {
    // Optionally pass remark/rehype plugins
    mdxOptions: {
      remarkPlugins: [],
      rehypePlugins: [],
    },
    scope: data,
  });

  return {
    source: mdxSource,
    frontMatter: data,
  };
}
