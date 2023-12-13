import { cn } from "@/utils/cn";
import { type PropsWithChildren } from "react";

export type TypographyProps = React.HTMLAttributes<HTMLParagraphElement> &
  React.HTMLAttributes<HTMLHeadingElement>;

export const H1 = ({
  children,
  className,
  ...props
}: PropsWithChildren<TypographyProps>) => (
  <h1
    className={cn(
      "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
      className,
    )}
    {...props}
  >
    {children}
  </h1>
);

export const H2 = ({
  children,
  className,
  ...props
}: PropsWithChildren<TypographyProps>) => (
  <h2
    className={cn(
      "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
      className,
    )}
    {...props}
  >
    {children}
  </h2>
);

export const H3 = ({
  children,
  className,
  ...props
}: PropsWithChildren<TypographyProps>) => (
  <h3
    className={cn(
      "scroll-m-20 text-2xl font-semibold tracking-tight",
      className,
    )}
    {...props}
  >
    {children}
  </h3>
);

export const H4 = ({
  children,
  className,
  ...props
}: PropsWithChildren<TypographyProps>) => (
  <h4
    className={cn(
      "scroll-m-20 text-xl font-semibold tracking-tight",
      className,
    )}
    {...props}
  >
    {children}
  </h4>
);

export const Text = ({
  children,
  className,
  ...props
}: PropsWithChildren<TypographyProps>) => (
  <p
    className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}
    {...props}
  >
    {children}
  </p>
);

export const Large = ({
  children,
  className,
  ...props
}: PropsWithChildren<TypographyProps>) => (
  <p className={cn("text-lg font-semibold", className)} {...props}>
    {children}
  </p>
);

export const Small = ({
  children,
  className,
  ...props
}: PropsWithChildren<TypographyProps>) => (
  <small
    className={cn("text-sm font-medium leading-none", className)}
    {...props}
  >
    {children}
  </small>
);

export const Muted = ({
  children,
  className,
  ...props
}: PropsWithChildren<TypographyProps>) => (
  <p className={cn("text-muted-foreground text-sm", className)} {...props}>
    {children}
  </p>
);
