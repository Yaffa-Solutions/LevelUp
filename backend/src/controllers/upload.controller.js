const { S3Client, PutObjectCommand}  = require ('@aws-sdk/client-s3');

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
},
});
const uploadImage = async (req, res, next) => {
  try {
    const file = req.file;
    const fileName = `${Date.now()}-${file.originalname}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `profile-pictures/${fileName}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await s3.send(command);
    const url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/profile-pictures/${fileName}`;
    res.json({ url });
  } catch (err) {
    next(err);
  }
};

module.exports = { uploadImage };
