import { EntitySchema } from 'typeorm';

const commonColumns = {
  id: {
    primary: true,
    type: 'uuid',
    generated: 'uuid',
  },
  createdAt: {
    type: 'timestamptz',
    createDate: true,
  },
};

export const userSchema = new EntitySchema({
  name: 'User',
  columns: {
    ...commonColumns,
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

export const rideSchema = new EntitySchema({
  name: 'Ride',
  columns: {
    ...commonColumns,
    date: {
      type: 'timestamptz',
    },
    type: {
      type: 'enum',
      enum: ['ROUTE', 'DURATION', 'CONSUMPTION'],
    },
    value: {
      type: 'decimal',
    },
  },
  relations: {
    user: {
      target: 'User',
      type: 'many-to-one',
      cascade: true,
    },
    rideType: {
      target: 'RideType',
      type: 'many-to-one',
      nullable: true, // TODO does this have any effect?
    },
  },
});

export const rideTypeSchema = new EntitySchema({
  name: 'RideType',
  columns: {
    ...commonColumns,
    name: {
      type: 'varchar',
    },
    description: {
      type: 'varchar',
    },
  },
});

export const advertisementSchema = new EntitySchema({
  name: 'Advertisement',
  columns: {
    ...commonColumns,
    imgHref: {
      type: 'varchar',
    },
    targetHref: {
      type: 'varchar',
    },
    counter: {
      type: 'int',
    },
  },
});
