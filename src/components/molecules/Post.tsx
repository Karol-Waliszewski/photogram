import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/atoms/Card";
import { Image } from "@/components/atoms/Image";
import { AspectRatio } from "@/components/atoms/AspectRatio";
import { Text } from "@/components/atoms/Typography";

export type PostProps = {
  description: string;
  createdById: string;
  images: { id: number; src: string; alt: string }[];
};

const Post = ({ description, images, createdById }: PostProps) => {
  return (
    <Card>
      <CardHeader></CardHeader>
      <CardContent>
        <AspectRatio ratio={1} className="overflow-hidden">
          <div className="flex h-full snap-x snap-mandatory overflow-auto">
            {images?.map((image, index) => (
              <div
                className="relative h-full min-w-full snap-center"
                key={index}
              >
                <Image src={image.src} alt={image.alt} cover />
              </div>
            ))}
          </div>
        </AspectRatio>
        <Text>{description}</Text>
      </CardContent>
      <CardFooter>{createdById}</CardFooter>
    </Card>
  );
};

export { Post };
