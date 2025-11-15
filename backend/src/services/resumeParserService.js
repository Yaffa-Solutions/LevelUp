const { Blob } = require("node:buffer");
const { FormData, File }= require("formdata-node"); 
const fs = require("fs");

const parseResume = async (fileBuffer, originalName) =>{
  if (!fileBuffer) {
    throw new Error("No file buffer provided");
  }

  const apiKey = process.env.HIREPARSE_API_KEY;
  if (!apiKey) {
    throw new Error("HireParse API key is missing");
  }

  const form = new FormData();

  const blob = new Blob([fileBuffer], { type: "application/pdf" });
  form.append("resume", blob, originalName);

  const response = await fetch("https://api.hireparse.com/v1/resumes/parse-file", {
// const response = await fetch("https://api.apilayer.com/resume_parser", {

    method: "POST",
    headers: {
      "x-api-key": apiKey,
    },
    body: form
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`HireParse API error: ${response.status} ${text}`);
  }

  const data = await response.json();
  return data;
}

module.exports = { parseResume };
