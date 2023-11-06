// Matej Pavlík
// Custom UI library

const vnodeMap = new WeakMap();
let currentContext = null;

// Util
function extractEntries(obj, callbackFilter) {
    return Object.entries(obj).filter(([key, value]) => callbackFilter(key, value));
}

function getAllowedProperties(tag) {
    const ALLOWED_PROPERTIES = {
        all: ['className', 'id'],
        button: ['disabled'],
        input: ['autocomplete', 'placeholder', 'type', 'value'],
        option: ['value'],
    };

    return ALLOWED_PROPERTIES.all.concat(ALLOWED_PROPERTIES[tag] ?? []);
}

function deepProxify(initialObj, onChange = () => {}) {
    const target = { ...initialObj, __isProxy: true };
    Object.entries(initialObj).forEach(([key, value]) => {
        if (value != null && typeof value === 'object') {
            target[key] = deepProxify(value, onChange);
        }
    });

    const handler = {
        set(targetObj, prop, value) {
            const prevValue = Reflect.get(...arguments);

            if (prevValue !== value && value != null && typeof value === 'object' && !value.__isProxy) {
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
    const mountedCallbacks = [];

    return {
        onMounted(callback) {
            mountedCallbacks.push(callback);
        },
        useSignal(initialValue) {
            // eslint-disable-next-line no-use-before-define
            return deepProxify({ value: initialValue }, () => rerender(vnode));
        },
        useStore(initialValue) {
            if (typeof initialValue !== 'object' || initialValue == null) {
                throw Error('useStore initialValue must be an object');
            }
            // eslint-disable-next-line no-use-before-define
            return deepProxify(initialValue, () => rerender(vnode));
        },
        __runMountedCallbacks(elem) {
            mountedCallbacks.forEach((callback) => callback(elem));
        },
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
        currentContext.__runMountedCallbacks(elem);
        currentContext = previousHookContext;

        vnodeMap.set(vnode, { elem, vnodeFn });

        return elem;
    }

    // Normal element
    const elem = document.createElement(type);
    vnodeMap.set(vnode, { elem });

    const isListener = (key) => key.startsWith('on');
    const isProperty = (key) => getAllowedProperties(type).includes(key);
    extractEntries(props, isListener).forEach(([eventProp, callback]) =>
        elem.addEventListener(eventProp.substring(2).toLowerCase(), callback),
    );
    extractEntries(props, isProperty).forEach(([prop, value]) => {
        elem[prop] = value;
    });

    children.forEach((child) => {
        if (typeof child !== 'object' || child == null) {
            elem.append(child != null ? child : ''); // Append as a text node
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

export function createApp({ id = 'app' } = {}) {
    const rootElem = document.createElement('div');
    rootElem.id = id;
    document.body.prepend(rootElem);

    function renderPage(PageComponent, { props } = {}) {
        rootElem.replaceChildren(render(h({ type: PageComponent, props })));
    }

    return { renderPage };
}

export function onMounted(callback) {
    currentContext.onMounted(callback);
}

export function useSignal(initialValue) {
    return currentContext.useSignal(initialValue);
}

export function useStore(initialValue) {
    return currentContext.useStore(initialValue);
}
