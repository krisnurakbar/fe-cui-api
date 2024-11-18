import axios from 'axios';

const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_BASE_URL}/project/progress`,
});

const projectProgressCreate = (data) => {
  return api.post('/create', data);
}

const projectProgressUpdate = (id, data) => {
  return api.put(`/update/${id}`, data);
};

const deleteProgressProject = (id, data) => {
  return api.delete(`/delete/${id}`, data);
};

//get project progress view
const projectProgressView = (data) => {
  return api.get(`/view/`, data);
}

const projectProgressUpdateByParameter = (cu_project_id, data) => {
  return api.put(`/updateByParameter/${cu_project_id}`, data);
}

export default {
  projectProgressCreate,
  projectProgressUpdate,
  deleteProgressProject,
  projectProgressView,
  projectProgressUpdateByParameter
};

