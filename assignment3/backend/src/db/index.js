import { DataSource } from 'typeorm';
import { hashPassword } from '../utils/security.js';
import { userSchema } from './entities.js';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: true, // TODO remove sync in production
  entities: [userSchema],
});

async function seed() {
  if (await dataSource.getRepository(userSchema).findOneBy({ username: 'admin' })) {
    return;
  }

  await dataSource.getRepository(userSchema).save({
    email: 'admin@example.com',
    username: 'admin',
    password: await hashPassword('admin'),
    age: 30,
  });
}

export default {
  user: dataSource.getRepository(userSchema),
  initialize: () => dataSource.initialize(),
  seed,
};
