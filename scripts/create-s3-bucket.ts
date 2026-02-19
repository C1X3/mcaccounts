/**
 * Creates the S3/MinIO bucket if it doesn't exist.
 * Run: pnpm tsx scripts/create-s3-bucket.ts
 */
import "dotenv/config";
import { CreateBucketCommand, HeadBucketCommand } from "@aws-sdk/client-s3";
import { S3Client } from "@aws-sdk/client-s3";

const endpoint = process.env.NEXT_PUBLIC_MINIO_ENDPOINT;
const accessKey = process.env.MINIO_ACCESS_KEY_ID;
const secretKey = process.env.MINIO_SECRET_ACCESS_KEY;
const bucket = process.env.DATA_BUCKET;
const region = process.env.MINIO_REGION || "us-east-1";

if (!endpoint || !accessKey || !secretKey || !bucket) {
  console.error("Missing env: NEXT_PUBLIC_MINIO_ENDPOINT, MINIO_ACCESS_KEY_ID, MINIO_SECRET_ACCESS_KEY, DATA_BUCKET");
  process.exit(1);
}

const client = new S3Client({
  endpoint,
  region,
  credentials: { accessKeyId: accessKey, secretAccessKey: secretKey },
  forcePathStyle: true,
});

async function main() {
  try {
    await client.send(new HeadBucketCommand({ Bucket: bucket }));
    console.log(`Bucket "${bucket}" already exists.`);
  } catch (err: unknown) {
    const code = err && typeof err === "object" && "name" in err ? (err as { name?: string }).name : null;
    const isNotFound = code === "NotFound" || code === "NoSuchBucket";
    if (isNotFound) {
      await client.send(new CreateBucketCommand({ Bucket: bucket }));
      console.log(`Bucket "${bucket}" created.`);
    } else {
      throw err;
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
