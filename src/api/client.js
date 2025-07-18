import axios from 'axios';
import config from '../config';
import authStorage from '../auth/storage';

const apiClient = axios.create({
  baseURL: config.baseURL,
});

apiClient.interceptors.request.use(
  async request => {
    const authToken = await authStorage.getToken();

    if (!request.headers['Content-Type']) {
      request.headers['Content-Type'] = 'application/json';
    }
     
    if (authToken) request.headers['Authorization'] = `Bearer ${authToken}`;

    return request;
  },
  error => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      authStorage.removeToken();
    }
    if (error.response && error.response.status === 422) {
      return error.response;
    }
    if (error.response.status === 302) {
      return Promise.resolve(error.response);
    }
    if (error.response && error.response.status === 409) {
      return error.response;
    }
    console.error('Response error', error.response);
    return Promise.reject(error);
  },
);

export default apiClient;
