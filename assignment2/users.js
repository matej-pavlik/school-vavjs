// Matej Pavlík
import { randomUUID } from 'node:crypto';
import { createGame } from './game.js';
import { generateSalt, generateToken, hashPassword } from './security.js';

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
    const { isActive, addConnection, removeConnection, sendEvent, ...game } = user.game;
    return { id, token, isAdmin, isGuest, email, username, game };
}

export function getUserByLogin(login, { withSensitiveData = false } = {}) {
    return (
        getUserBy('email', login.toLowerCase(), { withSensitiveData }) ||
        getUserBy('username', login, { withSensitiveData })
    );
}

export function getGameBy(property, value) {
    return (
        users.find((u) => {
            if (!Object.hasOwn(u.game, property)) {
                throw new Error(`Invalid game property '${property}'`);
            }

            return u.game[property] === value;
        })?.game ?? null
    );
}

export async function createUser({ email, username, password, isAdmin = false, isGuest = false }) {
    const id = randomUUID();
    const token = await generateToken();
    const passwordSalt = isGuest ? null : await generateSalt();
    const passwordHash = isGuest ? null : await hashPassword(password, passwordSalt);

    users.push({
        id,
        token,
        isAdmin,
        email: email?.toLowerCase() ?? null, // null if guest
        username: username ?? null, // null if guest
        passwordHash,
        passwordSalt,
        game: await createGame(),
    });

    return getUserBy('id', id);
}

createUser({ email: 'admin@example.com', username: 'admin', password: 'admin', isAdmin: true });
