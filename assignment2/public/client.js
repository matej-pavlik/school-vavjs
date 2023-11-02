// Matej Pavlík

'use strict';

(async () => {
    // eslint-disable-next-line import/extensions
    const { createApp, h, useStore } = await import('./clientLibrary.js');

    function FormComponent({ props }) {
        const test = useStore({ inner: { test: 'TESTING VALUE' } });

        return () =>
            h({
                type: 'div',
                children: [
                    h({ type: 'h1', children: JSON.stringify(test) }),
                    h({ type: 'h1', children: JSON.stringify(props) }),
                    h({ type: 'input', props: { placeholder: 'Email/login' } }),
                    h({ type: 'input', props: { placeholder: 'Password' } }),
                    h({
                        type: 'button',
                        props: { onClick: () => console.log('Log in!') },
                        children: 'Log in',
                    }),
                    h({
                        type: 'button',
                        props: {
                            onClick: () => {
                                test.inner.test = `HELLO${Math.random()}`;
                            },
                        },
                        children: 'Test',
                    }),
                ],
            });
    }

    const rootVnode = h({ type: FormComponent });
    createApp(rootVnode);
})();
