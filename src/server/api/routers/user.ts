import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
  follow: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.$transaction([
        ctx.db.user.update({
          where: { id: ctx.session.user.id },
          data: { following: { connect: { id: input.userId } } },
        }),
        ctx.db.user.update({
          where: { id: input.userId },
          data: { followers: { connect: { id: ctx.session.user.id } } },
        }),
      ]);
    }),

  unfollow: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.$transaction([
        ctx.db.user.update({
          where: { id: ctx.session.user.id },
          data: { following: { disconnect: { id: input.userId } } },
        }),
        ctx.db.user.update({
          where: { id: input.userId },
          data: { followers: { disconnect: { id: ctx.session.user.id } } },
        }),
      ]);
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

  getFollowers: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.user
        .findUnique({ where: { id: input.userId } })
        .followers();
    }),

  getFollowings: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.user
        .findUnique({ where: { id: input.userId } })
        .following();
    }),
});
