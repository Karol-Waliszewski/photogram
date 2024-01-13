import { z } from "zod";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { DetectLabelsCommand } from "@aws-sdk/client-rekognition";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { env } from "@/env";

export const storageRouter = createTRPCRouter({
  getSignedUrl: protectedProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { key } = input;
      const { s3 } = ctx;

      const putObjectCommand = new PutObjectCommand({
        Bucket: env.AWS_BUCKET_NAME,
        Key: key,
      });

      return getSignedUrl(s3, putObjectCommand);
    }),

  getImageAlt: protectedProcedure
    .input(z.object({ imageUrl: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const result = await ctx.rekognition.send(
          new DetectLabelsCommand({
            Image: {
              S3Object: {
                Bucket: env.AWS_BUCKET_NAME,
                Name: input.imageUrl,
              },
            },
            MaxLabels: 5,
            MinConfidence: 80,
          }),
        );
        return result.Labels?.map((label) => label.Name).join(", ") ?? "";
      } catch (error) {
        console.error(error);
        throw new Error("Failed to generate image alt");
      }
    }),
});
