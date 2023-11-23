import { DataSource } from 'typeorm';
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

export default {
  user: dataSource.getRepository(userSchema),
  initialize: () => dataSource.initialize(),
};
