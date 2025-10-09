import express from 'express';
import cors from 'cors';
import talentRouter from './routes/talent.routes.js';
import expRouter from './routes/experiences.routes.js';
import skillsRouter from './routes/skills.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/talent', talentRouter);
app.use('/api/experiences', expRouter);
app.use('/api/skills', skillsRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;
