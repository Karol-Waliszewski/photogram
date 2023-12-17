import NextLink from "next/link";
import {
  forwardRef,
  type AnchorHTMLAttributes,
  type PropsWithChildren,
} from "react";

import { type Paths } from "@/constants/paths";

export const LocalLink = NextLink;
export const ExternalLink = forwardRef<
  HTMLAnchorElement,
  PropsWithChildren<AnchorHTMLAttributes<HTMLAnchorElement>>
>((props, ref) => <a ref={ref} {...props} />);

export type Href =
  | Paths
  | `http://${string}`
  | `https://${string}`
  | `#${string}`;

export type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: Href;
};

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ href, ...props }, ref) =>
    href.startsWith("/") ? (
      <LocalLink href={href} ref={ref} {...props} />
    ) : (
      <ExternalLink href={href} ref={ref} {...props} />
    ),
);
Link.displayName = "Link";
