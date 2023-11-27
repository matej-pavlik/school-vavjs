import { AuthenticationError } from '../utils/errors.js';
import { verifyJWT } from '../utils/security.js';

export async function protectMiddleware(req, res, next) {
  const bearer = req.headers.authorization;

  if (!bearer || !bearer.startsWith('Bearer ')) {
    next(new AuthenticationError());
    return;
  }

  const [, token] = bearer.split(' ');

  // eslint-disable-next-line consistent-return
  return verifyJWT(token)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch(() => {
      next(new AuthenticationError());
    });
}
