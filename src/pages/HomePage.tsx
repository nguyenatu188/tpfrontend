import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Mainboard from "../components/Mainboard";


const HomePage = () => {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header />
      <div className="flex flex-row flex-1 overflow-hidden">
        <Sidebar />
        <Mainboard />
      </div>
    </div>
  );
};

export default HomePage;
