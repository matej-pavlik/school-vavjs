// Matej Pavlík
// Custom UI library

const vnodeMap = new WeakMap();
let currentContext = null;

// Util
function extractEntries(obj, callbackFilter) {
    return Object.entries(obj).filter(([key, value]) => callbackFilter(key, value));
}

function getAllowedAttrs(tag) {
    const ALLOWED_ATTRS = {
        all: ['class', 'id'],
        input: ['placeholder'],
    };

    return ALLOWED_ATTRS.all.concat(ALLOWED_ATTRS[tag] ?? []);
}

function deepProxify(initialObj, onChange = () => {}) {
    const target = { ...initialObj, $isProxy: true };
    Object.entries(initialObj).forEach(([key, value]) => {
        if (value != null && typeof value === 'object') {
            target[key] = deepProxify(value, onChange);
        }
    });

    const handler = {
        set(targetObj, prop, value) {
            const prevValue = Reflect.get(...arguments);

            if (prevValue !== value && value != null && typeof value === 'object' && !value.$isProxy) {
                Reflect.set(targetObj, prop, deepProxify(value, onChange));
                onChange(prevValue, value);
            } else if (prevValue !== value) {
                Reflect.set(targetObj, prop, value);
                onChange(prevValue, value);
            }

            return true;
        },

        deleteProperty(targetObj, prop) {
            const prevValue = Reflect.get(...arguments);

            if (prop in targetObj) {
                Reflect.deleteProperty(targetObj, prop);
                onChange(prevValue, undefined);
            }

            return true;
        },
    };

    return new Proxy(target, handler);
}

function createComponentContext(vnode) {
    function $useSignal(initialValue) {
        // eslint-disable-next-line no-use-before-define
        return deepProxify({ value: initialValue }, () => rerender(vnode));
    }

    function $useStore(initialValue) {
        if (typeof initialValue !== 'object' || initialValue == null) {
            throw Error('useStore initialValue must be an object');
        }
        // eslint-disable-next-line no-use-before-define
        return deepProxify(initialValue, () => rerender(vnode));
    }

    return {
        useSignal: $useSignal,
        useStore: $useStore,
    };
}

function isComponent(vnode) {
    return typeof vnode.type === 'function';
}

function render(vnode) {
    const { type, props, children } = vnode;

    // Component
    if (isComponent(vnode)) {
        const previousHookContext = currentContext;
        currentContext = createComponentContext(vnode);
        const vnodeFn = type({ props, children });
        const elem = render(vnodeFn());
        currentContext = previousHookContext;

        vnodeMap.set(vnode, { elem, vnodeFn });

        return elem;
    }

    // Normal element
    const elem = document.createElement(type);
    vnodeMap.set(vnode, { elem });

    const isListener = (key) => key.startsWith('on');
    const isAttribute = (key) => getAllowedAttrs(type).includes(key);
    extractEntries(props, isListener).forEach(([eventProp, callback]) =>
        elem.addEventListener(eventProp.substring(2).toLowerCase(), callback),
    );
    extractEntries(props, isAttribute).forEach(([attr, value]) => {
        elem.setAttribute(attr, value);
    });

    children.forEach((child) => {
        if (typeof child !== 'object' || child == null) {
            elem.append(child); // Append as a text node
        } else {
            elem.append(render(child));
        }
    });

    return elem;
}

function rerender(vnode) {
    if (!isComponent(vnode)) {
        throw Error('Cannot rerender non-component');
    }

    const vnodeData = vnodeMap.get(vnode);
    const elem = render(vnodeData.vnodeFn());
    vnodeData.elem.replaceWith(elem);
    vnodeData.elem = elem;
}

export function h({ type, props = {}, children = [] }) {
    return { type, props, children: Array.isArray(children) ? children : [children] };
}

export function createApp(rootVnode, { id = 'app' } = {}) {
    const rootElem = document.createElement('div');
    rootElem.id = id;
    document.body.prepend(rootElem);
    rootElem.append(render(rootVnode));
}

export function useSignal(initialValue) {
    return currentContext.useSignal(initialValue);
}

export function useStore(initialValue) {
    return currentContext.useStore(initialValue);
}
