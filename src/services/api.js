import axios from 'axios'

// Base URL of the backend API. Override per-environment with VITE_API_URL
// (e.g. your deployed API domain); falls back to the local dev server.
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: API_BASE_URL,
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
