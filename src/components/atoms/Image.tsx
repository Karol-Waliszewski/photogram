// https://nextjs.org/docs/pages/api-reference/components/image

import NextImage from "next/image";
import { forwardRef } from "react";

import { type TypedOmit } from "@/utils/types";
import { cn } from "@/utils/cn";

type NextImageProps = React.ComponentProps<typeof NextImage>;
export type ImageProps = TypedOmit<
  NextImageProps,
  "width" | "height" | "fill" | "placeholder"
> &
  (
    | {
        width: number;
        height: number;
      }
    | { cover: boolean }
    | { responsive: boolean }
  );

const Image = forwardRef<HTMLImageElement, ImageProps>(
  ({ className, ...props }, ref) => {
    if ("responsive" in props && props.responsive) {
      const { responsive, ...rest } = props;
      return (
        <div className={cn("relative h-full w-full", className)}>
          <NextImage {...rest} fill={responsive} ref={ref} />
        </div>
      );
    }

    if ("cover" in props && props.cover) {
      const { cover, ...rest } = props;
      return (
        <NextImage
          {...rest}
          fill={cover}
          className={cn("object-cover", className)}
          ref={ref}
        />
      );
    }

    return <NextImage className={className} {...props} ref={ref} />;
  },
);
Image.displayName = "Image";

export { Image };
