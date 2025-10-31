const express = require('express')
const app = express()
const profileRoutes = require('./routes/profile.route.js')

app.use(express.json())
app.use('/api/profiles', profileRoutes)


app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;