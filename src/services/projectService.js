import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/projects',
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

export default {
  getProjects,
  updateProject,
  updateStatusProject,
  deleteProject,
  projectProgress,
};
