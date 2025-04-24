import { useState } from "react";
import { useNavigate } from "react-router-dom";
import tripsData from "../data/tripsData.json";

const Mainboard = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [trips] = useState(tripsData);
  const [showMap, setShowMap] = useState(false);
  const navigate = useNavigate();

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === trips.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? trips.length - 1 : prevIndex - 1
    );
  };

  const handleTripClick = (id: number) => {
    navigate(`/tripdetail/${id}/plan`);
  };

  const toggleMap = () => {
    setShowMap(!showMap);
  };

  return (
    <div className="flex flex-col w-full px-4 bg-custom">
      <div className="flex w-full">
        {/* Mainboard content */}
        <div
          className={`transition-all duration-500 ease-in-out ${
            showMap ? "w-1/2" : "w-full"
          } overflow-hidden`}
        >
          <div className="flex my-3">
            <button className="btn btn-dash btn-neutral">NEW</button>
            <div className="flex flex-row justify-end items-center w-full h-10">
              <button
                onClick={handlePrev}
                className="btn btn-circle border-none btn-md mx-2 bg-custom text-black"
              >
                ❮
              </button>
              <button
                onClick={handleNext}
                className="btn btn-circle border-none btn-md mx-2 bg-custom text-black"
              >
                ❯
              </button>
            </div>
          </div>
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {trips.map((trip) => (
              <div
                key={trip.id}
                className="w-full flex-shrink-0 rounded-xl bg-container shadow-md overflow-hidden mb-4 cursor-pointer"
                onClick={() => handleTripClick(trip.id)}
              >
                <header className="flex items-center p-4">
                  <div className="avatar w-9 h-9 mx-2">
                    <img
                      src={trip.avatar}
                      alt={trip.username}
                      className="rounded-full w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-sm font-medium text-white">
                    {trip.username}
                  </p>
                </header>

                <div className="flex flex-col">
                  <div className="relative w-full h-48">
                    <img
                      src={trip.backgroundImage}
                      alt={trip.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 flex space-x-2">
                      <span className="bg-white text-gray-700 text-xs font-semibold px-2 py-1 rounded-full shadow">
                        🕒 {trip.nights} nights
                      </span>
                      <span className="bg-white text-gray-700 text-xs font-semibold px-2 py-1 rounded-full shadow">
                        📍 {trip.destinations} destination
                        {trip.destinations > 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h2 className="text-lg font-bold text-white">
                      {trip.name}
                    </h2>
                    <p className="text-sm text-white">
                      {trip.startDate} - {trip.endDate}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Map panel at the same level */}
        <div
          className={`transition-all duration-500 ease-in-out h-auto ${
            showMap ? "w-1/2 opacity-100" : "w-0 opacity-0"
          } bg-gray-200 overflow-hidden`}
        >
          <div className="relative h-full">
            {/* Hide Map button on the map panel */}
            <button
              onClick={toggleMap}
              className="absolute top-4 right-4 btn btn-primary bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Hide Map
            </button>
            {/* Placeholder for map content */}
            <div className="flex items-center justify-center h-full">
              <p className="text-lg font-bold">Map View (Placeholder)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Show Map Button (only visible when map is hidden) */}
      {!showMap && (
        <div className="flex justify-center mb-4">
          <button
            onClick={toggleMap}
            className="btn btn-primary bg-blue-500 text-white px-4 py-2 rounded-lg mt-4"
          >
            Show Map
          </button>
        </div>
      )}
    </div>
  );
};

export default Mainboard;
