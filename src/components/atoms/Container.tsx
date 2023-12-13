import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/cn";

const containerVariant = cva("mx-auto px-4 md:px-6", {
  variants: {
    variant: {
      full: "w-full",
      default: "max-w-screen-lg",
      slim: "max-w-screen-md",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export type ContainerProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof containerVariant>;

const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        className={cn(containerVariant({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Container.displayName = "Container";

export { Container, containerVariant };
