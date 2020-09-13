import axios from 'axios';

const api = axios.create({
  baseURL: 'api',
  headers: {
    'Content-type': 'application/json',
  },
});

const route = '/transaction';

const create = (data) => {
  return api.post(`${route}`, data);
};

const retrieve = (period) => {
  return api.get(`${route}?period=${period}`);
};

const update = (data) => {
  return api.put(`${route}`, data);
};

const destroy = (data) => {
  return api.delete(`${route}`, { data });
};

export default { create, retrieve, update, destroy };
