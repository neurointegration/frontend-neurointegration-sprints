interface TokenPayload {
    exp: number;
}

const decodeToken = (token: string): TokenPayload | null => {
    const tokenParts = token.split('.');
    if (tokenParts.length < 3) {
        return null; // Некорректный токен
    }

    const payload = tokenParts[1];
    const decodedPayload = atob(payload);
    return JSON.parse(decodedPayload);
};

export default decodeToken;
