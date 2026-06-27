import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: { 'Content-Type': 'application/json' },
})

// Attach stored JWT to every outgoing request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Let callers handle errors; we just forward the rejection
api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
)

export default api
