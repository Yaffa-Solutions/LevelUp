const express = require("express");
const { upload } = require("../middleware/upload");
const { uploadProfilePicture } = require("../controllers/profileController");

const router = express.Router();

router.post("/upload-picture", upload.single("profilePicture"), uploadProfilePicture);

module.exports = router;
