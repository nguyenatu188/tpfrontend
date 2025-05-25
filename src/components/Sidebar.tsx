import { useState, useEffect } from "react"
import { useAuthContext } from "../context/AuthContext"

interface User {
  id: string;
  username: string;
  fullname: string;
  avatarUrl?: string;
}

interface SidebarProps {
  profileUser?: User; // Optional prop for profile view
}

type MenuItem = "Trip";

const Sidebar = ({ profileUser }: SidebarProps) => {
  const { authUser } = useAuthContext();
  const [activeMenu, setActiveMenu] = useState<MenuItem>("Trip")
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [isSearching, setIsSearching] = useState(false);

  // Use profileUser if provided, otherwise fall back to authUser
  const displayUser = profileUser || authUser;

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length >= 2) {
        setIsSearching(true);
        searchUsers();
      } else {
        setSearchResults([]);
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const searchUsers = async () => {
    try {
      const response = await fetch(
        `/api/users/search?query=${encodeURIComponent(searchQuery)}`,
        { credentials: "include" }
      );
      const data = await response.json();
      setSearchResults(data.data.users || []);
    } catch (error) {
      console.error("Error searching users:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }

  const handleMenuClick = (menu: MenuItem) => {
    setActiveMenu(menu);
  }

  return (
    <ul className="menu bg-custom w-64 border-r-1 border-[#dde9ed] text-black">
      <li className="border-b-1 border-[#dde9ed] mt-5">
        <div className="avatar">
          <div className="w-24 rounded-full">
            <img
              src={displayUser?.avatarUrl || "/default-avatar.png"}
              alt="avatar"
            />
          </div>
        </div>

        <div className="flex flex-col justify-start items-start">
          <h1 className="text-xl text-black font-bold block">
            {displayUser?.fullname || "Loading..."}
          </h1>
          <p className="text-sm text-black">@{displayUser?.username || ""}</p>
        </div>

        <div className="flex flex-row mb-5">
          <div className="flex flex-col">
            <div>0</div>
            <div>followers</div>
          </div>
          <div className="flex flex-col">
            <div>0</div>
            <div>following</div>
          </div>
          <div className="flex flex-col">
            <div>0</div>
            <div>countries</div>
          </div>
        </div>
      </li>

      <li className="my-8 relative">
        <label className="input bg-custom border-[#dde9ed] border-2">
          <svg
            className="h-[1em] opacity-50"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2.5"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </g>
          </svg>
          <input
            type="search"
            placeholder="Tìm theo username hoặc fullname"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </label>

        {searchQuery.length >= 1 && (
          <div className="absolute top-12 left-0 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-[320px] overflow-y-auto z-10 flex flex-col">
            {isSearching ? (
              <div className="p-2 text-gray-500 text-center text-sm">
                Searching...
              </div>
            ) : (
              <>
                {searchResults.length > 0 ? (
                  searchResults.slice(0, 5).map((user) => (
                    <a
                      key={user.id}
                      href={user.username === authUser?.username ? "/home" : `/profile/${user.username}`}
                      className="flex items-center p-2 border-b border-gray-200 hover:bg-gray-50 last:border-b-0 w-full"
                    >
                      <img
                        src={user.avatarUrl || "/default-avatar.png"}
                        alt={user.username}
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <div className="flex flex-col">
                        <p className="text-sm font-medium text-gray-800">
                          {user.fullname}
                        </p>
                        <p className="text-xs text-gray-600">@{user.username}</p>
                      </div>
                    </a>
                  ))
                ) : (
                  <div className="p-2 text-gray-500 text-center text-sm">
                    No users found
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </li>

      <li className="my-2">
        <a
          className={`font-jembrush text-3xl ${
            activeMenu === "Trip" ? "menu-active" : ""
          }`}
          onClick={() => handleMenuClick("Trip")}
        >
          Trip
        </a>
      </li>
    </ul>
  )
}

export default Sidebar
