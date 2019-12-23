
const APP_PREFIX = 'PIZZLY-';

export function loadInitialState() {
    return Object.keys(localStorage).reduce((state, storageKey) => {
        if (storageKey.includes(APP_PREFIX)) {
            state = state || {};
            const stateKey = storageKey
                .replace(APP_PREFIX, '')
                .toLowerCase()
                .split('.');
            let currentStateRef = state;
            stateKey.forEach((key, index) => {
                if (index === stateKey.length - 1) {
                    currentStateRef[key] = JSON.parse(localStorage.getItem(storageKey));
                    return;
                }
                currentStateRef[key] = currentStateRef[key] || {};
                currentStateRef = currentStateRef[key];
            });
        }
        return state;
    }, undefined);
}

export function setItem(key, value) {
    localStorage.setItem(`${APP_PREFIX}${key}`, JSON.stringify(value));
}

export function getItem(key) {
    return JSON.parse(localStorage.getItem(`${APP_PREFIX}${key}`));
}

export function removeItem(key) {
    localStorage.removeItem(`${APP_PREFIX}${key}`);
}