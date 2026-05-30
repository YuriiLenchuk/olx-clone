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

function decodeJwtPayload(token: string): any {
    if (typeof window === 'undefined') return null;

    const payload = token.split('.')[1];

    if (!payload) return null;

    const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
    const paddedPayload = normalizedPayload.padEnd(
        normalizedPayload.length + ((4 - (normalizedPayload.length % 4)) % 4),
        '=',
    );

    return JSON.parse(window.atob(paddedPayload));
}

export function getAuthToken() {
    return Cookies.get(AUTH_TOKEN_KEY) || '';
}

export function isAuthTokenExpired(token: string = getAuthToken()) {
    if (!token) return true;

    try {
        const payload = decodeJwtPayload(token);

        if (!payload?.exp) return false;

        return payload.exp * 1000 <= Date.now() + 5000;
    } catch {
        return true;
    }
}

export function getValidAuthToken() {
    const token = getAuthToken();

    if (!token) return '';

    if (isAuthTokenExpired(token)) {
        removeAuthToken();
        return '';
    }

    return token;
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
    const currentToken = getAuthToken();

    if (!currentToken) return;

    Cookies.remove(AUTH_TOKEN_KEY);
    Cookies.remove(AUTH_TOKEN_KEY, {
        path: '/',
    });

    notifyAuthChanged();
}