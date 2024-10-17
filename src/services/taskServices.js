import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/tasks', // Change the base URL to point to tasks
});

const getTasks = () => {
  return api.get('/'); // Fetch all tasks
};

const createTask = (data) => {
  return api.post('/', data); // Create a new task
};

const updateTask = (id, data) => {
  return api.put(`/${id}`, data); // Update an existing task
};

const deleteTask = (id) => {
  return api.delete(`/${id}`); // Delete a task
};

const updateTaskStatus = (id, status, data) => {
  return api.put(`/${id}/${status}`, data); // Update the status of a specific task
};

const getProjectTasks = (project_id, data) => {
  return api.get(`project/${project_id}`, data); // Update the status of a specific task
};

export default {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  getProjectTasks,
};
