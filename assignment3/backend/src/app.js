import cors from 'cors';
import express from 'express';
import { errorMiddleware } from './middlewares/error.js';
import { protectMiddleware } from './middlewares/protect.js';
import { apiRouter } from './routers/api.js';
import { guestRouter } from './routers/guest.js';

const app = express();

app.use(cors());
app.use(express.static('public'));
app.use(express.json());

app.use('/', guestRouter);
app.use('/api', protectMiddleware, apiRouter);

app.all('*', (req, res) => {
  res.redirect('/');
});

app.use(errorMiddleware);

export default app;
