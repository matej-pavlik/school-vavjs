import { ErrorPathScope } from '../constants/errorFormat.js';
import db from '../db/index.js';
import { ValidationError } from '../utils/errors.js';

export async function createRide(req, res) {
  const { date, type, rideTypeId, value } = req.body;
  const { user } = req;

  const { id } = await db.ride.save({
    date,
    type,
    value,
    user: { id: user.id },
    rideType: { id: rideTypeId ?? null },
  });

  res.json(
    await db.ride.findOne({
      where: { id },
      relations: { rideType: true },
    }),
  );
}

export async function getUserRides(req, res) {
  const { user } = req;
  res.json(
    (
      await db.ride.find({
        where: { user: { id: user.id } },
        relations: { rideType: true },
      })
    ).reverse(),
  );
}

export async function deleteRide(req, res, next) {
  const { id } = req.params;
  const { user } = req;

  const validationError = new ValidationError('Invalid ride id', {
    pathScope: ErrorPathScope.PARAMS,
    path: 'id',
  });

  await db.ride
    .findOneByOrFail({ id, user: { id: user.id } })
    .then(async () => {
      await db.ride.delete(id);
      res.json({});
    })
    .catch(() => {
      next(validationError);
    });
}
