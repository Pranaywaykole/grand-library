/* ================================
   src/services/http.js
   Base HTTP client.
   All API calls go through this.
   Handles auth tokens and errors
   automatically.
   ================================ */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

/*
  getToken reads the JWT from localStorage.
  Called on every request so it always uses
  the most current token.
*/
function getToken() {
  return localStorage.getItem('library_token')
}

/*
  buildHeaders creates the headers object
  for every request. Includes Content-Type
  and Authorization (if token exists).
*/
function buildHeaders(includeAuth = true) {
  const headers = {
    'Content-Type': 'application/json',
  }

  if (includeAuth) {
    const token = getToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
  }

  return headers
}

/*
  handleResponse processes every response.
  Parses JSON, checks for errors,
  throws descriptive error messages.
*/
async function handleResponse(response) {
  const data = await response.json()

  if (!response.ok) {
    /*
      The server sends error messages in data.error.
      We throw that message so callers can catch it
      and show it to the user.
    */
    throw new Error(data.error || `Server error: ${response.status}`)
  }

  return data
}

/*
  The four HTTP methods your app needs.
  Each one builds the request, sends it,
  and handles the response consistently.
*/
export const http = {

  async get(endpoint) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method:  'GET',
      headers: buildHeaders(),
    })
    return handleResponse(response)
  },

  async post(endpoint, body, requiresAuth = true) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method:  'POST',
      headers: buildHeaders(requiresAuth),
      body:    JSON.stringify(body),
    })
    return handleResponse(response)
  },

  async patch(endpoint, body) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method:  'PATCH',
      headers: buildHeaders(),
      body:    JSON.stringify(body),
    })
    return handleResponse(response)
  },

  async put(endpoint, body) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method:  'PUT',
      headers: buildHeaders(),
      body:    JSON.stringify(body),
    })
    return handleResponse(response)
  },

  async delete(endpoint) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method:  'DELETE',
      headers: buildHeaders(),
    })
    return handleResponse(response)
  },

}