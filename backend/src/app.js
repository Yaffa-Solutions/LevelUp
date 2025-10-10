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
const planRoutes = require('./routes/planRoute')

const app = express();

app.use(cors());
app.use(express.json());
app.use(sessionConfig);
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);
app.use('/auth', oauthRoutes);
app.use('/user',userRoutes);
app.use('/posts', postsRoutes);
app.use('/post-reaction', postReactionRoutes);
app.use('/plans', planRoutes)

module.exports = app