import { Router } from 'express';
import { createUser, loginUser } from '../handlers/user.js';
import { createValidation } from '../middlewares/validation.js';
import { loginSchema, registerSchema } from '../validations/guestSchemas.js';

const router = Router();

router.post('/login', createValidation(loginSchema), loginUser);
router.post('/register', createValidation(registerSchema), createUser);

export const guestRouter = router;
