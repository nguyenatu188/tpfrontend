import { NavLink, Link } from "react-router-dom"

// Định nghĩa kiểu cho props của SidebarTrip
interface SidebarTripProps {
  id: string
}

const SidebarTrip: React.FC<SidebarTripProps> = ({ id }) => {
  return (
    <div className="flex flex-col h-full p-4">
      {/* Logo */}
      <div className="mb-8">
      <Link to="/home">
        <span className="text-2xl font-bold text-custom">Travel with us</span>
      </Link>
    </div>
      {/* Các tab điều hướng */}
      <nav className="flex-1 space-y-4">

        <NavLink
          to={`/tripdetail/${id}/activity`}
          className={({ isActive }) =>
            isActive
              ? "flex items-center space-x-2 p-2 bg-text-custom text-white rounded-lg"
              : "flex items-center space-x-2 p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          }
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span>Activity</span>
        </NavLink>

        <NavLink
          to={`/tripdetail/${id}/accommodation`}
          className={({ isActive }) =>
            isActive
              ? "flex items-center space-x-2 p-2 bg-text-custom text-white rounded-lg"
              : "flex items-center space-x-2 p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          }
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Accommodation</span>
        </NavLink>

        <NavLink
          to={`/tripdetail/${id}/transport`}
          className={({ isActive }) =>
            isActive
              ? "flex items-center space-x-2 p-2 bg-text-custom text-white rounded-lg"
              : "flex items-center space-x-2 p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          }
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16 11V7a4 4 0 00-8 0v4m-4 0h16v10a2 2 0 01-2 2H6a2 2 0 01-2-2V11z"
            />
          </svg>
          <span>Transport</span>
        </NavLink>

        <NavLink
          to={`/tripdetail/${id}/budget`}
          className={({ isActive }) =>
            isActive
              ? "flex items-center space-x-2 p-2 bg-text-custom text-white rounded-lg"
              : "flex items-center space-x-2 p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          }
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 5h14v14H5z"
            />
          </svg>
          <span>Budget</span>
        </NavLink>

        <NavLink
          to={`/tripdetail/${id}/packing`}
          className={({ isActive }) =>
            isActive
              ? "flex items-center space-x-2 p-2 bg-text-custom text-white rounded-lg"
              : "flex items-center space-x-2 p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          }
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <span>Packing</span>
        </NavLink>

        <NavLink
          to={`/tripdetail/${id}/collection`}
          className={({ isActive }) =>
            isActive
              ? "flex items-center space-x-2 p-2 bg-text-custom text-white rounded-lg"
              : "flex items-center space-x-2 p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          }
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <span>Collection</span>
        </NavLink>
        <NavLink
          to={`/tripdetail/${id}/discover`}
          className={({ isActive }) =>
            isActive
              ? "flex items-center space-x-2 p-2 bg-text-custom text-white rounded-lg"
              : "flex items-center space-x-2 p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          }
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <span>Discover</span>
        </NavLink>
      </nav>
    </div>
  )
}

export default SidebarTrip
