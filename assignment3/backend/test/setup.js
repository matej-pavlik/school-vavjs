import 'dotenv/config.js';

import { TransactionalTestContext } from 'typeorm-transactional-tests';
import db from '../src/db/index.js';

let connection;
let transactionalContext;

/**
 * Setup a transaction for each test so we don't permanently save data
 * to the database and can rerun the tests again.
 */
export const mochaHooks = {
  async beforeEach() {
    connection = await db.initialize();
    transactionalContext = new TransactionalTestContext(connection);
    await transactionalContext.start();
  },

  async afterEach() {
    await transactionalContext.finish();
    await connection.destroy();
  },
};
