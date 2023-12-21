import { type Accept } from "react-dropzone";

import { Button } from "@/components/atoms/Button";
import { Image } from "@/components/atoms/Image";
import { Small, Text } from "@/components/atoms/Typography";
import { Swiper, SwiperSlide } from "@/components/atoms/Swiper";
import { AspectRatio } from "@/components/atoms/AspectRatio";
import { Textarea } from "@/components/atoms/Textarea";
import { Dropzone } from "@/components/atoms/Dropzone";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/atoms/Dialog";

import { cn } from "@/utils/cn";
import { Trash } from "lucide-react";
import { useState } from "react";

const ACCEPTED_FILE_TYPES: Accept = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
};

export type NewPostDialogProps = React.ComponentProps<typeof DialogContent> & {
  isOpen: boolean;
  onClose: () => void;
};
const NewPostDialog = ({
  isOpen,
  onClose,
  className,
  ...props
}: NewPostDialogProps) => {
  const [files, setFiles] = useState<File[]>([]);

  const onImageDeleteClick = (index: number) => {
    setFiles((files) => files.filter((_, fileIndex) => fileIndex !== index));
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(isCurrentlyOpened) =>
        isCurrentlyOpened === false && onClose()
      }
    >
      <DialogContent className={cn("sm:max-w-lg", className)} {...props}>
        <DialogHeader>
          <DialogTitle>Add new post</DialogTitle>
          <DialogDescription>
            Share with the world your last adventure!
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <AspectRatio
            ratio={1}
            className="w-full overflow-hidden border border-dashed bg-background shadow-lg sm:rounded-md"
          >
            <Dropzone
              accept={ACCEPTED_FILE_TYPES}
              onDrop={(acceptedFiles) => setFiles(acceptedFiles)}
              noClick={files?.length > 0}
              multiple
              className={cn(
                "flex h-full w-full items-center justify-center",
                files.length > 0 ? "cursor-default" : "cursor-pointer",
              )}
            >
              {({ isDragActive, acceptedTypes }) =>
                files?.length > 0 ? (
                  <Swiper
                    className="h-full w-full"
                    pagination
                    onClick={(_, e) => {
                      // e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    {files.map((file, index) => (
                      <SwiperSlide key={file.name}>
                        <Image src={URL.createObjectURL(file)} alt={""} cover />
                        <Button
                          onClick={(e) => {
                            e.preventDefault();
                            onImageDeleteClick(index);
                          }}
                          className="absolute bottom-2 right-2 z-20"
                          size="icon"
                          variant="outline"
                        >
                          <Trash className="h-5 w-5" />
                        </Button>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                ) : (
                  <div className="flex flex-col gap-2 p-6 ">
                    <Text className="text-center">
                      {isDragActive
                        ? "Drop your images here"
                        : "Add your images"}
                    </Text>
                    <Small className="text-center">
                      Accepting: {acceptedTypes?.join(" ")}
                    </Small>
                  </div>
                )
              }
            </Dropzone>
          </AspectRatio>
          <Textarea
            placeholder="Write about your adventure..."
            className="h-20 resize-none"
          />
        </div>
        <DialogFooter className="sm:justify-start">
          <Button type="button">Add post</Button>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { NewPostDialog };
