import { Swiper, SwiperSlide } from "@/components/atoms/Swiper";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/atoms/Card";
import { Image } from "@/components/atoms/Image";
import { AspectRatio } from "@/components/atoms/AspectRatio";
import { Large, Small, Text } from "@/components/atoms/Typography";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/Avatar";

import { Star, StarOff, MessageCircle } from "lucide-react";
import { Button } from "@/components/atoms/Button";

export type PostProps = {
  id: number;
  description: string;
  createdBy: {
    id: string;
    name: string;
    image: string;
  };
  images: { id: number; src: string; alt: string }[];
  likes: number;
  isFavourite?: boolean;
  onLikeButtonClick?: (postId: number) => void;
  onCommentButtonClick?: (postId: number) => void;
};

const Post = ({
  id,
  description,
  images,
  createdBy,
  likes,
  isFavourite = false,
  onLikeButtonClick,
  onCommentButtonClick,
}: PostProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3 py-4">
        <div className="flex flex-row items-center gap-3">
          <Avatar>
            <AvatarImage src={createdBy.image} alt={createdBy.name} />
            <AvatarFallback>
              {createdBy.name
                .split(/\s+/)
                .map((text) => text?.[0] ?? "")
                .join("")}
            </AvatarFallback>
          </Avatar>
          <Large>{createdBy.name}</Large>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <AspectRatio ratio={1} className="overflow-hidden">
          <Swiper className="h-full w-full" pagination={true}>
            {images?.map((image, index) => (
              <SwiperSlide
                className="relative h-full min-w-full snap-center"
                key={index}
              >
                <Image src={image.src} alt={image.alt} cover />
              </SwiperSlide>
            ))}
          </Swiper>
          {/* <div className="flex h-full snap-x snap-mandatory overflow-auto">
            {images?.map((image, index) => (
              <div
                className="relative h-full min-w-full snap-center"
                key={index}
              >
                <Image src={image.src} alt={image.alt} cover />
              </div>
            ))}
          </div> */}
        </AspectRatio>
      </CardContent>
      <CardFooter className="flex flex-col items-start pb-4 pt-3">
        <div className="-ml-2 flex flex-row gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onLikeButtonClick?.(id)}
          >
            {isFavourite ? (
              <StarOff className="h-6 w-6" />
            ) : (
              <Star className="h-6 w-6" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onCommentButtonClick?.(id)}
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        </div>
        <div className="pb-2">
          <Small>
            Liked by {likes} {likes === 1 ? "person" : "people"}
          </Small>
        </div>
        <div>
          <Text>{description}</Text>
        </div>
      </CardFooter>
    </Card>
  );
};

export { Post };
