import { AspectRatio } from "@/components/atoms/AspectRatio";
import { Skeleton } from "@/components/atoms/Skeleton";
import { useSetAtom } from "jotai";

import { DataLoader } from "@/components/molecules/DataLoader";
import { Post, type PostProps } from "@/components/molecules/Post";

import { cn } from "@/utils/cn";
import { type TypedOmit } from "@/utils/types";
import { api, type RouterOutputs } from "@/utils/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import { postToBeDeletedIdAtom } from "@/store";

export const usePosts = (posts: RouterOutputs["post"]["all"]) => {
  const router = useRouter();
  const { data: sessionData } = useSession();
  const setPostToBeDeletedId = useSetAtom(postToBeDeletedIdAtom);
  const isUserIsSignedIn = !!sessionData?.user;
  const trpc = api.useUtils();
  const invalidateFollowers = () =>
    trpc.user.following.invalidate({
      userId: sessionData?.user.id,
    });
  const invalidatePosts = () => trpc.post.invalidate();
  const { data: following } = api.user.following.useQuery(
    {
      userId: sessionData?.user.id ?? "",
    },
    { enabled: isUserIsSignedIn },
  );

  const { mutate: followUser } = api.user.follow.useMutation({
    onSuccess: invalidateFollowers,
  });
  const { mutate: unfollowUser } = api.user.unfollow.useMutation({
    onSuccess: invalidateFollowers,
  });
  const { mutate: likePost } = api.post.like.useMutation({
    onSuccess: invalidatePosts,
  });
  const { mutate: unlikePost } = api.post.unlike.useMutation({
    onSuccess: invalidatePosts,
  });

  const redirectToSignIn = async () => {
    await router.push("/sign-in");
  };

  const onLikeButtonClick = (postId: number, isLiked: boolean) => {
    if (!isUserIsSignedIn) {
      void redirectToSignIn();
      return;
    }
    isLiked ? unlikePost({ postId }) : likePost({ postId });
  };

  const onFollowButtonClick = async (userId: string, isFollowed: boolean) => {
    if (!isUserIsSignedIn) {
      void redirectToSignIn();
      return;
    }
    isFollowed ? unfollowUser({ userId }) : followUser({ userId });
  };

  const onDeleteButtonClick = (postId: number) => {
    setPostToBeDeletedId(postId);
  };

  return {
    onLikeButtonClick,
    onFollowButtonClick,
    onDeleteButtonClick,
    posts: posts.map((post) => ({
      ...post,
      likes: post.likes.length,
      isFollowButtonVisible: post.createdById !== sessionData?.user.id,
      isLiked: sessionData?.user
        ? post.likes.some((like) => like.id === sessionData?.user.id)
        : false,
      isAuthor: sessionData?.user && post.createdById === sessionData?.user.id,
      isAuthorFollowed: following?.some((user) => user.id === post.createdById),
    })),
  };
};

export type PostsProps = {
  posts: TypedOmit<PostProps, keyof PostProps & `on${string}`>[] | undefined;
  loading?: boolean;
  error?: string | null;
  className?: string;
} & Pick<PostProps, keyof PostProps & `on${string}`>;
const Posts = ({
  posts,
  className,
  loading,
  error,
  onLikeButtonClick,
  onCommentButtonClick,
  onFollowButtonClick,
  onDeleteButtonClick,
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
            onFollowButtonClick={onFollowButtonClick}
            onDeleteButtonClick={onDeleteButtonClick}
          />
        ))}
      </DataLoader>
    </div>
  );
};

export { Posts };
