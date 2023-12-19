import { AspectRatio } from "@/components/atoms/AspectRatio";
import { Skeleton } from "@/components/atoms/Skeleton";

import { DataLoader } from "@/components/molecules/DataLoader";
import { Post, type PostProps } from "@/components/molecules/Post";

import { cn } from "@/utils/cn";

export type PostsProps = {
  posts: PostProps[] | undefined;
  loading?: boolean;
  error?: string | null;
  className?: string;
};
const Posts = ({ posts, className, loading, error }: PostsProps) => {
  return (
    <div
      className={cn(
        "mx-auto max-w-screen-md space-y-6 lg:max-w-[500px]",
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
        {posts?.map((post) => <Post {...post} />)}
      </DataLoader>
    </div>
  );
};

export { Posts };
