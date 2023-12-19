import { Button } from "@/components/atoms/Button";
import { H1, Text } from "@/components/atoms/Typography";
import { Posts } from "@/components/molecules/Posts";
import { Layout } from "@/views/Layout";

import { api } from "@/utils/api";

const PostPage = () => {
  const { data, isFetching, error } = api.post.getPosts.useQuery();

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
        posts={data?.map((post) => ({ ...post, likes: post.likes.length }))}
        loading={isFetching}
        error={error?.message}
      />
    </Layout>
  );
};

export default PostPage;
