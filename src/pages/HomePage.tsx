import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Mainboard from "../components/Mainboard";


const HomePage = () => {
  return (
    <>
    <Header />
    <div className="flex flex-row h-screen">
      <Sidebar />
      <Mainboard/>
    </div>
  </>
  );
};

export default HomePage;
