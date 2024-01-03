import { Button } from "@/components/atoms/Button";
import { H1, Text } from "@/components/atoms/Typography";
import { useSetAtom } from "jotai";

import { Posts } from "@/components/molecules/Posts";
import { Layout } from "@/views/Layout";

import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import { isPostCreateDialogOpenAtom, postToBeDeletedIdAtom } from "@/store";

const PostPage = () => {
  const { data: sessionData } = useSession();
  const trpc = api.useUtils();
  const setPostToBeDeletedId = useSetAtom(postToBeDeletedIdAtom);
  const setPostCreateDialogVisibility = useSetAtom(isPostCreateDialogOpenAtom);
  const invalidateFollowers = () =>
    trpc.user.following.invalidate({
      userId: sessionData?.user.id,
    });
  const invalidatePosts = () => trpc.post.all.invalidate();

  const {
    data: posts,
    isFetching,
    error,
    isRefetching,
  } = api.post.all.useQuery();
  const { data: following } = api.user.following.useQuery(
    {
      userId: sessionData?.user.id ?? "",
    },
    { enabled: !!sessionData?.user.id },
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

  return (
    <Layout className="pt-10">
      <H1>Post Page</H1>
      <Text>
        Welcome to Photogram! Here on the main page, you'll find all the posts
        from our users' adventures. Dive into the stories behind each photo,
        experience the journey, and get inspired for your next adventure!
      </Text>
      <Button
        className="mt-4"
        size={"lg"}
        onClick={() => setPostCreateDialogVisibility(true)}
      >
        Create a new post
      </Button>
      <Posts
        className="mt-10"
        posts={posts?.map((post) => ({
          ...post,
          likes: post.likes.length,
          isFollowButtonVisible:
            sessionData?.user && post.createdById !== sessionData?.user.id,
          isLiked: sessionData?.user
            ? post.likes.some((like) => like.id === sessionData?.user.id)
            : false,
          isAuthor:
            sessionData?.user && post.createdById === sessionData?.user.id,
          isAuthorFollowed: following?.some(
            (user) => user.id === post.createdById,
          ),
        }))}
        loading={isFetching && !isRefetching}
        error={error?.message}
        onLikeButtonClick={(postId, isLiked) => {
          isLiked ? unlikePost({ postId }) : likePost({ postId });
        }}
        onFollowButtonClick={(userId, isFollowed) =>
          isFollowed ? unfollowUser({ userId }) : followUser({ userId })
        }
        onDeleteButtonClick={setPostToBeDeletedId}
      />
    </Layout>
  );
};

export default PostPage;
