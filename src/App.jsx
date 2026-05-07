import { Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import HomePage    from './pages/HomePage'
import RoomPage    from './pages/RoomPage'
import ReaderPage  from './pages/ReaderPage'
import Notification from './components/Notification'
import LoginPage from './pages/LoginPage'
import './App.css'

function App() {
  return (
    <>
      <Routes>
        <Route path="/"              element={<HomePage />} />
        <Route path="/room"          element={<RoomPage />} />
        <Route path="/reader/:bookId" element={<ReaderPage />} />
        <Route path="/login"         element={<LoginPage />} />
        {/* <Route path="*"              element={<NotFoundPage />} /> */}
      </Routes>
      {/* <NotificationSystem /> */}
    </>
  )
}

export default App