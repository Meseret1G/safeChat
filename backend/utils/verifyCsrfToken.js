module.exports = (token, socket) => {
    if (!token) {
        console.error("CSRF token missing from payload");
        return false;
    }

    const csrfCookieToken = socket.handshake.headers.cookie
        ?.split('; ')
        .find(cookie => cookie.startsWith('_csrf='))
        ?.split('=')[1];

    if (!csrfCookieToken) {
        console.error("CSRF token missing from cookies");
        return false;
    }

    const isValid = token === csrfCookieToken;

    if (!isValid) {
        console.error("CSRF token mismatch");
    }

    return isValid;
};
