const express = require("express");
const { join } = require("path");
const  config  = require("./config");
const routes = require("./routes");
const { errorHandler } = require("./middleware/error.middleware");
const cors = require('cors');

const userRouter = require ('./routes/user.routes.js');
const expRouter = require ('./routes/experiences.routes.js');
const skillsRouter = require ('./routes/skills.routes.js');
const uploadRouter = require('./routes/upload.route.js');
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
const cookieParser = require('cookie-parser');

const app = express();

app.use(cors({
  origin:`${process.env.FRONTEND_URL}`, 
  credentials: true 
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, './public')));
app.use(cookieParser());
app.use(sessionConfig);
app.use(passport.initialize());
app.use(passport.session());


app.use('/api/user', userRouter);
app.use('/api/experiences', expRouter);
app.use('/api/skills', skillsRouter);
app.use('/api', uploadRouter);

app.use('/auth', authRoutes);
app.use('/auth', oauthRoutes);
app.use('/user',userRoutes);
app.use('/posts', postsRoutes);
app.use('/post-reaction', postReactionRoutes);
app.use('/plans', planRoutes)
app.use('/jobs', jobRoutes);
app.use('/levels', levelRoutes);

app.use(routes);
app.use(errorHandler);

app.use((err, req, res, next) => {
  console.error('Server Error:', err);

  const status = err.status || 500;
  const message =
    status === 500
      ? 'Something went wrong on our side. Please try again later.'
      : err.message;

  res.status(status).json({
    success: false,
    message,
  });
});

app.set('port', config.app.port || 5000);

module.exports = app;
