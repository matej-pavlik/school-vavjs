import { Router } from 'express';
import { createRide, deleteRide, getUserRides } from '../handlers/ride.js';
import { createRideType, deleteRideType, getUserRideTypes } from '../handlers/rideType.js';
import { getCurrentUser } from '../handlers/user.js';
import { createValidation } from '../middlewares/validation.js';
import {
  rideCreateSchema,
  rideDeleteSchema,
  rideTypeCreateSchema,
  rideTypeDeleteSchema,
} from '../validations/apiSchemas.js';

const router = Router();

router.get('/users/me', getCurrentUser);
router.get('/rides', getUserRides);
router.post('/rides', createValidation(rideCreateSchema), createRide);
router.delete('/rides/:id', createValidation(rideDeleteSchema), deleteRide);
router.get('/ride-types', getUserRideTypes);
router.post('/ride-types', createValidation(rideTypeCreateSchema), createRideType);
router.delete('/ride-types/:id', createValidation(rideTypeDeleteSchema), deleteRideType);

export const apiRouter = router;
