// Matej Pavlík
import { randomBytes, randomUUID } from 'node:crypto';
import { promisify } from 'node:util';
import { hashPassword } from './security.js';

const users = [];

export function getUserBy(property, value, { withSensitiveData = false } = {}) {
    const user = users.find((u) => {
        if (!Object.hasOwn(u, property)) {
            throw new Error(`Invalid user property '${property}'`);
        }

        return u[property] === value;
    });

    if (!user) {
        return null;
    }

    if (withSensitiveData) {
        return user;
    }

    const { id, token, isAdmin, email, username } = user;
    return { id, token, isAdmin, email, username };
}

export function getUserByLogin(login, { withSensitiveData = false } = {}) {
    return (
        getUserBy('email', login, { withSensitiveData }) ||
        getUserBy('username', login, { withSensitiveData })
    );
}

export async function createUser({ email, username, password, isAdmin = false }) {
    const id = randomUUID();
    const token = (await promisify(randomBytes)(256)).toString('hex');
    const passwordSalt = (await promisify(randomBytes)(16)).toString('hex');
    const passwordHash = await hashPassword(password, passwordSalt);

    users.push({ id, token, isAdmin, email, username, passwordHash, passwordSalt });

    return getUserBy('id', id);
}

createUser({ email: 'admin@example.com', username: 'admin', password: 'admin', isAdmin: true });
