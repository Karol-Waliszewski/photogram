import { useAtomValue } from "jotai";
import { Loader2 } from "lucide-react";

import { cn } from "@/utils/cn";

import { Button } from "@/components/atoms/Button";
import { useToast } from "@/components/atoms/Toast";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/atoms/Dialog";

import { api } from "@/utils/api";
import { type TypedOmit } from "@/utils/types";
import { postToBeDeletedIdAtom } from "@/store";

const SUCCESS_TOAST = {
  title: "It's time to say goodbye!",
  description: "You successfully deleted a post.",
};

const ERROR_TOAST = {
  title: "Oh noooooo...",
  description: "Something went wrong while deleting your post.",
};

export type DeletePostDialogProps = TypedOmit<
  React.ComponentProps<typeof DialogContent>,
  "onSubmit"
> & {
  isOpen: boolean;
  onClose: () => void;
};
const DeletePostDialog = ({
  isOpen,
  onClose,
  className,
  ...props
}: DeletePostDialogProps) => {
  const { toast } = useToast();
  const trpc = api.useUtils();
  const postId = useAtomValue(postToBeDeletedIdAtom);

  const { mutate: deletePost, isLoading } = api.post.delete.useMutation({
    onSuccess: () => {
      void trpc.post.all.invalidate();
      toast(SUCCESS_TOAST);
      onClose();
    },
    onError: () => {
      toast(ERROR_TOAST);
    },
  });

  const onSubmit = () => {
    if (postId) deletePost({ postId });
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
          <DialogTitle>Delete post</DialogTitle>
          <DialogDescription>
            Every adventure has an end. Are you sure you want to delete this?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start">
          <Button
            type="submit"
            onClick={onSubmit}
            disabled={isLoading}
            className="flex items-center gap-1"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isLoading ? "Deleting" : "Delete post"}
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { DeletePostDialog };
