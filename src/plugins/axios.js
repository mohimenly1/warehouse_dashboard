import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://127.0.0.1:8000/api', // Replace with your backend URL
    headers: {
        'Content-Type': 'application/json'
    }
});

apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            // Server responded with a status other than 2xx
            console.error('Response Error:', {
                data: error.response.data,
                status: error.response.status,
                headers: error.response.headers
            });
        } else if (error.request) {
            // No response received from server
            console.error('Request Error: No response received', error.request);
        } else {
            // Something went wrong in setting up the request
            console.error('Setup Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default apiClient;
