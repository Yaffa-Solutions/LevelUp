const { parseResume } = require("../services/resumeParserService");

const uploadResume = async (req, res) =>{
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No file uploaded" });

    const parsedData = await parseResume(file.buffer, file.originalname);
    res.json(parsedData);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
}
module.exports = { uploadResume };