import { TOKEN } from "./constants";

/**
 * Sets the auth token to local storage
 * @param {String} token
 */
export const setTokenToLocalStorage = (token) => {
    localStorage.setItem(TOKEN, token);
};

/**  Gets auth token from local storage
@return {Object} object with isPresent key to true if token is found  
*/
export const getTokenFromLocalStorage = () => {
    const token = localStorage.getItem(TOKEN);
    if (!token) {
        return {
            isPresent: false,
        };
    }
    return {
        isPresent: true,
        token,
    };
};

export const deleteTokenFromLocalStorage = () => {
    localStorage.removeItem(TOKEN);
};
