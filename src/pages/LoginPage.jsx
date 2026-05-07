/* ================================
   src/pages/LoginPage.jsx
   Login and Register in one page.
   Toggle between the two forms.
   ================================ */

import { useState }        from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useLibrary }      from '../context/LibraryContext'
import './AuthPage.css'

function LoginPage() {
  const [mode,     setMode]     = useState('login') /* 'login' or 'register' */
  const [username, setUsername] = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  const { login, register } = useLibrary()
  const navigate            = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'login') {
        await login(email, password)
      } else {
        await register(username, email, password)
      }
      /*
        On success navigate to homepage.
        The context already updated user state
        so the navbar will show logged in state.
      */
      navigate('/')

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">

      {/* Background decoration */}
      <div className="auth-bg">
        <div className="auth-bg-text">📚</div>
      </div>

      <div className="auth-card">

        {/* Logo */}
        <Link to="/" className="auth-logo">
          📚 The Grand Library
        </Link>

        {/* Mode toggle */}
        <div className="auth-toggle">
          <button
            className={`toggle-btn ${mode === 'login' ? 'active' : ''}`}
            onClick={() => { setMode('login'); setError('') }}
          >
            Sign In
          </button>
          <button
            className={`toggle-btn ${mode === 'register' ? 'active' : ''}`}
            onClick={() => { setMode('register'); setError('') }}
          >
            Create Account
          </button>
        </div>

        {/* Title */}
        <h1 className="auth-title">
          {mode === 'login'
            ? 'Welcome back'
            : 'Join the library'}
        </h1>
        <p className="auth-subtitle">
          {mode === 'login'
            ? 'Sign in to access your books and character'
            : 'Create a free account to start reading'}
        </p>

        {/* Error message */}
        {error && (
          <div className="auth-error">
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit}>

          {/* Username — only for register */}
          {mode === 'register' && (
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                type="text"
                className="form-input"
                placeholder="scholar_reader"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                minLength={3}
                maxLength={30}
                autoComplete="username"
              />
              <span className="form-hint">
                Letters, numbers, underscores only
              </span>
            </div>
          )}

          {/* Email */}
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder={mode === 'register' ? 'At least 6 characters' : '••••••••'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="auth-submit-btn"
            disabled={loading}
          >
            {loading
              ? 'Please wait...'
              : mode === 'login'
                ? 'Sign In'
                : 'Create Account'}
          </button>

        </form>

        {/* Switch mode link */}
        <p className="auth-switch">
          {mode === 'login'
            ? "Don't have an account? "
            : 'Already have an account? '}
          <button
            className="auth-switch-btn"
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}
          >
            {mode === 'login' ? 'Create one' : 'Sign in'}
          </button>
        </p>

        {/* Continue without account */}
        <Link to="/" className="auth-guest-link">
          Continue as guest →
        </Link>

      </div>
    </div>
  )
}

export default LoginPage