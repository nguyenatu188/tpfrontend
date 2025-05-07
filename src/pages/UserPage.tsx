import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import UserProfile from "../components/UserProfile";

const UserPage = () => {
  return (
    <>
      <Header />
      <div className="flex flex-row h-screen">
        <Sidebar />
        <UserProfile />
      </div>
    </>
  );
};

export default UserPage;
