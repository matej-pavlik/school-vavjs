import db from '../db/index.js';

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

  res.json(await db.ride.findOneBy({ id }));
}

export async function getUserRides(req, res) {
  const { user } = req;

  const rides = await db.ride.findBy({ user: { id: user.id } });
  res.json(rides);
}
