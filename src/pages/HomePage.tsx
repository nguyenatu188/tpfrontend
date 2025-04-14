import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import Mainboard from "../components/Mainboard";


const HomePage = () => {
  return (
    <>
    <Header />
    <div className="flex flex-row h-screen">
      <Sidebar />
      <Mainboard />
    </div>
    <Footer />
  </>
  );
};

export default HomePage;
