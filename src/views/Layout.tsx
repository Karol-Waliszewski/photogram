import { Container } from "@/components/atoms/Container";
import { cn } from "@/utils/cn";
import { type PropsWithChildren } from "react";

export type LayoutProps = React.HTMLAttributes<HTMLDivElement>;
export const Layout = ({
  children,
  className,
  ...props
}: PropsWithChildren<LayoutProps>) => {
  return (
    <Container className={cn("py-4", className)} variant={"slim"} {...props}>
      {children}
    </Container>
  );
};
