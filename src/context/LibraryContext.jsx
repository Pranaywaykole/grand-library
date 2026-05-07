/* ================================
   src/context/LibraryContext.jsx
   Updated with real authentication.
   ================================ */

import {
  createContext, useContext, useState,
  useCallback, useEffect
} from 'react'
import { authService } from '../services/authService'
import { userService  } from '../services/userService'

const LibraryContext = createContext(null)

export function LibraryProvider({ children }) {

  /* ─────────────────────────────────
     AUTH STATE
     ───────────────────────────────── */

  const [user,        setUser]        = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [authError,   setAuthError]   = useState(null)

  /*
    On app load, check if the user is already
    logged in by verifying their stored token.
    This runs ONCE when the app first mounts.
  */
  useEffect(() => {
    async function checkAuth() {
      if (!authService.isLoggedIn()) {
        setAuthLoading(false)
        return
      }

      try {
        const data = await authService.getMe()
        setUser(data.user)

        /*
          Sync character from database to state.
          If the user has a saved character, use it.
        */
        if (data.user.character?.name) {
          setChosenCharacter({
            name:  data.user.character.name,
            emoji: data.user.character.emoji,
          })
        }

      } catch (error) {
        /*
          Token may be expired or invalid.
          Clear it and treat user as logged out.
        */
        authService.logout()
        setUser(null)
      } finally {
        setAuthLoading(false)
      }
    }

    checkAuth()
  }, [])

  const register = useCallback(async (username, email, password) => {
    setAuthError(null)
    try {
      const data = await authService.register(username, email, password)
      setUser(data.user)
      showNotification(`Welcome to The Grand Library, ${data.user.username}!`, 'success')
      return data
    } catch (error) {
      setAuthError(error.message)
      throw error
    }
  }, [])

  const login = useCallback(async (email, password) => {
    setAuthError(null)
    try {
      const data = await authService.login(email, password)
      setUser(data.user)

      /* Restore character from database */
      if (data.user.character?.name) {
        setChosenCharacter({
          name:  data.user.character.name,
          emoji: data.user.character.emoji,
        })
      }

      showNotification(`Welcome back, ${data.user.username}!`, 'success')
      return data
    } catch (error) {
      setAuthError(error.message)
      throw error
    }
  }, [])

  const logout = useCallback(() => {
    authService.logout()
    setUser(null)
    setChosenCharacter({ name: '', emoji: '' })
    setFavourites([])
    setReadingHistory([])
    showNotification('You have been logged out.', 'info')
  }, [])


  /* ─────────────────────────────────
     CHARACTER STATE
     ───────────────────────────────── */

  const [chosenCharacter, setChosenCharacter] = useState({
    name:  '',
    emoji: '',
  })

  const selectCharacter = useCallback(async (character) => {
    setChosenCharacter(character)

    /*
      If logged in, save to database.
      If not logged in, just keep in local state.
    */
    if (authService.isLoggedIn()) {
      try {
        await userService.updateCharacter(character.name, character.emoji)
      } catch (error) {
        console.error('Failed to save character to database:', error)
      }
    }
  }, [])


  /* ─────────────────────────────────
     NOTIFICATIONS
     ───────────────────────────────── */

  const [notifications, setNotifications] = useState([])

  const showNotification = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random()
    setNotifications(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id))
    }, 3000)
  }, [])


  /* ─────────────────────────────────
     FAVOURITES
     ───────────────────────────────── */

  const [favourites, setFavourites] = useState([])

  /*
    Load favourites from database when user logs in.
  */
  useEffect(() => {
    if (!user) return

    async function loadFavourites() {
      try {
        const data = await userService.getFavourites()
        setFavourites(data.favourites || [])
      } catch (error) {
        console.error('Failed to load favourites:', error)
      }
    }

    loadFavourites()
  }, [user])

  const toggleFavourite = useCallback(async (book) => {
    const exists = favourites.some(f => f.bookId === book.id)

    if (exists) {
      /* Optimistic update — update UI immediately */
      setFavourites(prev => prev.filter(f => f.bookId !== book.id))

      if (authService.isLoggedIn()) {
        try {
          await userService.removeFavourite(book.id)
        } catch (error) {
          /* Rollback if server request fails */
          setFavourites(prev => [...prev, book])
          showNotification('Failed to remove favourite. Please try again.', 'error')
        }
      }
    } else {
      /* Optimistic update */
      setFavourites(prev => [book, ...prev])

      if (authService.isLoggedIn()) {
        try {
          await userService.addFavourite(book.id, book.title, book.cover || '')
        } catch (error) {
          /* Rollback */
          setFavourites(prev => prev.filter(f => f.bookId !== book.id))
          showNotification('Failed to add favourite. Please try again.', 'error')
        }
      }
    }
  }, [favourites, showNotification])

  const isFavourite = useCallback((bookId) => {
    return favourites.some(f => f.bookId === bookId || f.id === bookId)
  }, [favourites])


  /* ─────────────────────────────────
     READING HISTORY
     ───────────────────────────────── */

  const [readingHistory, setReadingHistory] = useState([])

  useEffect(() => {
    if (!user) return

    async function loadHistory() {
      try {
        const data = await userService.getHistory()
        setReadingHistory(data.history || [])
      } catch (error) {
        console.error('Failed to load history:', error)
      }
    }

    loadHistory()
  }, [user])

  const addToHistory = useCallback(async (book) => {
    /* Update local state immediately */
    setReadingHistory(prev => {
      const filtered = prev.filter(b => b.bookId !== book.id)
      return [book, ...filtered].slice(0, 20)
    })

    /* Save to database if logged in */
    if (authService.isLoggedIn()) {
      try {
        await userService.addToHistory(book.id, book.title, book.cover || '')
      } catch (error) {
        console.error('Failed to save to history:', error)
      }
    }
  }, [])


  /* ─────────────────────────────────
     CONTEXT VALUE
     ───────────────────────────────── */

  const value = {
    /* Auth */
    user,
    authLoading,
    authError,
    register,
    login,
    logout,
    isLoggedIn: !!user,

    /* Character */
    chosenCharacter,
    selectCharacter,

    /* Notifications */
    notifications,
    showNotification,

    /* Favourites */
    favourites,
    toggleFavourite,
    isFavourite,

    /* History */
    readingHistory,
    addToHistory,
  }

  return (
    <LibraryContext.Provider value={value}>
      {children}
    </LibraryContext.Provider>
  )
}

export function useLibrary() {
  const context = useContext(LibraryContext)
  if (!context) {
    throw new Error('useLibrary must be used inside a LibraryProvider')
  }
  return context
}