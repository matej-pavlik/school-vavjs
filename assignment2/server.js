// Matej Pavlík
import express from 'express';
import { hashPassword } from './security.js';
import { createUser, getUserBy, getUserByLogin } from './users.js';

class AuthenticationError extends Error {}
class ValidationError extends Error {}

const PORT = 8080;
const app = express();

app.use(express.static('public'));
app.use(express.json());

function validateCreateUserRequest({ email, username, password, passwordConfirmation }) {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i; // Source: https://www.regular-expressions.info/email.html
    const usernameRegex = /^[a-zA-Z]+$/;

    [email, username, password, passwordConfirmation].forEach((val) => {
        if (typeof val !== 'string') {
            throw new ValidationError('Invalid or incomplete request');
        }
    });
    if (!emailRegex.test(email)) {
        throw new ValidationError('Invalid email');
    }
    if (getUserBy('email', email.toLowerCase())) {
        throw new ValidationError('Email already exists');
    }
    if (!usernameRegex.test(username)) {
        throw new ValidationError('Invalid username');
    }
    if (getUserBy('username', username)) {
        throw new ValidationError('Username already exists');
    }
    if (!password || !passwordConfirmation) {
        throw new ValidationError('Password or password confirmation is empty');
    }
    if (password !== passwordConfirmation) {
        throw new ValidationError('Passwords do not match');
    }
}

app.post('/login', (req, res, next) => {
    const { login, password } = req.body;

    async function asyncHandler() {
        // Guest user
        if (login === 'N/A' || login === '[N/A]') {
            res.send(await createUser({ isGuest: true }));
            return;
        }

        // eslint-disable-next-line no-restricted-syntax
        [login, password].forEach((val) => {
            if (typeof val !== 'string') {
                throw new ValidationError('Invalid or incomplete request');
            }
        });

        const $user = getUserByLogin(login, { withSensitiveData: true });
        if (!$user || $user.passwordHash !== (await hashPassword(password, $user.passwordSalt))) {
            throw new AuthenticationError('Invalid credentials');
        }

        res.send(getUserByLogin(login));
    }

    // Express (v4) doesn't catch async errors, so we need to pass them manually with next()
    asyncHandler().catch((err) => next(err));
});

app.post('/register', (req, res, next) => {
    const { email, username, password, passwordConfirmation } = req.body;
    validateCreateUserRequest({ email, username, password, passwordConfirmation });

    createUser({ email, username, password })
        .then((user) => res.send(user))
        .catch((err) => next(err));
});

// Error handling middleware
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    if (err instanceof AuthenticationError) {
        res.status(401).send({ message: err.message });
    } else if (err instanceof ValidationError) {
        res.status(400).send({ message: err.message });
    } else {
        res.status(500).send({ message: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
