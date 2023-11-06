// Matej Pavlík
/* eslint-disable no-use-before-define */

'use strict';

(async () => {
    const { createApp, h, onMounted, useSignal } = await import('./clientLibrary.js');

    async function addStyles() {
        const sheet = new CSSStyleSheet();
        await sheet.replace(`
            .column { display: flex; flex-direction: column; align-items: flex-start; }
            .error { color: red; }
        `);
        document.adoptedStyleSheets = [sheet];
    }

    const app = createApp();
    await addStyles();
    app.renderPage(LoginPage);

    function useFetch(url) {
        let controller = new AbortController();

        const isLoading = useSignal(false);
        const errorMsg = useSignal(null);
        const data = useSignal(null);

        function reset() {
            if (isLoading.value) {
                controller.abort();
                controller = new AbortController();
            }

            isLoading.value = false;
            errorMsg.value = null;
            data.value = null;
        }

        async function execute({ method = 'GET', body = {} } = {}) {
            reset();
            isLoading.value = true;

            const response = await fetch(url, {
                method,
                signal: controller.signal,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                data.value = await response.json();
            } else {
                errorMsg.value = (await response.json()).message;
            }

            isLoading.value = false;
            return response;
        }

        return { isLoading, data, errorMsg, execute };
    }

    function InputComponent({ props: { placeholder, type = 'text', value, onInput } }) {
        return () =>
            h({
                type: 'input',
                props: {
                    autocomplete: 'new-password', // Disables autocomplete in Chrome
                    placeholder,
                    type,
                    value,
                    onInput: (e) => onInput(e.target.value),
                },
            });
    }

    function InfoComponent({ props: { label, value, id, type = null } }) {
        return () =>
            h({
                type: type ?? 'div',
                children: [
                    h({ type: 'span', children: `${label}: ` }),
                    h({ type: 'span', props: { id }, children: value }),
                ],
            });
    }

    function LoginPage() {
        const form = { login: null, password: null };
        const { isLoading, data, errorMsg, execute } = useFetch('/login');

        return () =>
            h({
                type: 'div',
                props: { className: 'column' },
                children: [
                    h({ type: 'h1', children: 'Log in' }),
                    h({
                        type: InputComponent,
                        props: {
                            placeholder: 'Email/username',
                            value: form.login,
                            onInput: (val) => (form.login = val),
                        },
                    }),
                    h({
                        type: InputComponent,
                        props: {
                            placeholder: 'Password',
                            type: 'password',
                            value: form.password,
                            onInput: (val) => (form.password = val),
                        },
                    }),
                    h({ type: 'div', props: { className: 'error' }, children: errorMsg.value }),
                    h({
                        type: 'button',
                        props: {
                            className: 'block',
                            disabled: isLoading.value,
                            onClick: async () => {
                                await execute({ method: 'POST', body: form });
                                if (!errorMsg.value) {
                                    app.renderPage(GamePage, { props: { user: data.value } });
                                }
                            },
                        },
                        children: 'Log in',
                    }),
                    h({
                        type: 'button',
                        props: { onClick: () => app.renderPage(RegisterPage) },
                        children: 'Register',
                    }),
                ],
            });
    }

    function RegisterPage() {
        const form = { email: null, username: null, password: null, passwordConfirmation: null };
        const { isLoading, data, errorMsg, execute } = useFetch('/register');

        return () =>
            h({
                type: 'div',
                props: { className: 'column' },
                children: [
                    h({ type: 'h1', children: 'Register' }),
                    h({
                        type: InputComponent,
                        props: {
                            placeholder: 'Email',
                            type: 'email',
                            value: form.email,
                            onInput: (val) => (form.email = val),
                        },
                    }),
                    h({
                        type: InputComponent,
                        props: {
                            placeholder: 'Username',
                            value: form.username,
                            onInput: (val) => (form.username = val),
                        },
                    }),
                    h({
                        type: InputComponent,
                        props: {
                            placeholder: 'Password',
                            type: 'password',
                            value: form.password,
                            onInput: (val) => (form.password = val),
                        },
                    }),
                    h({
                        type: InputComponent,
                        props: {
                            placeholder: 'Password confirmation',
                            type: 'password',
                            value: form.passwordConfirmation,
                            onInput: (val) => (form.passwordConfirmation = val),
                        },
                    }),
                    h({ type: 'div', props: { className: 'error' }, children: errorMsg.value }),
                    h({
                        type: 'button',
                        props: {
                            disabled: isLoading.value,
                            onClick: async () => {
                                await execute({ method: 'POST', body: form });
                                if (!errorMsg.value) {
                                    app.renderPage(GamePage, { props: { user: data.value } });
                                }
                            },
                        },
                        children: 'Register',
                    }),
                    h({
                        type: 'button',
                        props: { onClick: () => app.renderPage(LoginPage) },
                        children: 'Back to login',
                    }),
                ],
            });
    }

    function GamePage({ props: { user } }) {
        let socket = null;
        let changeTrainImage = null;

        function sendEvent(type) {
            fetch(`/game/${user.game.controlToken}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type }),
            });
        }

        function keyboardListener({ code }) {
            // Blurs focused buttons so that when pressing enter, it doesn't trigger button click event
            document.activeElement.blur();

            if (code === 'Enter') {
                sendEvent('ENTER');
            } else if (code === 'KeyW' || code === 'ArrowUp') {
                sendEvent('UP');
            } else if (code === 'KeyS' || code === 'ArrowDown') {
                sendEvent('DOWN');
            } else if (code === 'KeyA' || code === 'ArrowLeft') {
                sendEvent('LEFT');
            } else if (code === 'KeyD' || code === 'ArrowRight') {
                sendEvent('RIGHT');
            }
        }

        window.addEventListener('keydown', keyboardListener);

        onMounted((elem) => {
            const GAME_WIDTH = 80;
            const GAME_HEIGHT = 40;
            const CELL_WIDTH = 12.8;
            const CELL_HEIGHT = 9.8;

            const canvas = elem.querySelector('canvas');
            const ctx = canvas.getContext('2d', { alpha: false });

            canvas.width = GAME_WIDTH * CELL_WIDTH;
            canvas.height = GAME_HEIGHT * CELL_HEIGHT;

            const imagesCache = {};

            function loadImage(src) {
                const img = new Image();

                return {
                    img,
                    promise: new Promise((resolve, reject) => {
                        img.onload = () => resolve(img);
                        img.onerror = reject;
                        img.src = src;
                    }),
                };
            }

            async function getImage(imageUrl) {
                if (imagesCache[imageUrl]) {
                    return imagesCache[imageUrl].img;
                }

                const image = loadImage(imageUrl);
                imagesCache[imageUrl] = image;
                await image.promise;
                return image.img;
            }

            async function renderCells(cells) {
                await getImage(cells[0].image);

                const loadedCells = await Promise.all(
                    cells.map(async ({ x, y, image: imageUrl }) => ({
                        x,
                        y,
                        image: await getImage(imageUrl),
                    })),
                );

                loadedCells.forEach(({ x, y, image }) => {
                    ctx.drawImage(image, x * CELL_WIDTH, y * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
                });
            }

            function updateInfo({ count, speed, bestSpeed, score, bestScore }) {
                elem.querySelector('#count').textContent = count;
                elem.querySelector('#speed').textContent = speed;
                elem.querySelector('#score').textContent = score;
                elem.querySelector('#best-speed').textContent = bestSpeed;
                elem.querySelector('#best-score').textContent = bestScore;
            }

            function changeTrainFn() {
                const type = elem.querySelector('#select').value;

                if (!type) {
                    return;
                }

                fetch(`/game/${user.game.controlToken}/image`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ type }),
                });
            }

            changeTrainImage = changeTrainFn;

            socket = new WebSocket(`ws://localhost:8082?gameId=${user.game.id}`);
            socket.addEventListener('message', async (messageEvent) => {
                const { event, data } = JSON.parse(messageEvent.data);

                if (event === 'GAME_CELLS_UPDATE') {
                    await renderCells(data);
                } else if (event === 'GAME_INFO_UPDATE') {
                    updateInfo(data);
                }
            });
        });

        return () =>
            h({
                type: 'div',
                props: { className: 'column' },
                children: [
                    h({ type: 'h1', children: 'Game' }),
                    h({ type: 'canvas' }),
                    h({
                        type: InfoComponent,
                        props: { label: 'Count', value: '5', id: 'count', type: 'h2' },
                    }),
                    h({ type: InfoComponent, props: { label: 'Speed', value: '1000', id: 'speed' } }),
                    h({ type: InfoComponent, props: { label: 'Score', value: '0', id: 'score' } }),
                    h({
                        type: InfoComponent,
                        props: { label: 'Best speed', value: user.game.bestSpeed, id: 'best-speed' },
                    }),
                    h({
                        type: InfoComponent,
                        props: { label: 'Best score', value: user.game.bestScore, id: 'best-score' },
                    }),
                    h({
                        type: 'div',
                        children: [
                            h({
                                type: 'select',
                                props: { id: 'select' },
                                children: [
                                    h({ type: 'option', props: { value: '' }, children: 'Choose image' }),
                                    h({ type: 'option', props: { value: 'RED' }, children: 'Red' }),
                                    h({ type: 'option', props: { value: 'ORANGE' }, children: 'Orange' }),
                                ],
                            }),
                            h({
                                type: 'button',
                                props: {
                                    onClick: () => changeTrainImage?.(),
                                },
                                children: 'Change train image',
                            }),
                        ],
                    }),
                    h({
                        type: 'button',
                        props: {
                            onClick: () => {
                                socket?.close();
                                window.removeEventListener('keydown', keyboardListener);
                                app.renderPage(LoginPage);
                            },
                        },
                        children: 'Log out',
                    }),
                ],
            });
    }
})();
