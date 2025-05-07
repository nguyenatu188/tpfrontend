import { Link } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'
import useLogout from '../hooks/auth/useLogout' // hoặc đúng đường dẫn của bạn

const Header = () => {
  const { authUser } = useAuthContext()
  const { logout, loading } = useLogout()

  return (
    <div className={`${authUser ? 'bg-custom border-2' : ''} border-[#dde9ed] p-2`}>
      <div className='max-w-7xl mx-auto flex justify-between items-center'>
      <Link to="/home">
          <p className={`text-7xl ${authUser ? 'text-custom-2' : ''} font-jembrush cursor-pointer`}>
            TripPlanner
          </p>
        </Link>

        {authUser ? (
          <div className="flex items-center gap-4">
            <span className="text-lg text-custom-2 font-medium">{authUser.fullname}</span>
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
    </div>
  )
}

export default Header
