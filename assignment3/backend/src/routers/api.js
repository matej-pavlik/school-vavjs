import { Router } from 'express';
import { createRide, getUserRides } from '../handlers/ride.js';
import { createValidation } from '../middlewares/validation.js';
import { rideCreateSchema } from '../validations/apiSchemas.js';

const router = Router();

router.get('/rides', getUserRides);
router.post('/rides', createValidation(rideCreateSchema), createRide);

export const apiRouter = router;
