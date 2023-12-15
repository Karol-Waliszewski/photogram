import { ApertureIcon } from "lucide-react";

import { Link, type LinkProps } from "@/components/atoms/Link";
import { H3 } from "@/components/atoms/Typography";

import { cn } from "@/utils/cn";
import { type TypedOmit } from "@/utils/types";

export type LogoProps = TypedOmit<LinkProps, "href"> & {
  withLogo?: boolean;
};
const Logo = ({ withLogo = true, className, ...props }: LogoProps) => {
  return (
    <Link
      className={cn("flex flex-row items-center gap-2", className)}
      {...props}
      href="/"
    >
      {withLogo && <ApertureIcon className="h-6 w-6" />}
      <H3>Photogram</H3>
    </Link>
  );
};

export { Logo };
