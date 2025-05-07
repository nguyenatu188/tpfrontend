import { Route, Routes, Navigate } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import Login from "./pages/Login"
import Register from "./pages/Register"
import HomePage from "./pages/HomePage"
import { useAuthContext } from "./context/AuthContext"
import TripDetail from "./pages/TripDetail"
import ForgetPassword from "./pages/Forgetpassword"
import ResetPassword from "./pages/ResetPassword"
import UserProfilePage from "./pages/UserProfilePage"

function App() {
  const { authUser, isLoading } = useAuthContext()
  if (isLoading) return null
  return (
    <Routes>
      <Route path="/" element={ !authUser ? <LandingPage/> : <Navigate to="/home"/> } />
      <Route path="/home" element={authUser ? <HomePage/> : <Navigate to="/login"/> } />
      <Route path="/tripdetail/:id/*" element={ authUser? <TripDetail /> : <Navigate to="/login"/>} />
      <Route path="/register" element={!authUser ? <Register/> : <Navigate to="/home"/> } />
      <Route path="/login" element={!authUser ? <Login/> : <Navigate to="/home"/> } />
      <Route path="/forgetpassword" element={!authUser ? <ForgetPassword /> : <Navigate to="/home" />} />
      <Route path="/reset-password" element={!authUser ? <ResetPassword /> : <Navigate to="/home" />} />

      <Route path="/profile/:username" element={<UserProfilePage />} />
    </Routes>
  )
}

  export default App
