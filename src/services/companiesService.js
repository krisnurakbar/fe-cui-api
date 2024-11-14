import axios from 'axios';

const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_BASE_URL}/companies`,
});

const getCompanies = () => {
  return api.get('/');
};
const createCompanies = (data) => {
  return api.post('/create/', data);
};

const updateCompanies = (id, data) => {
  return api.put(`/${id}`, data);
};

const updateStatusCompanies = (id, status, data) => {
  return api.put(`/${id}/${status}`, data);
};

const deleteCompanies = (id) => {
  return api.delete(`/${id}`);
};

export default {
  getCompanies,
  createCompanies,
  updateCompanies,
  updateStatusCompanies,
  deleteCompanies,
};
