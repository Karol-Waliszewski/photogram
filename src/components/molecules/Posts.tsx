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
    <DataLoader className={className} loading={!!loading} error={error ?? null}>
      <div className={cn("space-y-6", className)}>
        {posts?.map((post) => <Post {...post} />)}
      </div>
    </DataLoader>
  );
};

export { Posts };
