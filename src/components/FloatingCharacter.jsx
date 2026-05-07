import { Link }       from 'react-router-dom'
import { useLibrary } from '../context/LibraryContext'

function FloatingCharacter() {
  const { chosenCharacter } = useLibrary()

  if (!chosenCharacter.name) return null

  return (
    <Link to="/room" className="floating-character">
      {chosenCharacter.emoji} {chosenCharacter.name}
    </Link>
  )
}

export default FloatingCharacter