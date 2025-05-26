import { useGetTripDetailsAndRelated } from "../hooks/trips/useGetTripDetailsAndRelated";
import TripCard from "./TripCard";
import { useNavigate } from "react-router-dom";

interface CollectionProps {
  tripId: string;
}

const Collection = ({ tripId }: CollectionProps) => {
  const { currentTrip, relatedTrips, loading, error } = useGetTripDetailsAndRelated(tripId);
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800">Collection Page</h1>
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (error || !currentTrip) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800">Collection Page</h1>
        <p className="text-gray-500">{error || "Trip not found!"}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-700 mt-4">City: {currentTrip.city}</h2>
      <div className="related-trips mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {relatedTrips.length > 0 ? (
          relatedTrips.map((trip) => (
            <div
              key={trip.id}
              className="border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
            >
              <TripCard
                trip={trip}
                onClick={(id) => navigate(`/tripdetail/${id}/activity`)}
                viewOnly={true}
              />
            </div>
          ))
        ) : (
          <p className="text-gray-500">No other trips found in {currentTrip.city}.</p>
        )}
      </div>
    </div>
  );
};

export default Collection;