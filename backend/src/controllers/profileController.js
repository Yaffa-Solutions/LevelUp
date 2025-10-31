const { updateProfilePicture } = require("../services/profileService");
const { s3 } = require("../config/S3");
const { generateFileName } = require("../utils/generateFileName");

const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const fileName = generateFileName(req.file.originalname);

    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileName,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };

    const data = await s3.upload(params).promise();

    const userId = req.body.userId;
    const updatedUser = await updateProfilePicture(userId, data.Location);

    res.json({
      message: "Profile picture uploaded successfully",
      url: data.Location,
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error uploading file" });
  }
};

module.exports = { uploadProfilePicture };
