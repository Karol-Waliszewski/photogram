import { type Accept } from "react-dropzone";

import { Button } from "@/components/atoms/Button";
import { Image } from "@/components/atoms/Image";
import { Small, Text } from "@/components/atoms/Typography";
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
            className="w-full overflow-hidden border border-dashed bg-background p-6 shadow-lg sm:rounded-md"
          >
            <Dropzone
              accept={ACCEPTED_FILE_TYPES}
              multiple={false}
              className=" flex h-full w-full cursor-pointer items-center justify-center "
            >
              {({ isDragActive, acceptedTypes, acceptedFiles }) =>
                acceptedFiles?.length > 0 && acceptedFiles[0] ? (
                  <Image
                    src={URL.createObjectURL(acceptedFiles[0])}
                    alt={""}
                    cover
                  />
                ) : (
                  <div className="flex flex-col gap-2">
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
