import axios from "axios";
import {AUTHORIZATION_PREFIX, baseURL} from "../utils/constants";
import {getTokenFromLocalStorage} from "../utils/token.js";

const getAuthHeader = () => {
    return { Authorization: AUTHORIZATION_PREFIX + getTokenFromLocalStorage().token }
}

const client = axios.create({
    baseURL
});

// Request interceptor
client.interceptors.request.use(
    config => {
        console.log('Request:', config);
        return config;
    },
    error => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
client.interceptors.response.use(
    response => {
        console.log('Response:', response);
        return response;
    },
    error => {
        console.error('Response Error:', error);
        return Promise.reject(error);
    }
)

export {client, getAuthHeader};
