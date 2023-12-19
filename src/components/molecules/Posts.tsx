import { AspectRatio } from "@/components/atoms/AspectRatio";
import { Skeleton } from "@/components/atoms/Skeleton";

import { DataLoader } from "@/components/molecules/DataLoader";
import { Post, type PostProps } from "@/components/molecules/Post";

import { cn } from "@/utils/cn";
import { type TypedOmit } from "@/utils/types";

export type PostsProps = {
  posts:
    | TypedOmit<PostProps, "onLikeButtonClick" | "onCommentButtonClick">[]
    | undefined;
  loading?: boolean;
  error?: string | null;
  className?: string;
} & Pick<PostProps, "onLikeButtonClick" | "onCommentButtonClick">;
const Posts = ({
  posts,
  className,
  loading,
  error,
  onLikeButtonClick,
  onCommentButtonClick,
}: PostsProps) => {
  return (
    <div
      className={cn(
        "mx-auto max-w-screen-md space-y-6 md:max-w-screen-sm lg:max-w-[500px]",
        className,
      )}
    >
      <DataLoader
        className={className}
        loading={!!loading}
        error={error ?? null}
        renderLoading={() => (
          <>
            <AspectRatio ratio={4 / 5}>
              <Skeleton className="h-full w-full" />
            </AspectRatio>
            <AspectRatio ratio={4 / 5}>
              <Skeleton className="h-full w-full" />
            </AspectRatio>
          </>
        )}
      >
        {posts?.map((post) => (
          <Post
            key={post.id}
            {...post}
            onLikeButtonClick={onLikeButtonClick}
            onCommentButtonClick={onCommentButtonClick}
          />
        ))}
      </DataLoader>
    </div>
  );
};

export { Posts };
