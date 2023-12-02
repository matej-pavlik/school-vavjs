import { Router } from 'express';
import { createRide, getUserRides } from '../handlers/ride.js';
import { getCurrentUser } from '../handlers/user.js';
import { createValidation } from '../middlewares/validation.js';
import { rideCreateSchema } from '../validations/apiSchemas.js';

const router = Router();

router.get('/users/me', getCurrentUser);
router.get('/rides', getUserRides);
router.post('/rides', createValidation(rideCreateSchema), createRide);

export const apiRouter = router;
