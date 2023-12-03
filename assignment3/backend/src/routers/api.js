import { Router } from 'express';
import { createRide, deleteRide, getUserRides } from '../handlers/ride.js';
import { getCurrentUser } from '../handlers/user.js';
import { createValidation } from '../middlewares/validation.js';
import { rideCreateSchema, rideDeleteSchema } from '../validations/apiSchemas.js';

const router = Router();

router.get('/users/me', getCurrentUser);
router.get('/rides', getUserRides);
router.post('/rides', createValidation(rideCreateSchema), createRide);
router.delete('/rides/:id', createValidation(rideDeleteSchema), deleteRide);

export const apiRouter = router;
