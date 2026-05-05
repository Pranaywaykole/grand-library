/*
  Central API configuration.
  All API calls go through here.
  In development: calls localhost:5000
  In production: calls your deployed backend URL
*/

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const api = {
  /* Books */
  getBooks:    (params = '') => `${API_BASE}/books${params}`,
  getBook:     (id)          => `${API_BASE}/books/${id}`,
  getBookText: (id)          => `${API_BASE}/books/${id}/text`,

  /* Auth */
  register: `${API_BASE}/auth/register`,
  login:    `${API_BASE}/auth/login`,
  me:       `${API_BASE}/auth/me`,

  /* Users */
  character:   (userId)         => `${API_BASE}/users/${userId}/character`,
  favourites:  (userId)         => `${API_BASE}/users/${userId}/favourites`,
  removeFav:   (userId, bookId) => `${API_BASE}/users/${userId}/favourites/${bookId}`,
  history:     (userId)         => `${API_BASE}/users/${userId}/history`,

  /* Health */
  health: `${API_BASE}/health`,
}