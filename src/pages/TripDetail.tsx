import { useEffect } from "react";
import {
  Routes,
  Route,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import SidebarTrip from "../components/SidebarTrip";
// import Budget from "../components/Budget";
import Packing from "../components/Packing";
import Collection from "../components/Collection";
// import Discover from "../components/Discover";
  import Accommodation from "../components/Accommodation";
  import Transport from "../components/Transport";
// import Activity from "../components/Activity";

const TripDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    console.log("Current location:", location.pathname); // Thêm log để kiểm tra URL
    if (!id) {
      navigate("/home", { replace: true });
    } else if (location.pathname === `/tripdetail/${id}`) {
      navigate(`/tripdetail/${id}/activity`, { replace: true });
    }
  }, [id, location.pathname, navigate]);

  if (!id) {
    return <div className="p-6 text-red-500">Invalid Trip ID</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="fixed top-0 left-0 w-64 h-full bg-white shadow-md">
        <SidebarTrip tripId={id} />
      </div>
      <div className="flex-1 ml-64">
        <Routes>
          {/* <Route path="activity" element={<Activity tripId={tripId} />} />
          <Route path="budget" element={<Budget tripId={tripId} />} /> */}
          <Route path="packing" element={<Packing tripId={id} />} />
          <Route path="collection" element={<Collection tripId={id} />} /> 
          {/* <Route path="discover" element={<Discover />} /> */}
          <Route path="accommodation" element={<Accommodation tripId={id} />} />
          <Route path="transport" element={<Transport tripId={id} />} />
          <Route
            path="*"
            element={<div className="p-6 text-red-500">Route not found!</div>}
          />
        </Routes>
      </div>
    </div>
  );
};

export default TripDetail;
