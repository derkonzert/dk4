import { MDXProvider } from "@mdx-js/react";
import Link from "next/link";
import { ComponentProps } from "react";
import { styled } from "../stitches.config";
import { Box } from "./Box";
import { Button } from "./Button";
import { CreateFeedbackForm } from "./CreateFeedbackForm";
import { HyperLink } from "./HyperLink";
import { TypoHeading, TypoText } from "./Typo";

const Heading = styled(TypoHeading, {
  marginBlock: "1.1em",
});

const Text = styled(TypoText, {
  marginBottom: "0.8em",
});

const Li = styled(TypoText, {
  marginBottom: "0.2em",
});

const A = ({ href, ...props }: ComponentProps<typeof HyperLink>) => {
  if (href?.startsWith("/")) {
    return (
      <Link href={href} passHref legacyBehavior>
        <HyperLink {...props} />
      </Link>
    );
  }

  return <HyperLink href={href} {...props} />;
};

const bindProps = (Component, element?: any, props: any = {}) =>
  function BoundComponent(ownPropes) {
    return <Component as={element} {...props} {...ownPropes} />;
  };

export const components = {
  h1: bindProps(Heading, "h1", { size: "h2" }),
  h2: bindProps(Heading, "h2", { size: "h3" }),
  h3: bindProps(Heading, "h3", { size: "h4" }),
  h4: bindProps(Heading, "h4", { size: "h5" }),
  h5: bindProps(Heading, "h5", { size: "h6" }),
  p: bindProps(Text, "p", { size: "copy" }),
  li: bindProps(Li, "li", { size: "copy" }),
  a: bindProps(A),
  Button: bindProps(Button),
  Box: bindProps(Box),
  CreateFeedbackForm,
};

export function MdxTypoProvider({ children }) {
  return <MDXProvider components={components}>{children}</MDXProvider>;
}
