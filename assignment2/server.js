// Matej Pavlík
import express from 'express';
import { WebSocketServer } from 'ws';
import { hashPassword } from './security.js';
import { createUser, getGameBy, getUserBy, getUserByLogin } from './users.js';

class AuthenticationError extends Error {}
class AuthorizationError extends Error {}
class ValidationError extends Error {}

const PORT = 8080;
const app = express();

const WS_PORT = 8082;
const WS_PING_INTERVAL = 30000;
const wss = new WebSocketServer({ port: WS_PORT });

app.use(express.static('public'));
app.use(express.json());
app.use('/game/:controlToken', (req, res, next) => {
    const { controlToken } = req.params;

    if (!controlToken) {
        throw new ValidationError('Invalid or incomplete request');
    }

    const game = getGameBy('controlToken', controlToken);
    if (!game) {
        throw new AuthorizationError('Insufficient rights');
    }

    next();
});

function validateCreateUserRequest({ email, username, password, passwordConfirmation }) {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i; // Source: https://www.regular-expressions.info/email.html
    const usernameRegex = /^[a-zA-Z]+$/;

    [email, username, password, passwordConfirmation].forEach((val) => {
        if (typeof val !== 'string') {
            throw new ValidationError('Invalid request');
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

app.put('/game/:controlToken', (req, res) => {
    const { controlToken } = req.params;
    const { type } = req.body;

    if (!['ENTER', 'UP', 'DOWN', 'LEFT', 'RIGHT'].includes(type)) {
        throw new ValidationError('Invalid request');
    }

    getGameBy('controlToken', controlToken).sendEvent({ type });
    res.send({ success: true });
});

app.put('/game/:controlToken/image', (req, res) => {
    const { controlToken } = req.params;
    const { type } = req.body;

    if (!['RED', 'ORANGE'].includes(type)) {
        throw new ValidationError('Invalid request');
    }

    getGameBy('controlToken', controlToken).changeTrainImage({ type });
    res.send({ success: true });
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

wss.on('listening', () => {
    console.log(`WebSocket server listening on port ${WS_PORT}`);
});

wss.on('connection', (ws, req) => {
    let isAlive = true;

    const params = new URLSearchParams(req.url.split('?')[1]);
    const gameId = params.get('gameId');

    const game = getGameBy('id', gameId);

    if (!game) {
        ws.close();
        return;
    }

    game.addConnection(ws);

    const interval = setInterval(() => {
        if (isAlive) {
            isAlive = false;
            ws.ping();
        } else {
            ws.terminate();
        }
    }, WS_PING_INTERVAL);

    function onClose() {
        clearInterval(interval);
        game.removeConnection(ws);
    }

    ws.on('error', onClose);
    ws.on('close', onClose);
    ws.on('pong', () => {
        isAlive = true;
    });
});
