import { forwardRef } from "react";
import {
  Swiper as ReactSwiper,
  SwiperSlide as ReactSwiperSlide,
  type SwiperProps as ReactSwiperProps,
  type SwiperRef as ReactSwiperRef,
} from "swiper/react";
import { Mousewheel, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import { type TypedOmit } from "@/utils/types";

export type SwiperProps = TypedOmit<
  ReactSwiperProps,
  "modules" | "pagination"
> & { pagination?: boolean };
const Swiper = forwardRef<ReactSwiperRef, ReactSwiperProps>(
  ({ pagination, ...props }, ref) => (
    <ReactSwiper
      ref={ref}
      modules={[Mousewheel, Pagination]}
      mousewheel={{ forceToAxis: true }}
      pagination={
        pagination
          ? {
              clickable: true,
            }
          : false
      }
      {...props}
    />
  ),
);
const SwiperSlide = ReactSwiperSlide;

export { Swiper, SwiperSlide };
