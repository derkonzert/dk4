import { useRouter } from "next/router";
import PropTypes from "prop-types";
import Link, { LinkProps } from "next/link";
import React, { Children, PropsWithChildren, ReactElement } from "react";

interface ActiveLinkOwnProps {
  currentFilterMatch?: string;
}

const ActiveLink = ({
  children,
  currentFilterMatch,
  ...props
}: PropsWithChildren<ActiveLinkOwnProps & LinkProps>) => {
  const { asPath, locale, query } = useRouter();
  const router = useRouter();
  const child = Children.only(children) as ReactElement;

  // pages/index.js will be matched via props.href
  // pages/about.js will be matched via props.href
  // pages/[slug].js will be matched via props.as
  const isActive =
    ((asPath === props.href || asPath === props.as) &&
      (props.locale ? locale === props.locale : true)) ||
    (currentFilterMatch !== undefined &&
      query.currentFilter === currentFilterMatch);

  return (
    <Link {...props}>
      {React.cloneElement(child, {
        active: isActive,
      })}
    </Link>
  );
};

export default ActiveLink;
