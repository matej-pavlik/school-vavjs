import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

export async function createJWT({ id, email, username, age }) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { user: { id, email, username, age } },
      process.env.JWT_SECRET,
      { expiresIn: '1y' },
      (err, token) => {
        if (err) {
          reject(err);
        } else {
          resolve(token);
        }
      },
    );
  });
}

export async function verifyJWT(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded.user);
      }
    });
  });
}
