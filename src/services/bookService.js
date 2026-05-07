/* ================================
   src/services/bookService.js
   All book API calls — fetching
   books and book text through
   your backend server.
   ================================ */

import { http } from './http'

export const bookService = {

  /*
    getBooks fetches books from Gutendex
    through your backend proxy.
    Accepts optional search, topic, page params.
  */
  async getBooks({ search = '', topic = '', page = 1 } = {}) {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (topic)  params.set('topic',  topic)
    if (page > 1) params.set('page', page)

    const qs = params.toString()
    return http.get(`/books${qs ? `?${qs}` : ''}`)
  },

  /*
    getBook fetches one book's metadata.
  */
  async getBook(bookId) {
    return http.get(`/books/${bookId}`)
  },

  /*
    getBookText fetches the full text of a book
    through your backend — no CORS ever.
    Returns { bookId, title, text, length }
  */
  async getBookText(bookId) {
    return http.get(`/books/${bookId}/text`)
  },

}