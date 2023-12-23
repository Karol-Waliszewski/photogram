import { z } from "zod";
import { env } from "@/env";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const postRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        description: z.string(),
        images: z.array(z.string()),
      }),
    )
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
      return await ctx.db.$transaction(async (prisma) => {
        // Check if the post exists and if the user is the creator of the post
        await prisma.post.findUniqueOrThrow({
          where: {
            id: input.postId,
            createdById: ctx.session.user.id,
          },
        });

        // Fetch all image URLs associated with the post
        const postImageUrls = await prisma.image
          .findMany({
            where: {
              postId: input.postId,
            },
            select: {
              src: true,
            },
          })
          .then((images) => images.map((image) => image.src));

        // Fetch all image URLs that are duplicates of the post's image URLs
        const duplicateImageUrls = await prisma.image
          .findMany({
            where: {
              src: {
                in: postImageUrls,
              },
              NOT: {
                postId: input.postId,
              },
            },
            select: {
              src: true,
            },
          })
          .then((images) => images.map((image) => image.src));

        // Filter out post image URLs that are duplicates
        const uniquePostImageUrls = postImageUrls.filter(
          (url) => !duplicateImageUrls.includes(url),
        );

        await Promise.all([
          prisma.image.deleteMany({
            where: { postId: input.postId },
          }),
          prisma.comment.deleteMany({
            where: { postId: input.postId },
          }),
        ]);

        await prisma.post.delete({
          where: { id: input.postId },
        });

        // Delete images from S3
        if (uniquePostImageUrls.length > 0)
          await ctx.s3.deleteObjects({
            Bucket: env.AWS_BUCKET_NAME,
            Delete: {
              Objects: uniquePostImageUrls.map((url) => ({
                // Example of image url: https://kw-photogram.s3.eu-central-1.amazonaws.com/398310840_1416191592614860_5892750325849203067_n.jpg
                Key: url.split("amazonaws.com/")[1]!,
              })),
            },
          });
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
      return ctx.db.comment.findMany({
        where: { postId: input.postId },
        include: { createdBy: true },
      });
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
