import { useState, useEffect } from "react"
import { api } from '../config/api'
import { bookService } from '../services/bookService'
import.meta.env

const API_BASE = import.meta.env.VITE_API_URL;

export function useBooks(searchTerm, topic, page) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [nextUrl, setNextUrl] = useState(null);
  const [prevUrl, setPrevUrl] = useState(null);

  useEffect(() => {
  let cancelled = false

  async function loadBooks() {
    setLoading(true)
    setError(null)

    try {
      const data = await bookService.getBooks({
        search: searchTerm,
        topic,
        page,
      })

      if (!cancelled) {
        setBooks(data.results)
        setTotal(data.count)
        setNextUrl(data.next)
        setPrevUrl(data.previous)
      }
    } catch (err) {
      if (!cancelled) setError(err.message)
    } finally {
      if (!cancelled) setLoading(false)
    }
  }

  const delay  = searchTerm ? 500 : 0
  const timer  = setTimeout(loadBooks, delay)
  return () => { cancelled = true; clearTimeout(timer) }

}, [searchTerm, topic, page])

  return { books, loading, error, total, nextUrl, prevUrl };
}
