import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/auth',
});

const register = (data) => {
  return api.post('/register', data);
};

const login = (data) => {
  return api.post('/login', data);
};

export default {
  register,
  login,
};
