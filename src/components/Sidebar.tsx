import { useState } from "react";
import { useAuthContext } from "../context/AuthContext"; // Đường dẫn tùy thuộc vào cấu trúc thư mục của bạn

// Define the possible menu items as a union type
type MenuItem = "Trip" | "Countries" | "Share profile" | "Country";

const Sidebar = () => {
  const { authUser } = useAuthContext();
  const [activeMenu, setActiveMenu] = useState<MenuItem>("Trip");

  const handleMenuClick = (menu: MenuItem) => {
    setActiveMenu(menu);
  };

  return (
    <ul className="menu bg-custom w-56 h-screen w-auto border-r-1 border-[#dde9ed] text-black">
      <li className="border-b-1 border-[#dde9ed] mt-5">
        <div className="avatar">
          <div className="w-24 rounded-full">
            <img
              src={authUser?.avatarUrl || "/default-avatar.png"} // fallback nếu chưa có ảnh
              alt="avatar"
            />
          </div>
        </div>

        <div className="flex flex-col justify-start items-start">
          <h1 className="text-xl text-black font-bold block">
            {authUser?.fullname || "Loading..."}
          </h1>
          <p className="text-sm text-black">{authUser?.username || ""}</p>
        </div>

        {/* Nếu muốn có follower/following/countries thì cần fetch thêm từ backend */}
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

      <li className="my-8">
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
          <input type="search" required placeholder="Search" />
        </label>
      </li>

      <li className="my-2">
        <a
          className={activeMenu === "Trip" ? "menu-active" : ""}
          onClick={() => handleMenuClick("Trip")}
        >
          Trip
        </a>
      </li>
      <li>
        <a
          className={activeMenu === "Countries" ? "menu-active" : ""}
          onClick={() => handleMenuClick("Countries")}
        >
          Countries
        </a>
      </li>
      <div className="mt-auto">
        <li>
          <a
            className={activeMenu === "Share profile" ? "menu-active" : ""}
            onClick={() => handleMenuClick("Share profile")}
          >
            Share profile
          </a>
        </li>
        <li>
          <a
            className={activeMenu === "Country" ? "menu-active" : ""}
            onClick={() => handleMenuClick("Country")}
          >
            Country
          </a>
        </li>
      </div>
    </ul>
  );
};

export default Sidebar;
