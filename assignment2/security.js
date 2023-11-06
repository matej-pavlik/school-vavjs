// Matej Pavlík
/* eslint-disable import/prefer-default-export */
import { pbkdf2, randomBytes } from 'node:crypto';
import { promisify } from 'node:util';

export async function generateToken() {
    return (await promisify(randomBytes)(256)).toString('hex');
}

export async function generateSalt() {
    return (await promisify(randomBytes)(16)).toString('hex');
}

export async function hashPassword(password, salt) {
    return (await promisify(pbkdf2)(password, salt, 100000, 64, 'sha256')).toString('hex');
}
