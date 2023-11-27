import 'dotenv/config.js';

import app from './app.js';
import db from './db/index.js';

await db.initialize();
await db.seed();

const PORT = process.env.SERVER_PORT;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
