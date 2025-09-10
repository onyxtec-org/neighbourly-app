// src/api/formApiClient.js
import axios from 'axios';
import config from '../config';
import storage from '../app/storage';

const formApiClient = axios.create({
  baseURL: config.baseURL,
});

formApiClient.interceptors.request.use(
  async request => {
    const token = await storage.getToken();
    console.log('🧾 Token being sent:', token);
    request.headers['Authorization'] = `Bearer ${token}`;
    return request;
  },
  error => Promise.reject(error)
);

formApiClient.interceptors.response.use(
  response => response,
  error => {
    // ✅ Always reject
    return Promise.reject(error);
  }
);

export default formApiClient;
