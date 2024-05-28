const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");

const s3 = new S3Client({ region: process.env.AWS_REGION });

const s3bucket = {
  async get(bucket, key) {
    const params = {
      Bucket: bucket,
      Key: key,
    };
    try {
      const response = await s3.send(new GetObjectCommand(params));

      const objectBody = await response.Body.transformToString();

      return objectBody;
    } catch (err) {
      console.log(err);
      const message = `Error getting object ${key} from bucket ${bucket}. Make sure they exist and your bucket is in the same region as this function.`;
      console.log(message);
      throw new Error(message);
    }
  },
};
module.exports = s3bucket;
