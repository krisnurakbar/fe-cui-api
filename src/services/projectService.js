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

const syncProject = (id) => {
  return api.get(`/${id}/sync-tasks-manual`);
};

const syncPlanProgressManual = (id) => {
  return api.get(`/${id}/plan-progress`);
};

const getProjectById = (cu_project_id) => {
  return api.get(`/info/${cu_project_id}`);
}

export default {
  getProjects,
  getProjectById,
  updateProject,
  updateStatusProject,
  deleteProject,
  projectProgress,
  projectCreate,
  syncProject,
  syncPlanProgressManual,
};

