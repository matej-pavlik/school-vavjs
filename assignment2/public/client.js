// Matej Pavlík
/* eslint-disable no-use-before-define */

'use strict';

(async () => {
    const { createApp, h, useSignal } = await import('./clientLibrary.js');

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
                                    app.renderPage(UserPage, { props: data.value });
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
                                    app.renderPage(UserPage, { props: data.value });
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

    function UserPage({ props }) {
        return () =>
            h({
                type: 'div',
                children: [
                    JSON.stringify(props),
                    h({
                        type: 'button',
                        props: {
                            onClick: () => {
                                app.renderPage(LoginPage);
                            },
                        },
                        children: 'Log out',
                    }),
                ],
            });
    }
})();
