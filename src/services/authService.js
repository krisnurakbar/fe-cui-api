import axios from 'axios';

const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_BASE_URL}/auth`,  // Concatenate baseURL with /auth
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
