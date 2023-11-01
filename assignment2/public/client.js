// Matej Pavlík

'use strict';

// Idea weakmap h return objects to elements in render function have one global proxy with h objects and if h object changes rerender specific element

// https://stackoverflow.com/a/58983264

{
    const ALLOWED_ATTRS = {
        all: ['class', 'id'],
        input: ['placeholder'],
    };

    function getAllowedAttrs(tag) {
        return ALLOWED_ATTRS.all.concat(ALLOWED_ATTRS[tag] ?? []);
    }

    // TODO maybe rename, maybe WeakMap
    const map = new WeakMap();

    // TODO util
    function extractEntries(obj, callbackFilter) {
        return Object.entries(obj).filter(([key, value]) => callbackFilter(key, value));
    }

    function deepProxify(initialObj, onChange = () => {}) {
        const target = { ...initialObj, $isProxy: true };
        Object.entries(initialObj).forEach(([key, value]) => {
            if (value != null && typeof value === 'object') {
                target[key] = deepProxify(value, onChange);
            }
        });

        const handler = {
            // TODO maybe deleteProperty?
            set(obj, prop, value) {
                const prevValue = Reflect.get(...arguments);

                if (prevValue !== value && value != null && typeof value === 'object' && !value.$isProxy) {
                    Reflect.set(obj, prop, deepProxify(value, onChange));
                    onChange(prevValue, value);
                } else if (prevValue !== value) {
                    Reflect.set(obj, prop, value);
                    onChange(prevValue, value);
                }

                return true;
            },
        };

        return new Proxy(target, handler);
    }

    // Creates vnode
    function h({ type, props = {}, children = [] }) {
        // TODO return proxy
        return { type, props, children: Array.isArray(children) ? children : [children] };
    }

    function render(vnode) {
        const { type, props, children } = vnode;

        // Check if type is a component
        if (typeof type === 'function') {
            // TODO maybe slots (children) here also
            // TODO maybe pass just vnode
            // TODO
            const componentRenderFn = type.call(vnode, vnode);
            const elem = render(componentRenderFn());
            map.set(vnode, { elem, render: componentRenderFn });

            return elem;
        }

        const elem = document.createElement(type);
        map.set(vnode, { elem });

        const isListener = (key) => key.startsWith('on');
        const isAttribute = (key) => getAllowedAttrs(type).includes(key);

        // TODO onBeforeUnmount maybe async
        extractEntries(props, isListener).forEach(([eventProp, callback]) =>
            elem.addEventListener(eventProp.substring(2).toLowerCase(), callback),
        );
        extractEntries(props, isAttribute).forEach(([attr, value]) => {
            elem.setAttribute(attr, value);
        });

        children.forEach((child) => {
            if (typeof child === 'object' && child != null) {
                elem.append(render(child));
            } else {
                elem.append(child); // TODO is this correct naming? Text node
            }
        });

        return elem;
    }

    // TODO
    function rerender(vnode) {
        const vnodeValue = map.get(vnode);
        if (vnodeValue?.render) {
            console.log('rerendering'); // TODO comment, remove, maybe shorten mapvnode
            const newElem = render(vnodeValue.render()); // TODO render is probably not a good name
            vnodeValue.elem.replaceWith(newElem);
            vnodeValue.elem = newElem;
        }
    }

    // TODO remove that
    // TODO how to get rid of vnode and bind it automatically?
    function useSignal(initialValue, vnode) {
        // TODO remove
        console.log('useSignal this', this);

        const target = { value: initialValue };
        return deepProxify(target, (prev, curr) => {
            console.log('useSignal change', prev, curr);
            rerender(vnode);
        });
    }

    function FormComponent(vnode) {
        const { props } = vnode;
        // TODO remove
        const test = useSignal({ inner: { test: 'TESTING VALUE' } }, vnode);

        // TODO remove
        console.log('formComponent this', this);

        return () =>
            h({
                type: 'div',
                children: [
                    h({ type: 'h1', children: JSON.stringify(test.value) }),
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
                                test.value.inner.test = `NEW VALUE${Math.random()}`;
                            },
                        },
                        children: 'Test',
                    }),
                ],
            });
    }

    const test = h({ type: FormComponent, props: {} });

    // TODO maybe renderRoot
    document.body.append(render(test));

    // TODO remove
    test.props = { prop: 'new prop TEST' };
}
