import 'dotenv/config.js';

import express from 'express';
import { db } from './db/index.js';
import { apiRouter } from './routers/api.js';
import { guestRouter } from './routers/guest.js';

const PORT = 8080;
const app = express();

app.use(express.static('public'));
app.use(express.json());

app.use('/', guestRouter);
app.use('/api', apiRouter); // TODO protect middleware

await db.user.save({
  email: 'test@test.com',
  username: 'username',
  password: 'HASHED',
  age: 24,
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
