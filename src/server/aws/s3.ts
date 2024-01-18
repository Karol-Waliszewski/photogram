import { S3 } from "@aws-sdk/client-s3";
import { env } from "@/env";

export const s3 = new S3({
  region: env.AWS_REGION_KEY,
  credentials: {
    accessKeyId: env.AWS_KEY_ID,
    secretAccessKey: env.AWS_SECRET,
  },
});
