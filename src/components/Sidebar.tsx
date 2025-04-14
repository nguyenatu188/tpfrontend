const Sidebar = () => {
  return (
    <ul className="menu bg-base-200 w-56 h-screen ">
      <li className="mb-10">
        <div className="avatar">
          <div className="ring-primary ring-offset-base-100 w-24 rounded-full ring ring-offset-2">
            <img src="src\assets\tu.png" alt="avatar" />
          </div>
        </div>

        <div className="flex flex-col justify-start items-start">
          <h1 className="text-xl text-primary-content font-bold block">
            Nguyễn Anh Tú
          </h1>
          <p className="text-sm">@natus</p>
        </div>
        <div className="flex flex-row ...">
          <div className="flex flex-col ...">
            <div>1000000</div>
            <div>followers</div>
          </div>
          <div className="flex flex-col ...">
            <div>1</div>
            <div>following</div>
          </div>
          <div className="flex flex-col ...">
            <div>1</div>
            <div>countries</div>
          </div>
        </div>
      </li>
      <li className="mb-4">
        <label className="input">
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
      <li>
        <a className="menu-active">Trip</a>
      </li>
      <li>
        <a className="">Countries</a>
      </li>
      <div className="mt-auto">
        <li>
          <a>Share profile</a>
        </li>
        <li>
          <a>Country</a>
        </li>
      </div>
    </ul>
  );
};

export default Sidebar;
