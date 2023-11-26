import bcrypt from 'bcrypt';
import db from '../db/index.js';
import { AuthenticationError, ValidationError } from '../utils/errors.js';
import { createJWT, hashPassword } from '../utils/security.js';

export async function createUser(req, res, next) {
  const { email, username, password, age } = req.body;

  if (await db.user.findOneBy({ email })) {
    next(new ValidationError('Email already exists'));
    return;
  }
  if (await db.user.findOneBy({ username })) {
    next(new ValidationError('Username already exists'));
    return;
  }

  const user = await db.user.save({ email, username, password: await hashPassword(password), age });
  delete user.password;
  const token = await createJWT(user);

  res.json({ ...user, token });
}

export async function loginUser(req, res, next) {
  const { login, password } = req.body;
  // prettier-ignore
  const user = (await db.user.findOneBy({ email: login })) || (await db.user.findOneBy({ username: login }));

  if (!user || !(await bcrypt.compare(password, user.password))) {
    next(new AuthenticationError());
    return;
  }

  delete user.password;
  const token = await createJWT(user);

  res.json({ ...user, token });
}
