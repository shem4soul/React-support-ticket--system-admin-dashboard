import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
})

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common.Authorization
  }
}

export async function login(username, password) {
  const { data } = await api.post('/auth/login', { username, password })
  return data
}

export async function fetchMe() {
  const { data } = await api.get('/auth/me')
  return data
}

export async function fetchTickets({ status, priority } = {}) {
  const params = {}
  if (status) params.status = status
  if (priority) params.priority = priority
  const { data } = await api.get('/tickets', { params })
  return data.tickets
}

export async function fetchTicket(id) {
  const { data } = await api.get(`/tickets/${id}`)
  return data.ticket
}

export async function updateTicketStatus(id, status) {
  const { data } = await api.put(`/tickets/${id}/status`, { status })
  return data.ticket
}

export default api
