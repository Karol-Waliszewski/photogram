import { Button } from "@/components/atoms/Button";
import { H1, Text } from "@/components/atoms/Typography";
import { useToast } from "@/components/atoms/Toast";

import { Posts } from "@/components/molecules/Posts";
import { Layout } from "@/views/Layout";

import { api } from "@/utils/api";
import { useSession } from "next-auth/react";

const PostPage = () => {
  const { data: sessionData } = useSession();
  const trpc = api.useUtils();
  const { toast } = useToast();
  const invalidatePosts = () => trpc.post.all.invalidate();
  const invalidateFollowers = () =>
    trpc.user.following.invalidate({
      userId: sessionData?.user.id,
    });

  const { data: posts, isFetching, error } = api.post.all.useQuery();
  const { mutate: deletePost } = api.post.delete.useMutation({
    onSuccess: () => {
      void invalidatePosts();
      toast({
        title: "Say bye bye!",
        description: "You successfully deleted a post.",
      });
    },
    onError: () => {
      toast({
        title: "Oh noooooo...",
        description: "Something went wrong while deleting your post.",
      });
    },
  });
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

  return (
    <Layout className="pt-10">
      <H1>Post Page</H1>
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
          isFavourite: sessionData?.user
            ? post.likes.some((like) => like.id === sessionData?.user.id)
            : false,
          isAuthor:
            sessionData?.user && post.createdById === sessionData?.user.id,
          isAuthorFollowed: following?.some(
            (user) => user.id === post.createdById,
          ),
        }))}
        loading={isFetching}
        error={error?.message}
        onLikeButtonClick={(postId) => {
          alert(postId);
        }}
        onCommentButtonClick={(postId) => {
          alert(postId);
        }}
        onFollowButtonClick={(userId, isFollowed) =>
          isFollowed ? unfollowUser({ userId }) : followUser({ userId })
        }
        onDeleteButtonClick={(postId) => {
          deletePost({ postId });
        }}
      />
    </Layout>
  );
};

export default PostPage;
