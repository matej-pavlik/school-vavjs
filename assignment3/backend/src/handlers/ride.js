import db from '../db/index.js';

export async function createRide(req, res) {
  const { date, type, rideTypeId, value } = req.body;
  const { user } = req;

  const ride = db.ride.create({ date, type, value });
  ride.user = user;
  ride.rideTypeId = rideTypeId;
  res.json(await db.ride.save(ride));
}

export async function getUserRides(req, res) {
  const { user } = req;

  const rides = await db.ride.findBy({ user });
  res.json(rides);
}
