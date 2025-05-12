import { useState } from "react"
import { useNavigate } from "react-router-dom"
import useGetTrips from "../hooks/trips/useGetTrips"
import NewTripModal from "./NewTripModal"
import TripCard from "./TripCard"
import Globe from 'react-globe.gl'
import { Trip } from "../types/trip"

interface MainboardProps {
  userTrips?: Trip[]
  isProfileView?: boolean
}

const Mainboard = ({ userTrips = [], isProfileView = false }: MainboardProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const { trips: authUserTrips, loading, refetch } = useGetTrips()
  const [showMap, setShowMap] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()

  const displayTrips = isProfileView ? userTrips : authUserTrips
  const isLoading = isProfileView ? false : loading

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === displayTrips.length - 1 ? 0 : prevIndex + 1
    )
  }

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? displayTrips.length - 1 : prevIndex - 1
    )
  }

  const handleTripClick = (id: string) => {
    navigate(`/tripdetail/${id}/activity`)
  }

  const toggleMap = () => {
    setShowMap(!showMap)
  }

  const handleTripAddedOrDeleted = () => {
    if (!isProfileView) {
      refetch()
      setCurrentIndex(0)
    }
  }

  const handleModalClose = () => {
    setShowModal(false)
  }

  return (
    <div className="flex flex-col w-full px-4 bg-custom">
      <div className="flex w-full justify-center mt-10">
        <div
          className={`transition-all duration-500 ease-in-out ${
            showMap ? "mr-10" : "w-5xl"
          } overflow-hidden`}
        >
          <div className="flex my-3">
            {!isProfileView && (
              <button
                className="btn btn-dash btn-neutral"
                onClick={() => setShowModal(true)}
              >
                NEW
              </button>
            )}
            {!isLoading && displayTrips.length > 0 ? (
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

          {isLoading ? (
            <p className="text-custom-2 text-center mt-10">Loading trips...</p>
          ) : displayTrips.length > 0 ? (
            <div className="overflow-hidden w-full">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${currentIndex * 100}%)`,
                  width: `${displayTrips.length * 100}%`,
                }}
              >
                {displayTrips.map((trip) => (
                  <div className="w-full flex-shrink-0" key={trip.id}>
                    <TripCard
                      trip={trip}
                      onClick={() => handleTripClick(trip.id)}
                      onTripDeleted={!isProfileView ? handleTripAddedOrDeleted : undefined}
                      viewOnly={isProfileView}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-custom-2">
              {isProfileView ? "Người dùng này chưa có chuyến đi công khai nào" : "No trips available"}
            </p>
          )}
        </div>

        <div
          className={`transition-all duration-500 ease-in-out ${
            showMap ? "w-1/2 opacity-100" : "w-0 h-0 opacity-0"
          } bg-gray-200 overflow-hidden`}
        >
          <div className="relative h-full">
            <button
              onClick={toggleMap}
              className="absolute top-4 right-4 btn btn-primary bg-blue-400 text-white px-4 py-2 rounded-lg z-10"
            >
              Hide Map
            </button>
            <div className="h-full w-full flex justify-center items-center">
              <Globe
                globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
                bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                backgroundColor="rgba(0,0,0,0)"
                width={window.innerWidth / 2}
                height={window.innerHeight}
              />
            </div>
          </div>
        </div>
      </div>

      {!showMap && (
        <div className="flex justify-center">
          <button
            onClick={toggleMap}
            className="btn btn-primary bg-blue-400 text-white px-4 py-2 rounded-lg mt-4"
          >
            Show Map
          </button>
        </div>
      )}

      {!isProfileView && showModal && (
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
