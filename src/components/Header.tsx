import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <>
      <div className='max-w-7xl mx-auto mt-5 flex justify-between items-center'>
        <p className='text-7xl font-jembrush'>TripPlanner</p>
        <div className='flex gap-4'>
          <Link to="/login">
            <button className="btn btn-ghost">Login</button>
          </Link>
          <Link to="/register">
            <button className="btn btn-outline btn-info">Sign up for free</button>
          </Link>
        </div>
      </div>
    </>
  )
}

export default Header
