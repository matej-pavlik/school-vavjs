import { ErrorPathScope } from '../constants/errorFormat.js';
import db from '../db/index.js';
import { ValidationError } from '../utils/errors.js';

export async function createRideType(req, res) {
  const { name, description } = req.body;
  const { user } = req;

  const { id } = await db.rideType.save({ name, description, user: { id: user.id } });

  res.json(await db.rideType.findOneBy({ id }));
}

export async function getUserRideTypes(req, res) {
  const { user } = req;
  const rideTypes = (await db.rideType.findBy({ user: { id: user.id } })).reverse();
  res.json(rideTypes);
}

export async function deleteRideType(req, res, next) {
  const { id } = req.params;
  const { user } = req;

  const validationError = new ValidationError('Invalid ride type id', {
    pathScope: ErrorPathScope.PARAMS,
    path: 'id',
  });

  await db.rideType
    .findOneByOrFail({ id, user: { id: user.id } })
    .then(async () => {
      await db.rideType.delete(id);
      res.json({});
    })
    .catch(() => {
      next(validationError);
    });
}
