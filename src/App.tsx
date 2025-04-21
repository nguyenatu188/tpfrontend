  import { Route, Routes, Navigate } from "react-router-dom"
  import Login from "./pages/Login"
  import Register from "./pages/Register"
  import { useAuthContext } from "./context/AuthContext"
  import LandingPage from "./pages/LandingPage"
  import HomePage from "./pages/HomePage"

  function App() {
    const { authUser, isLoading } = useAuthContext()
    if (isLoading) return null
    return (
      <Routes>
        <Route path="/" element={ !authUser ? <LandingPage/> : <Navigate to="/home"/> } />
        <Route path="/home" element={authUser ? <HomePage/> : <Navigate to="/login"/> } />
        <Route path="/register" element={!authUser ? <Register/> : <Navigate to="/home"/> } />
        <Route path="/login" element={!authUser ? <Login/> : <Navigate to="/home"/> } />
      </Routes>
    )
  }

  export default App
