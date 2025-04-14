import { Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  )
}

export default App
