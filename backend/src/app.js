const express = require('express')

const cors = require("cors");
// const profileRoute = require('./routes/profile.route.js')

const profileRoutes = require("./routes/profileRoute");
const resumeRoutes = require("./routes/resumeRoute");

const app = express()
app.use(cors({
  origin: `${process.env.FRONTEND_URL}`, 
  credentials: true 
}));
app.use(express.json())

// app.use('/api/profiles', profileRoute)
app.use("/profile", profileRoutes);
app.use("/resume", resumeRoutes);
// app.listen(5000, () => console.log('port 3000'))
module.exports = app