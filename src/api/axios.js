import axios from 'axios';

const instance = axios.create ({
    baseURL: 'https://juike-exams-token-sale-web-app-django.onrender.com/',
});

export default instance;