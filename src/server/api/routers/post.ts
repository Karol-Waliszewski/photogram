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

  all: publicProcedure.query(({ ctx }) => {
    return ctx.db.post.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        images: true,
        createdBy: true,
        likes: true,
      },
    });
  }),

  byUserId: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.post.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          images: true,
          createdBy: true,
          likes: true,
        },
        where: { createdBy: { id: input.userId } },
      });
    }),

  fromFollowedUsers: protectedProcedure.query(({ ctx }) => {
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

  comments: publicProcedure
    .input(z.object({ postId: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db.comment.findMany({ where: { postId: input.postId } , include: { createdBy: true }});
    }),

  comment: protectedProcedure
    .input(z.object({ postId: z.number(), comment: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.comment.create({
        data: {
          content: input.comment,
          createdBy: { connect: { id: ctx.session.user.id } },
          post: { connect: { id: input.postId } },
        },
      });
    }),

  like: protectedProcedure
    .input(z.object({ postId: z.number() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.$transaction([
        ctx.db.user.update({
          where: { id: ctx.session.user.id },
          data: { liked: { connect: { id: input.postId } } },
        }),
        ctx.db.post.update({
          where: { id: input.postId },
          data: { likes: { connect: { id: ctx.session.user.id } } },
        }),
      ]);
    }),

  unlike: protectedProcedure
    .input(z.object({ postId: z.number() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.$transaction([
        ctx.db.user.update({
          where: { id: ctx.session.user.id },
          data: { liked: { disconnect: { id: input.postId } } },
        }),
        ctx.db.post.update({
          where: { id: input.postId },
          data: { likes: { disconnect: { id: ctx.session.user.id } } },
        }),
      ]);
    }),
});
