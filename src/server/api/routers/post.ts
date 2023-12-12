import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const postRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ description: z.string(), images: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.post.create({
        data: {
          description: input.description,
          createdBy: { connect: { id: ctx.session.user.id } },
          images: {
            create: input.images.map((image) => ({
              src: image,
              alt: "TODO: Add AI recognition to alt images",
            })),
          },
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ postId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.post.delete({
        where: { id: input.postId },
      });
    }),

  getPosts: publicProcedure.query(({ ctx }) => {
    return ctx.db.post.findMany({
      orderBy: { createdAt: "desc" },
      include: { images: true, createdBy: true, likes: true },
    });
  }),

  getPostsByUser: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.post.findMany({
        orderBy: { createdAt: "desc" },
        where: { createdBy: { id: input.userId } },
      });
    }),

  getPostsFromFollowedUsers: protectedProcedure.query(({ ctx }) => {
    return ctx.db.post.findMany({
      orderBy: { createdAt: "desc" },
      include: { images: true, createdBy: true, likes: true },
      where: {
        createdBy: {
          followers: {
            some: {
              id: ctx.session.user.id,
            },
          },
        },
      },
    });
  }),

  getComments: publicProcedure
    .input(z.object({ postId: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db.comment.findMany({ where: { postId: input.postId } });
    }),
});
