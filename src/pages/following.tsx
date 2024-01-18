import { Button } from "@/components/atoms/Button";
import { H1, Text } from "@/components/atoms/Typography";
import { useSetAtom } from "jotai";

import { Posts, usePosts } from "@/components/molecules/Posts";
import { Layout } from "@/views/Layout";

import { api } from "@/utils/api";
import { isPostCreateDialogOpenAtom } from "@/store";

const FollowingPage = () => {
  const setPostCreateDialogVisibility = useSetAtom(isPostCreateDialogOpenAtom);

  const { data, isFetching, error, isRefetching } =
    api.post.fromFollowedUsers.useQuery();

  const { posts, onDeleteButtonClick, onFollowButtonClick, onLikeButtonClick } =
    usePosts(data ?? []);

  return (
    <Layout className="pt-10">
      <H1>Following Page</H1>
      <Text>
        Welcome to your Following Page! This is where you'll find all the latest
        adventures from the people you follow on Photogram. Get inspired by
        their journeys, engage with their stories, and share in the excitement
        of their travels. It's time to explore!
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
        onFollowButtonClick={onFollowButtonClick
        }
        onDeleteButtonClick={onDeleteButtonClick}
      />
    </Layout>
  );
};

export default FollowingPage;
