const { S3Client } = require("@aws-sdk/client-s3")

// s3 config
const s3Client = new S3Client({
    region: process.env.AWS_BUCKET_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_ID,
        secretAccessKey: process.env.AWS_ACCESS_SECRET
    }
})

module.exports = s3Client