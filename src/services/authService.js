/* ================================
   src/services/authService.js
   All authentication API calls.
   ================================ */

import { http } from './http'

export const authService = {

  /*
    Register creates a new account.
    Returns { token, user } on success.
  */
  async register(username, email, password) {
    const data = await http.post(
      '/auth/register',
      { username, email, password },
      false /* no auth token needed to register */
    )
    /*
      Save the token to localStorage immediately
      so future requests are authenticated.
    */
    localStorage.setItem('library_token', data.token)
    return data
  },

  /*
    Login verifies credentials and returns
    { token, user } on success.
  */
  async login(email, password) {
    const data = await http.post(
      '/auth/login',
      { email, password },
      false /* no auth token needed to log in */
    )
    localStorage.setItem('library_token', data.token)
    return data
  },

  /*
    Logout removes the token.
    No server call needed — JWTs are stateless.
  */
  logout() {
    localStorage.removeItem('library_token')
  },

  /*
    getMe fetches the current user's profile.
    Used on app load to check if already logged in.
  */
  async getMe() {
    return http.get('/auth/me')
  },

  /*
    isLoggedIn checks if a token exists.
    Does not verify the token — just checks presence.
  */
  isLoggedIn() {
    return !!localStorage.getItem('library_token')
  },

}