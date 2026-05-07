import { useNavigate } from 'react-router-dom'
import { useLibrary }  from '../context/LibraryContext'

function ReadingHistory() {
  const { readingHistory, addToHistory } = useLibrary()
  const navigate = useNavigate()

  /*
    Don't show the section at all if the user
    has not opened any books yet.
  */
  if (readingHistory.length === 0) return null

  function handleClick(book) {
    addToHistory(book)
    navigate(`/reader/${book.id}`)
  }

  return (
    <section className="history-section">
      <h2>Continue Reading</h2>
      <p className="section-subtitle">
        Pick up where you left off
      </p>

      <div className="history-container">
        {readingHistory.map(book => (
          <div
            key={book.id}
            className="history-card"
            onClick={() => handleClick(book)}
          >
            <img
              src={book.cover ||
                `https://via.placeholder.com/100x140/1a1a2e/c9a84c?text=📚`}
              alt={book.title}
              className="history-cover"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/100x140/1a1a2e/c9a84c?text=📚"
              }}
            />
            <p className="history-title">
              {book.title.length > 30
                ? book.title.slice(0, 28) + "..."
                : book.title}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default ReadingHistory