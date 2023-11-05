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

        return u[property] === (property === 'email' ? value.toLowerCase() : value);
    });

    if (!user) {
        return null;
    }

    if (withSensitiveData) {
        return user;
    }

    const { id, token, isAdmin, isGuest, email, username } = user;
    return { id, token, isAdmin, isGuest, email, username };
}

export function getUserByLogin(login, { withSensitiveData = false } = {}) {
    return (
        getUserBy('email', login.toLowerCase(), { withSensitiveData }) ||
        getUserBy('username', login, { withSensitiveData })
    );
}

export async function createUser({ email, username, password, isAdmin = false, isGuest = false }) {
    const id = randomUUID();
    const token = (await promisify(randomBytes)(256)).toString('hex');
    const passwordSalt = isGuest ? null : (await promisify(randomBytes)(16)).toString('hex');
    const passwordHash = isGuest ? null : await hashPassword(password, passwordSalt);

    users.push({
        id,
        token,
        isAdmin,
        email: email?.toLowerCase() ?? null, // null if guest
        username: username ?? null, // null if guest
        passwordHash,
        passwordSalt,
    });

    return getUserBy('id', id);
}

createUser({ email: 'admin@example.com', username: 'admin', password: 'admin', isAdmin: true });
