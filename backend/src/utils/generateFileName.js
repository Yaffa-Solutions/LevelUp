const crypto = require("crypto");

const generateFileName = (originalName) => {
  const ext = originalName.split('.').pop();
  const unique = crypto.randomBytes(16).toString('hex');
  return `${unique}.${ext}`;
};

module.exports = { generateFileName };