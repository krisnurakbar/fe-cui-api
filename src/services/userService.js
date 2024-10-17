import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/users',
});

const getUsers = () => {
  return api.get('/');
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
  updateUser,
  updateStatusUser,
  deleteUser,
};
