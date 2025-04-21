import { Link } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'
import useLogout from '../hooks/useLogout' // hoặc đúng đường dẫn của bạn

const Header = () => {
  const { authUser } = useAuthContext()
  const { logout, loading } = useLogout()

  return (
    <div className='max-w-7xl mx-auto mt-5 flex justify-between items-center'>
      <p className='text-7xl font-jembrush'>TripPlanner</p>

      {authUser ? (
        <div className="flex items-center gap-4">
          <span className="text-lg font-medium">{authUser.fullname}</span>
          <button
            onClick={logout}
            className={`btn btn-error text-white ${loading ? 'btn-disabled' : ''}`}
          >
            {loading ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      ) : (
        <div className='flex gap-4'>
          <Link to="/login">
            <button className="btn btn-ghost">Login</button>
          </Link>
          <Link to="/register">
            <button className="btn btn-outline btn-info">Sign up for free</button>
          </Link>
        </div>
      )}
    </div>
  )
}

export default Header
