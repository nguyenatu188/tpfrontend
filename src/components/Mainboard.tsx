import { useState } from "react";
import { useNavigate } from "react-router-dom";
import tripsData from "../data/tripsData.json";


const Mainboard = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [trips] = useState(tripsData);
  // const [loading, setLoading] = useState(false);
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

  return (
    <div className="flex flex-col w-full p-4 bg-custom">
      <div className="relative w-full overflow-hidden">
        <div className="flex mb-4">
          <button className="btn btn-dash btn-info btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl">New</button>
          {/* Điều hướng trái phải */}
          <div className="flex flex-row justify-end items-center w-full h-10 mt-2 mb-2">

            <button
              onClick={handlePrev}
              className="btn btn-circle border-none btn-md mx-2 bg-custom text-black "
            >
              ❮
            </button>

            <button
              onClick={handleNext}
              className="btn btn-circle border-none btn-md mx-2 bg-custom text-black "
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
    </div>
  );
};

export default Mainboard;
