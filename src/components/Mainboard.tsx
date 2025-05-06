import { useState } from "react"
import { useNavigate } from "react-router-dom"
import useGetTrips from "../hooks/trips/useGetTrips"
import NewTripModal from "./NewTripModal"
import TripCard from "./TripCard"

const Mainboard = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const { trips, loading, refetch } = useGetTrips()
  const [showMap, setShowMap] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === trips.length - 1 ? 0 : prevIndex + 1
    )
  }

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? trips.length - 1 : prevIndex - 1
    )
  }

  const handleTripClick = (id: number) => {
    navigate(`/tripdetail/${id}/plan`)
  }

  const toggleMap = () => {
    setShowMap(!showMap)
  }

  const handleTripAddedOrDeleted = () => {
    refetch()
    // Reset to first slide when the trips list changes
    setCurrentIndex(0)
  }

  const handleModalClose = () => {
    setShowModal(false)
  }

  return (
    <div className="flex flex-col w-full px-4 bg-custom">
      <div className="flex w-full">
        <div
          className={`transition-all duration-500 ease-in-out ${
            showMap ? "w-1/2" : "max-w-5xl"
          } overflow-hidden`}
        >
          <div className="flex my-3">
            <button
              className="btn btn-dash btn-neutral"
              onClick={() => setShowModal(true)}
            >
              NEW
            </button>
            {!loading && trips.length > 0 ? (
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
            ) : null}
          </div>

          {loading ? (
            <p className="text-custom-2 text-center mt-10">Loading trips...</p>
          ) : trips.length > 0 ? (
            <div className="overflow-hidden w-full">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${currentIndex * 100}%)`,
                  width: `${trips.length * 100}%`,
                }}
              >
                {trips.map((trip) => (
                  <div className="w-full flex-shrink-0" key={trip.id}>
                    <TripCard
                      trip={trip}
                      onClick={handleTripClick}
                      onTripDeleted={handleTripAddedOrDeleted}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-custom-2">No trips available</p>
          )}
        </div>

        {/* Map panel */}
        <div
          className={`transition-all duration-500 ease-in-out ${
            showMap ? "w-1/2 opacity-100 h-screen" : "w-0 opacity-0"
          } bg-gray-200 overflow-hidden`}
        >
          <div className="relative h-full">
            <button
              onClick={toggleMap}
              className="absolute top-4 right-4 btn btn-primary bg-blue-400 text-white px-4 py-2 rounded-lg"
            >
              Hide Map
            </button>
            <div className="flex items-center justify-center h-full">
              <p className="text-lg font-bold">Map View (Placeholder)</p>
            </div>
          </div>
        </div>
      </div>

      {!showMap && (
        <div className="flex justify-center mb-4">
          <button
            onClick={toggleMap}
            className="btn btn-primary bg-blue-400 text-white px-4 py-2 rounded-lg mt-4"
          >
            Show Map
          </button>
        </div>
      )}

      {showModal && (
        <NewTripModal
          modalId="create_trip_modal"
          onClose={handleModalClose}
          onTripAdded={handleTripAddedOrDeleted}
        />
      )}
    </div>
  )
}

export default Mainboard
