import axios from 'axios';

const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_BASE_URL}/projects`,
});

const getProjects = () => {
  return api.get('/');
};

const updateProject = (id, data) => {
  return api.put(`/${id}`, data);
};

const updateStatusProject = (id, status, data) => {
  return api.put(`/${id}/${status}`, data);
};

const deleteProject = (id) => {
  return api.delete(`/${id}`);
};

const projectProgress = (id) => {
  return api.get(`/${id}/progress`);
};

const projectCreate = (data) => {
  return api.post('/', data);
};

export default {
  getProjects,
  updateProject,
  updateStatusProject,
  deleteProject,
  projectProgress,
  projectCreate,
};
