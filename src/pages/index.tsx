import { Button } from "@/components/atoms/Button";
import { H1, Text } from "@/components/atoms/Typography";
import { useSetAtom } from "jotai";

import { Posts, usePosts } from "@/components/molecules/Posts";
import { Layout } from "@/views/Layout";

import { api } from "@/utils/api";
import { isPostCreateDialogOpenAtom } from "@/store";

const PostPage = () => {
  const setPostCreateDialogVisibility = useSetAtom(isPostCreateDialogOpenAtom);

  const { data, isFetching, error, isRefetching } = api.post.all.useQuery();

  const { posts, onDeleteButtonClick, onFollowButtonClick, onLikeButtonClick } =
    usePosts(data ?? []);

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
        posts={posts}
        loading={isFetching && !isRefetching}
        error={error?.message}
        onLikeButtonClick={onLikeButtonClick}
        onFollowButtonClick={onFollowButtonClick}
        onDeleteButtonClick={onDeleteButtonClick}
      />
    </Layout>
  );
};

export default PostPage;
