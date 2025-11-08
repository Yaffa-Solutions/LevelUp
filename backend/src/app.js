const express = require('express');
const cors = require('cors');
const session = require('express-session');
const oauthRoutes = require('./routes/oauthRoute');
const passport = require('./config/passport');
const sessionConfig = require('./config/session');

const authRoutes = require('./routes/authRoute');
const userRoutes = require('./routes/userRoute');
const postsRoutes = require('./routes/postsRoute');
const postReactionRoutes = require('./routes/postReactionRoute');
const planRoutes = require('./routes/planRoute');
const jobRoutes = require('./routes/jobRoute');
const levelRoutes = require('./routes/levelRoute');
const profileRoutes = require("./routes/profileRoute");
const resumeRoutes = require("./routes/resumeRoute");
const createprofileRoutes = require('./routes/createprofileRoute');
const experienceRoutes = require('./routes/experienceRoute');
const skillsRouteres = require ('./routes/skillsRoute');
const cookieParser = require('cookie-parser');

const app = express();

app.use(cors({
  origin:`${process.env.FRONTEND_URL}`, 
  credentials: true 
}));
app.use(express.json());
app.use(cookieParser());
app.use(sessionConfig);
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);
app.use('/auth', oauthRoutes);
app.use('/user',userRoutes);
app.use('/posts', postsRoutes);
app.use('/post-reaction', postReactionRoutes);
app.use('/plans', planRoutes)
app.use('/jobs', jobRoutes);
app.use('/levels', levelRoutes);
app.use("/profile", profileRoutes);
app.use("/resume", resumeRoutes);
app.use('/profile', createprofileRoutes);
app.use('/experiences', experienceRoutes);
app.use('/skills', skillsRouteres);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});
module.exports = app
