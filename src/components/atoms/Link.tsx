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

export const Link: React.FC<
  PropsWithChildren<AnchorHTMLAttributes<HTMLAnchorElement> & { href: Href }>
> = ({ href, children, ...props }) =>
  href.startsWith("/") ? (
    <LocalLink href={href} {...props}>
      {children}
    </LocalLink>
  ) : (
    <ExternalLink href={href} {...props}>
      {children}
    </ExternalLink>
  );
