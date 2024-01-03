import { Button } from "@/components/atoms/Button";
import { H1, Text } from "@/components/atoms/Typography";
import { useSetAtom } from "jotai";

import { Posts } from "@/components/molecules/Posts";
import { Layout } from "@/views/Layout";

import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import { postToBeDeletedIdAtom } from "@/store";

const FollowingPage = () => {
  const { data: sessionData } = useSession();
  const trpc = api.useUtils();
  const setPostToBeDeletedId = useSetAtom(postToBeDeletedIdAtom);
  const invalidateFollowers = () =>
    trpc.user.following.invalidate({
      userId: sessionData?.user.id,
    });
  const invalidatePosts = () => trpc.post.fromFollowedUsers.invalidate();

  const {
    data: posts,
    isFetching,
    error,
    isRefetching,
  } = api.post.fromFollowedUsers.useQuery();
  const { data: following } = api.user.following.useQuery(
    {
      userId: sessionData?.user.id ?? "",
    },
    { enabled: !!sessionData?.user.id },
  );

  const { mutate: followUser } = api.user.follow.useMutation({
    onSuccess: () => {
      void invalidateFollowers();
      void invalidatePosts();
    },
  });
  const { mutate: unfollowUser } = api.user.unfollow.useMutation({
    onSuccess: () => {
      void invalidateFollowers();
      void invalidatePosts();
    },
  });

  const { mutate: likePost } = api.post.like.useMutation({
    onSuccess: invalidatePosts,
  });
  const { mutate: unlikePost } = api.post.unlike.useMutation({
    onSuccess: invalidatePosts,
  });

  return (
    <Layout className="pt-10">
      <H1>Following Page</H1>
      <Text>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores
        deleniti ducimus modi voluptatem eos dignissimos fugiat saepe fugit
        accusantium cum, odio atque soluta provident iure quasi quod.
        Repudiandae, quis quibusdam. Lorem ipsum dolor, sit amet consectetur
        adipisicing elit. Perspiciatis ab quas id porro a fugit corporis,
        repudiandae quos omnis dolorem eligendi aut unde? Doloremque, voluptatum
        aliquid at autem dolor voluptatem.
      </Text>
      <Button className="mt-4" size={"lg"}>
        Lorem ipsum
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

export default FollowingPage;
