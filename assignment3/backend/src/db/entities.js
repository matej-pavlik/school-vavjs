import { EntitySchema } from 'typeorm';

export const userSchema = new EntitySchema({
  name: 'User',
  columns: {
    id: {
      primary: true,
      type: 'varchar',
      generated: 'uuid',
    },
    email: {
      unique: true,
      type: 'varchar',
    },
    username: {
      unique: true,
      type: 'varchar',
    },
    password: {
      type: 'varchar',
    },
    age: {
      type: 'int',
    },
  },
});
