import { type Accept } from "react-dropzone";
import { cn } from "@/utils/cn";
import { Trash } from "lucide-react";
import { useEffect } from "react";
import { z } from "zod";

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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  useForm,
} from "@/components/atoms/Form";

const ACCEPTED_FILE_TYPES: Accept = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
};

const DESCRIPTION_ERROR_MESSAGE = "Description is required";
const IMAGES_ERROR_MESSAGE = "At least one image is required";

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
  const [form, onFormSubmit] = useForm({
    schema: z.object({
      description: z
        .string({
          required_error: DESCRIPTION_ERROR_MESSAGE,
        })
        .min(1, DESCRIPTION_ERROR_MESSAGE),
      images: z.array(z.instanceof(File)).min(1, IMAGES_ERROR_MESSAGE),
    }),
    submitHandler: async (data) => {
      console.log(data);
    },
    options: {
      defaultValues: {
        images: [],
      },
    },
  });

  const onImageDeleteClick = (images: File[], index: number) => {
    form.setValue(
      "images",
      images.filter((_, fileIndex) => fileIndex !== index),
    );
  };

  useEffect(() => {
    if (isOpen) {
      form.reset();
    }
  }, [isOpen]);

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
        <Form {...form}>
          <form className="flex flex-col gap-3">
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <AspectRatio
                      ratio={1}
                      className="w-full overflow-hidden border border-dashed bg-background shadow-lg sm:rounded-md"
                    >
                      <Dropzone
                        accept={ACCEPTED_FILE_TYPES}
                        onDrop={(acceptedFiles) =>
                          field.onChange(acceptedFiles)
                        }
                        noClick={field.value.length > 0}
                        multiple
                        className={cn(
                          "flex h-full w-full items-center justify-center",
                          field.value.length > 0
                            ? "cursor-default"
                            : "cursor-pointer",
                        )}
                      >
                        {({ isDragActive, acceptedTypes }) =>
                          field.value.length > 0 ? (
                            <Swiper
                              className="h-full w-full"
                              pagination
                              onClick={(_, e) => {
                                // e.preventDefault();
                                e.stopPropagation();
                              }}
                            >
                              {field.value.map((file, index) => (
                                <SwiperSlide key={file.name}>
                                  <Image
                                    src={URL.createObjectURL(file)}
                                    alt={""}
                                    cover
                                  />
                                  <Button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      onImageDeleteClick(field.value, index);
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
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="h-20 resize-none"
                      placeholder="Write about your adventure..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className="sm:justify-start">
          <Button type="submit" onClick={onFormSubmit}>
            Add post
          </Button>
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
