import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://127.0.0.1:8000/api', // Replace with your backend URL
    headers: {
        'Content-Type': 'application/json'
    }
});

apiClient.interceptors.response.use(
    (response) => {
        // Handle successful responses
        return response;
    },
    (error) => {
        // Log all errors
        console.error('Axios Error:', error);
        return Promise.reject(error);
    }
);

export default apiClient;
