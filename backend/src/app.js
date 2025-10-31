const express = require('express')
const cors = require("cors");

const profileRoutes = require("./routes/profileRoute");
const resumeRoutes = require("./routes/resumeRoute");

const app = express()
app.use(cors({
  origin: `${process.env.FRONTEND_URL}`, 
  credentials: true 
}));
app.use(express.json())

app.use("/profile", profileRoutes);
app.use("/resume", resumeRoutes);

module.exports = app