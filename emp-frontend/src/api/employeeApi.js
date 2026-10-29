import client from "./axiosClient.js";

// Backend wraps everything as: { success, message, data }
const BASE = "/api/employees";

// GET /api/employees?page=&size=&sortBy=&direction=
// Returns Spring's Page object: { content, totalElements, totalPages, number, size, first, last }
export const getEmployees = ({
  page = 0,
  size = 5,
  sortBy = "id",
  direction = "asc",
} = {}) =>
  client
    .get(BASE, { params: { page, size, sortBy, direction } })
    .then((res) => res.data.data);

// GET /api/employees/{id}
export const getEmployeeById = (id) =>
  client.get(`${BASE}/${id}`).then((res) => res.data.data);

// GET /api/employees/email/{email}
export const getEmployeeByEmail = (email) =>
  client
    .get(`${BASE}/email/${encodeURIComponent(email)}`)
    .then((res) => res.data.data);

// POST /api/employees
export const createEmployee = (payload) =>
  client.post(BASE, payload).then((res) => res.data);

// PUT /api/employees/{id}
export const updateEmployee = (id, payload) =>
  client.put(`${BASE}/${id}`, payload).then((res) => res.data);
