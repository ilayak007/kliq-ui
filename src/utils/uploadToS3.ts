import AWS from "aws-sdk";

// Initialize AWS S3 instance using environment variables
const s3 = new AWS.S3({
  accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
  region: "us-east-1",
});

// Utility function to upload a file to S3
export const uploadToS3 = async (file: File, imageKey: string): Promise<string> => {
  try {
    const fileContent = await file.arrayBuffer(); // Read file as binary data

    const params = {
      Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
      Key: imageKey,
      Body: Buffer.from(fileContent),
      ContentType: file.type,
      ACL: "public-read",
    };

    // Upload to S3
    const data = await s3.upload(params).promise();

    // Return the public URL of the uploaded file
    return `${process.env.NEXT_PUBLIC_AWS_S3_URL}/${data.Key}`;
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw new Error("Error uploading to S3");
  }
};
