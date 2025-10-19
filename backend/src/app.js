const express = require ('express');
const cors = require ('cors');
const talentRouter = require ('./routes/talent.routes.js');
const expRouter = require ('./routes/experiences.routes.js');
const skillsRouter = require ('./routes/skills.routes.js');
const uploadRouter = require ('./routes/upload.route.js')

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/talent', talentRouter);
app.use('/api/experiences', expRouter);
app.use('/api/skills', skillsRouter);
app.use('/api', uploadRouter);


app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
