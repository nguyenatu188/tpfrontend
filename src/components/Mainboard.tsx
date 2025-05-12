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
  const { trips: authUserTrips, loading, refetch } = useGetTrips()
  const [showMap, setShowMap] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()

  const displayTrips = isProfileView ? userTrips : authUserTrips
  const isLoading = isProfileView ? false : loading

  const handleTripClick = (id: string) => {
    navigate(`/tripdetail/${id}/activity`)
  }

  const toggleMap = () => {
    setShowMap(!showMap)
  }

  const handleTripAddedOrDeleted = () => {
    if (!isProfileView) {
      refetch()
    }
  }

  const handleModalClose = () => {
    setShowModal(false)
  }

  const carouselItems = displayTrips.map((trip, index) => (
    <div 
      key={trip.id} 
      id={`slide${index}`} 
      className="carousel-item relative w-full"
    >
      <div className="w-full mx-auto px-4">
        <TripCard
          trip={trip}
          onClick={() => handleTripClick(trip.id)}
          onTripDeleted={!isProfileView ? handleTripAddedOrDeleted : undefined}
          viewOnly={isProfileView}
        />
      </div>
      <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
        <a href={`#slide${index === 0 ? displayTrips.length - 1 : index - 1}`} className="btn btn-circle border-none btn-md mx-2 bg-custom text-black">❮</a>
        <a href={`#slide${index === displayTrips.length - 1 ? 0 : index + 1}`} className="btn btn-circle border-none btn-md mx-2 bg-custom text-black">❯</a>
      </div>
    </div>
  ))

  return (
    <div className="flex flex-col w-full px-4 overflow-hidden bg-custom">
      <div className="flex w-full justify-center mt-10">
        <div className="transition-all duration-500 ease-in-out w-full max-w-xl">
          <div className="flex my-3">
            {!isProfileView && (
              <button
                className="btn btn-dash btn-neutral"
                onClick={() => setShowModal(true)}
              >
                NEW
              </button>
            )}
          </div>

          {isLoading ? (
            <p className="text-custom-2 text-center mt-10">Loading trips...</p>
          ) : displayTrips.length > 0 ? (
              <div className="carousel w-full">
                {carouselItems}
              </div>
          ) : (
            <p className="text-custom-2">
              {isProfileView ? "Người dùng này chưa có chuyến đi công khai nào" : "No trips available"}
            </p>
          )}
        </div>

        <div
          className={`transition-all duration-500 ease-in-out ${
            showMap ? "ml-20 w-2/5 opacity-100" : "w-0 h-0 opacity-0"
          } h-auto max-h-[600px] bg-gray-200 overflow-hidden`}
        >
          <div className="relative w-full h-full">
            <button
              onClick={toggleMap}
              className="absolute top-4 right-4 btn btn-primary bg-blue-400 text-white px-4 py-2 rounded-lg z-10"
            >
              Hide Map
            </button>
            <div className="h-[600px] w-full flex justify-center items-center">
              <Globe
                globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
                bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                backgroundColor="rgba(0,0,0,0)"
                pointsData={displayTrips.map(trip => ({
                  lat: trip.lat,
                  lng: trip.lng,
                  name: trip.title
                }))}
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
