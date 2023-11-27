import db from '../db/index.js';

export async function createRide(req, res) {
  const { date, type, rideTypeId, value } = req.body;
  const { user } = req;

  const ride = await db.ride.save({ date, type, value, rideTypeId, userId: user.id });
  res.json(ride);
}

export async function getUserRides(req, res) {
  const { user } = req;

  const rides = await db.ride.find({ userId: user.id });
  res.json(rides);
}
