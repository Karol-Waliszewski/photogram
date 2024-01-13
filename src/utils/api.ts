import { useState } from "react";
import { httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
import superjson from "superjson";
import axios from "axios";

import { type AppRouter } from "@/server/api/root";
import { type NewPostFormSchema } from "@/components/organisms/NewPostDialog";
import { getImageNameFromUrl } from "@/utils/image";

const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

const uploadImage = async (image: File, signedUrl: string) => {
  const response = await axios.put(signedUrl, image.slice(), {
    headers: { "Content-Type": image.type },
  });

  if (response.status !== 200) {
    throw new Error("Failed to upload image");
  }

  return signedUrl.split("?")[0]!;
};

export const usePostCreate = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const { mutateAsync: savePost } = api.post.create.useMutation();
  const { mutateAsync: getSignedUrl } = api.storage.getSignedUrl.useMutation();
  const { mutateAsync: getImageAlt } = api.storage.getImageAlt.useMutation();
  const trpc = api.useUtils();

  const createPost = async (data: NewPostFormSchema) => {
    try {
      setIsLoading(true);

      const urls = await Promise.all(
        data.images.map(async (image) => {
          const signedUrl = await getSignedUrl({ key: image.name });
          return uploadImage(image, signedUrl);
        }),
      );

      const images = await Promise.all(
        urls.map(async (url) => {
          try {
            return {
              url,
              alt: await getImageAlt({
                imageUrl: getImageNameFromUrl(url),
              }),
            };
          } catch (error) {
            console.error(error);
            return { url, alt: "" };
          }
        }),
      );

      await savePost({
        description: data.description,
        images,
      });

      await trpc.post.invalidate();
      setIsError(false);
    } catch (error) {
      console.error(error);
      setIsError(true);
      throw new Error("Failed to create post");
    } finally {
      setIsLoading(false);
    }
  };

  return { createPost, isLoading, isError };
};

/** A set of type-safe react-query hooks for your tRPC API. */
export const api = createTRPCNext<AppRouter>({
  config() {
    return {
      /**
       * Config for react-query.
       *
       * @see https://tanstack.com/query/v4/docs/react/reference/QueryClient
       */
      queryClientConfig: {
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      },

      /**
       * Transformer used for data de-serialization from the server.
       *
       * @see https://trpc.io/docs/data-transformers
       */
      transformer: superjson,

      /**
       * Links used to determine request flow from client to server.
       *
       * @see https://trpc.io/docs/links
       */
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
    };
  },
  /**
   * Whether tRPC should await queries when server rendering pages.
   *
   * @see https://trpc.io/docs/nextjs#ssr-boolean-default-false
   */
  ssr: false,
});

/**
 * Inference helper for inputs.
 *
 * @example type HelloInput = RouterInputs['example']['hello']
 */
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helper for outputs.
 *
 * @example type HelloOutput = RouterOutputs['example']['hello']
 */
export type RouterOutputs = inferRouterOutputs<AppRouter>;
