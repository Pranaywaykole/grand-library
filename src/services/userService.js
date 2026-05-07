/* ================================
   src/services/userService.js
   All user data API calls —
   character, favourites, history,
   reading progress.
   ================================ */

import { http } from './http'

export const userService = {

  /* ── Character ── */

  async updateCharacter(name, emoji) {
    return http.patch('/users/character', { name, emoji })
  },

  /* ── Preferences ── */

  async updatePreferences(theme, fontSize) {
    return http.patch('/users/preferences', { theme, fontSize })
  },

  /* ── Favourites ── */

  async getFavourites() {
    return http.get('/users/favourites')
  },

  async addFavourite(bookId, title, cover) {
    return http.post('/users/favourites', { bookId, title, cover })
  },

  async removeFavourite(bookId) {
    return http.delete(`/users/favourites/${bookId}`)
  },

  /* ── Reading History ── */

  async getHistory() {
    return http.get('/users/history')
  },

  async addToHistory(bookId, title, cover) {
    return http.post('/users/history', { bookId, title, cover })
  },

  /* ── Reading Progress ── */

  async getProgress(bookId) {
    return http.get(`/users/progress/${bookId}`)
  },

  async saveProgress(bookId, currentPage, totalPages, bookTitle) {
    return http.put(`/users/progress/${bookId}`, {
      currentPage,
      totalPages,
      bookTitle,
    })
  },

}