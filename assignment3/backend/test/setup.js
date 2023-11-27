import 'dotenv/config.js';

import { TransactionalTestContext } from 'typeorm-transactional-tests';
import db from '../src/db/index.js';
import { hashPassword } from '../src/utils/security.js';

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
    await db.user.save({
      email: 'test@example.com',
      username: 'testusername',
      password: await hashPassword('testpassword'),
      age: 40,
    });
  },

  async afterEach() {
    await transactionalContext.finish();
    await connection.destroy();
  },
};
