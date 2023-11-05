// Matej Pavlík
/* eslint-disable import/prefer-default-export */
import { pbkdf2 } from 'node:crypto';
import { promisify } from 'node:util';

export async function hashPassword(password, salt) {
    return (await promisify(pbkdf2)(password, salt, 100000, 64, 'sha256')).toString('hex');
}
