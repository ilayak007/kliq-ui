/**
 * Util Class for the uploading to S3 bucket
 * 
 * @author Ilayaraja Kasirajan
 * @created [19-Feb-2025]
 * @lastModified [23-Feb-2025]
*/

import AWS from "aws-sdk";

// Initialize AWS S3 instance using environment variables for authentication and configuration
// The AWS S3 instance will be used for interacting with the S3 bucket (uploading files).
const s3 = new AWS.S3({
  accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!, // AWS Access Key ID from environment variables
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!, // AWS Secret Access Key from environment variables
  region: "us-east-1", // The region where the S3 bucket is located
});

/**
 * Utility function to upload a file to AWS S3
 * 
 * @param file - The file to be uploaded (File object)
 * @param imageKey - The key (path) where the file will be stored in the S3 bucket
 * 
 * @returns {Promise<string>} - The public URL of the uploaded file
 * 
 * This function converts the file into a binary format and uploads it to an AWS S3 bucket.
 * It returns the public URL of the uploaded file after a successful upload.
 */
export const uploadToS3 = async (file: File, imageKey: string): Promise<string> => {
  try {
    // Convert the file into an ArrayBuffer (binary data)
    const fileContent = await file.arrayBuffer(); 

    // S3 upload parameters including the target bucket, file key, body content, and content type
    const params = {
      Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!, // S3 Bucket name from environment variables
      Key: imageKey, // The key (path) of the file in the S3 bucket
      Body: Buffer.from(fileContent), // The file content as a Buffer
      ContentType: file.type, // MIME type of the file
      ACL: "public-read", // Access control setting to make the file publicly readable
    };

    // Upload the file to S3 using the parameters defined above
    const data = await s3.upload(params).promise();

    // Return the public URL of the uploaded file
    return `${process.env.NEXT_PUBLIC_AWS_S3_URL}/${data.Key}`; // S3 public URL based on the provided bucket URL
  } catch (error) {
    // Log the error if the upload fails
    console.error("Error uploading to S3:", error);
    throw new Error("Error uploading to S3"); // Throw an error to propagate failure
  }
};
