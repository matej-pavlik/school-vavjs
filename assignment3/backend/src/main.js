import 'dotenv/config.js';

import app from './app.js';

const PORT = process.env.SERVER_PORT;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
