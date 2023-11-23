import express from 'express';
import { apiRouter } from './routers/api.js';
import { guestRouter } from './routers/guest.js';

const app = express();

app.use(express.static('public'));
app.use(express.json());

app.use('/', guestRouter);
app.use('/api', apiRouter); // TODO protect middleware

export default app;
