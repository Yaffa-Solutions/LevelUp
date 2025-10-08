const express = require('express');
const cors = require('cors');
const session = require('express-session');
const oauthRoutes = require('./routes/oauthRoute');
const passport = require('./config/passport');
const sessionConfig = require('./config/session');

const authRoutes = require('./routes/authRoute');

const app = express();

app.use(cors());
app.use(express.json());
app.use(sessionConfig);
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);
app.use('/auth', oauthRoutes);

module.exports = app