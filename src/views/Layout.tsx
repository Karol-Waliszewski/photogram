import { cn } from "@/utils/cn";
import { type PropsWithChildren } from "react";

export type LayoutProps = React.HTMLAttributes<HTMLDivElement>;
export const Layout = ({
  children,
  className,
  ...props
}: PropsWithChildren<LayoutProps>) => {
  return (
    <div className={cn("container mx-auto px-2 py-4", className)} {...props}>
      {children}
    </div>
  );
};
