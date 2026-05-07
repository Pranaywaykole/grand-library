/* src/components/NavBar.jsx — Updated */
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useLibrary } from '../context/LibraryContext'

function NavBar() {
  const { chosenCharacter, user, logout, isLoggedIn } = useLibrary()
  const location = useLocation()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  function isActive(path) {
    return location.pathname === path ? 'nav-link active-link' : 'nav-link'
  }

  return (
    <nav className="navbar">
      <div className="nav-logo">📚 The Grand Library</div>

      <div className="nav-links">
        <Link to="/"     className={isActive('/')}>Home</Link>
        <a href="#books"      className="nav-link">Library</a>
        <a href="#characters" className="nav-link">My Character</a>
        <Link to="/room" className={isActive('/room')}>Enter Room</Link>
      </div>

      <div className="nav-auth">
        {isLoggedIn ? (
          <>
            {chosenCharacter.name && (
              <div className="nav-character">
                <span>{chosenCharacter.emoji}</span>
                <span>{chosenCharacter.name}</span>
              </div>
            )}
            <span className="nav-username">
              {user?.username}
            </span>
            <button
              className="nav-logout-btn"
              onClick={handleLogout}
            >
              Sign Out
            </button>
          </>
        ) : (
          <Link to="/login" className="nav-login-btn">
            Sign In
          </Link>
        )}
      </div>
    </nav>
  )
}

export default NavBar