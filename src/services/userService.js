import axios from 'axios';

const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_BASE_URL}/users`,
});

const getUsers = () => {
  return api.get('/');
};

const createUser = (data) => {
  return api.post('/create/', data);
};

const updateUser = (id, data) => {
  return api.put(`/${id}`, data);
};

const updateStatusUser = (id, status, data) => {
  return api.put(`/${id}/${status}`, data);
};

const deleteUser = (id) => {
  return api.delete(`/${id}`);
};

export default {
  getUsers,
  createUser,
  updateUser,
  updateStatusUser,
  deleteUser,
};
