import { Button } from "@/components/atoms/Button";
import { H1, Text } from "@/components/atoms/Typography";
import { Posts } from "@/components/molecules/Posts";
import { Layout } from "@/views/Layout";

import { api } from "@/utils/api";
import { useSession } from "next-auth/react";

const PostPage = () => {
  const { data, isFetching, error } = api.post.getPosts.useQuery();
  const { data: sessionData } = useSession();
  const { data: followers } = api.user.getFollowers.useQuery(
    {
      userId: sessionData?.user.id ?? "",
    },
    { enabled: !!sessionData?.user.id },
  );
  const { mutate: followUser } = api.user.follow.useMutation();
  const { mutate: unfollowUser } = api.user.unfollow.useMutation();

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
        posts={data?.map((post) => ({
          ...post,
          likes: post.likes.length,
          isFollowButtonVisible:
            sessionData?.user && post.createdById !== sessionData?.user.id,
          isFavourite: sessionData?.user
            ? post.likes.some((like) => like.id === sessionData?.user.id)
            : false,
          isAuthorFollowed: followers?.some(
            (follower) => follower.id === post.createdById,
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
      />
    </Layout>
  );
};

export default PostPage;
