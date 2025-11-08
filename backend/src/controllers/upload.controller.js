const { PutObjectCommand } = require('@aws-sdk/client-s3');
const { s3 } = require('../config/s3');

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
