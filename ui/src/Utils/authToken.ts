import Cookies from 'js-cookie';

const AUTH_TOKEN_KEY = 'authToken';

export const AUTH_TOKEN_EVENT = 'local-market-auth-token-changed';

function notifyAuthChanged() {
    if (typeof window === 'undefined') return;

    window.dispatchEvent(new Event(AUTH_TOKEN_EVENT));

    try {
        localStorage.setItem(AUTH_TOKEN_EVENT, String(Date.now()));
    } catch {
        // ignore
    }
}

export function getAuthToken() {
    return Cookies.get(AUTH_TOKEN_KEY) || '';
}

export function setAuthToken(token: string) {
    Cookies.set(AUTH_TOKEN_KEY, token, {
        expires: 7,
        sameSite: 'lax',
        path: '/',
    });

    notifyAuthChanged();
}

export function removeAuthToken() {
    Cookies.remove(AUTH_TOKEN_KEY);
    Cookies.remove(AUTH_TOKEN_KEY, {
        path: '/',
    });

    notifyAuthChanged();
}