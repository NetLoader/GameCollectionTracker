export const refreshTokenUtility = async (refreshToken) => {
    try {
        const response = await fetch('/api/auth/refreshToken', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({refreshToken})
        });
        if (response.ok) {
            const {accessToken} = await response.json();
            localStorage.setItem('accessToken', accessToken);
            return accessToken;
        } else if (response.status === 401 || response.status === 403){
            const {message} = await response.json();
            console.error('Error: ', message);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('userID');
            return null;
        } else {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('userID');
            return null;
        }
    } catch (error) {
        console.error('Error refreshing token', error);
        return null;
    }
}