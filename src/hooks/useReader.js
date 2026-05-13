import { useState, useEffect } from 'react'
import { api } from '../config/api'
import { userService } from '../services/userService'
import { bookService  } from '../services/bookService'
import { authService  } from '../services/authService'
import.meta.env

const API_BASE   = import.meta.env.VITE_API_URL

const CHARS_PER_PAGE = 3000

const PROXIES = [
  (url) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
  (url) => `https://api.codetabs.com/v1/proxy?quest=${url}`,
  (url) => `https://thingproxy.freeboard.io/fetch/${url}`,
]

export function useReader(bookId) {
  const [book,        setBook]        = useState(null)
  const [pages,       setPages]       = useState([])
  const [currentPage, setCurrentPage] = useState(0)
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState(null)
  const [loadingText, setLoadingText] = useState("Fetching book details...")

  useEffect(() => {
    if (!bookId) {
      setError("No book selected.")
      setLoading(false)
      return
    }

    let cancelled = false

    async function loadBook() {
      setLoading(true)
      setError(null)

      try {
        /* Step 1 — fetch metadata */
        setLoadingText("Fetching book details...")
        const metaRes = await fetch(`${API_BASE}/${bookId}`)
        if (!metaRes.ok) throw new Error("Could not load book information.")
        const bookData = await metaRes.json()

        if (!cancelled) setBook(bookData)

        /* Step 2 — fetch full text */
        setLoadingText("Loading full book text...")
        const text = await fetchBookText(bookData)

        if (!cancelled) {
          const clean    = cleanText(text)
          const allPages = splitPages(clean)
          setPages(allPages)

          /* Restore reading progress */
          const saved = localStorage.getItem(`progress_${bookId}`)
          if (saved) {
            setCurrentPage(Math.min(parseInt(saved), allPages.length - 1))
          }
        }

      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadBook()
    return () => { cancelled = true }

  }, [bookId])

  function goToNext() {
  if (currentPage < pages.length - 1) {
    const next = currentPage + 1
    setCurrentPage(next)

    /* Save to database if logged in */
    if (authService.isLoggedIn() && book) {
      userService.saveProgress(bookId, next, pages.length, book.title)
        .catch(err => console.error('Failed to save progress:', err))
    }

    /* Always save to localStorage as backup */
    localStorage.setItem(`progress_${bookId}`, next)
  }
}
function goToPrev() {
    if (currentPage > 0) {
      const prev = currentPage - 1
      setCurrentPage(prev)
      localStorage.setItem(`progress_${bookId}`, prev)
    }
  }
  return {
    book, pages, currentPage,
    loading, error, loadingText,
    goToNext, goToPrev,
  }
}

/*
  Now fetches through your backend server
  instead of directly from Gutenberg.
  No more CORS errors ever.
*/
async function fetchBookText(book) {
  setLoadingText("Loading full book text...")
const textData = await bookService.getBookText(bookId)

if (!cancelled) {
  const allPages = splitPages(textData.text)
  setPages(allPages)

  /* Restore progress from database if logged in */
  if (authService.isLoggedIn()) {
    try {
      const progressData = await userService.getProgress(bookId)
      if (progressData.currentPage > 0) {
        setCurrentPage(
          Math.min(progressData.currentPage, allPages.length - 1)
        )
      }
    } catch {
      /* Fall back to localStorage */
      const saved = localStorage.getItem(`progress_${bookId}`)
      if (saved) setCurrentPage(parseInt(saved))
    }
  }
}
}

function cleanText(raw) {
  let text = raw
  const start = raw.match(/\*{3}\s*START OF.*?\*{3}/i)
  if (start) text = text.slice(start.index + start[0].length)
  const end = text.match(/\*{3}\s*END OF.*?\*{3}/i)
  if (end) text = text.slice(0, end.index)
  return text.replace(/\r\n/g, "\n").replace(/\n{4,}/g, "\n\n\n").trim()
}
/* ── Helper: split text into pages ── */

function splitPages(text) {
  const pages   = []
  let remaining = text
  while (remaining.length > 0) {
    if (remaining.length <= CHARS_PER_PAGE) {
      pages.push(remaining.trim())
      break
    }
    let splitAt = remaining.lastIndexOf("\n\n", CHARS_PER_PAGE)
    if (splitAt === -1 || splitAt < CHARS_PER_PAGE / 2) {
      splitAt = remaining.lastIndexOf(". ", CHARS_PER_PAGE)
    }
    if (splitAt === -1) splitAt = CHARS_PER_PAGE
    pages.push(remaining.slice(0, splitAt).trim())
    remaining = remaining.slice(splitAt).trim()
  }
  return pages
}