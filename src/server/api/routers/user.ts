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
      if (input.userId === ctx.session.user.id)
        throw new Error("You can't follow yourself");
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
      if (input.userId === ctx.session.user.id)
        throw new Error("You can't unfollow yourself");
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

  followers: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.user
        .findUnique({ where: { id: input.userId } })
        .followers();
    }),

  following: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.user
        .findUnique({ where: { id: input.userId } })
        .following();
    }),
});
