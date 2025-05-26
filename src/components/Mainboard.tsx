import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useGetTrips } from "../hooks/trips/useGetTrips"
import NewTripModal from "./NewTripModal"
import TripCard from "./TripCard"
import Globe from 'react-globe.gl'
import * as THREE from 'three'
import { Trip } from "../types/trip"

interface MainboardProps {
  userTrips?: Trip[]
  isProfileView?: boolean
}

interface CountryPoint {
  lat: number
  lng: number
  country: string
  trips: Trip[]
  radius: number
  color: string
}

interface TooltipPosition {
  x: number
  y: number
}

const Mainboard = ({ userTrips = [], isProfileView = false }: MainboardProps) => {
  const { trips: authUserTrips, loading, refetch } = useGetTrips()
  const [showMap, setShowMap] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()
  const [hoveredCountryTrips, setHoveredCountryTrips] = useState<Trip[] | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition>({ x: 0, y: 0 })
  const globeContainerRef = useRef<HTMLDivElement>(null)

  const displayTrips = isProfileView ? userTrips : authUserTrips
  const isLoading = isProfileView ? false : loading

  const tripsByCountry = displayTrips.reduce<Record<string, Trip[]>>((acc, trip) => {
    const key = trip.country
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(trip)
    return acc
  }, {})

  const countryPoints: CountryPoint[] = Object.values(tripsByCountry)
    .filter(countryTrips => 
      countryTrips[0].lat !== undefined && 
      countryTrips[0].lng !== undefined
    )
    .map(countryTrips => ({
      lat: countryTrips[0].lat as number,
      lng: countryTrips[0].lng as number,
      country: countryTrips[0].country,
      trips: countryTrips,
      radius: 0.8,
      color: '',
      label: `${countryTrips.length} ${countryTrips.length > 1 ? 'trips' : 'trip'}`,
  }))

  const handleTripClick = (id: string) => {
    navigate(`/tripdetail/${id}/activity`)
  }

  const toggleMap = () => {
    setShowMap(!showMap)
  }

  const handleTripAddedOrDeletedorUpdated = () => {
    if (!isProfileView) {
      refetch()
    }
  }

  const handleModalClose = () => {
    setShowModal(false)
  }

  // Handle mouse move để cập nhật vị trí tooltip
  const handleMouseMove = (event: MouseEvent) => {
    if (globeContainerRef.current) {
      const rect = globeContainerRef.current.getBoundingClientRect()
      setTooltipPosition({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      })
    }
  }

  // Handle point hover với mouse tracking
  const handlePointHover = (point: object | null) => {
    const countryPoint = point as CountryPoint
    
    if (countryPoint?.trips) {
      setHoveredCountryTrips(countryPoint.trips)
      // Add event listener for mouse move when hovering
      if (globeContainerRef.current) {
        globeContainerRef.current.addEventListener('mousemove', handleMouseMove)
      }
    } else {
      setHoveredCountryTrips(null)
      // Remove event listener when not hovering
      if (globeContainerRef.current) {
        globeContainerRef.current.removeEventListener('mousemove', handleMouseMove)
      }
    }
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
          onTripDeleted={!isProfileView ? handleTripAddedOrDeletedorUpdated : undefined}
          viewOnly={isProfileView}
          onTripUpdated={!isProfileView ? handleTripAddedOrDeletedorUpdated : undefined}
        />
      </div>
      <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
        <a href={`#slide${index === 0 ? displayTrips.length - 1 : index - 1}`} className="btn btn-circle border-none btn-md mx-2 bg-custom text-black">❮</a>
        <a href={`#slide${index === displayTrips.length - 1 ? 0 : index + 1}`} className="btn btn-circle border-none btn-md mx-2 bg-custom text-black">❯</a>
      </div>
    </div>
  ))

  return (
    <div className="flex flex-col w-full justify-center items-center px-4 overflow-hidden bg-custom">
      <div className="flex w-full justify-center items-center">
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
          <div className="relative w-full h-full" ref={globeContainerRef}>
            <button
              onClick={toggleMap}
              className="absolute top-4 right-4 btn btn-primary bg-blue-400 text-white px-4 py-2 rounded-lg z-10"
            >
              Hide Map
            </button>
            <div className="h-[600px] w-full flex justify-center items-center">
              <Globe
                globeImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/earth-day.jpg"
                backgroundImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/night-sky.png"
                bumpImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/earth-topology.png"
                backgroundColor="rgba(255,255,255,0)"
                atmosphereColor="rgba(184, 224, 255, 0.8)"
                atmosphereAltitude={0.25}
                pointsData={countryPoints}
                onObjectHover={handlePointHover}
                pointLabel="name"
                // Custom 3D objects thay vì points mặc định
                objectsData={countryPoints}
                objectThreeObject={(point) => {
                  const countryPoint = point as CountryPoint
                  const tripCount = countryPoint.trips.length
                  
                  const group = new THREE.Group()
                  
                  // Tạo sphere chính (như một hành tinh nhỏ)
                  const sphereGeometry = new THREE.SphereGeometry(3.5, 16, 16)
                  const sphereMaterial = new THREE.MeshLambertMaterial({ 
                    color: tripCount > 3 ? '#ff6b6b' : tripCount > 1 ? '#4ecdc4' : '#45b7d1',
                    transparent: true,
                    opacity: 1
                  })
                  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
                  group.add(sphere)
                  
                  // Thêm ring xung quanh sphere (như vành đai)
                  const ringGeometry = new THREE.RingGeometry(5, 8, 16)
                  const ringMaterial = new THREE.MeshBasicMaterial({ 
                    color: '#ffffff',
                    transparent: true,
                    opacity: 0.6,
                    side: THREE.DoubleSide
                  })
                  const ring = new THREE.Mesh(ringGeometry, ringMaterial)
                  ring.rotation.x = Math.PI / 1.5 // Xoay ring để nằm ngang
                  group.add(ring)
                  
                  // Thêm glow effect
                  const glowGeometry = new THREE.SphereGeometry(2.2, 16, 16)
                  const glowMaterial = new THREE.MeshBasicMaterial({
                    color: tripCount > 3 ? '#ff6b6b' : tripCount > 1 ? '#4ecdc4' : '#45b7d1',
                    transparent: true,
                    opacity: 0.3
                  })
                  const glow = new THREE.Mesh(glowGeometry, glowMaterial)
                  group.add(glow)
                  
                  // Animation: làm ring quay và glow nhấp nháy
                  let time = 0
                  const animate = () => {
                    time += 0.01
                    ring.rotation.z = time
                    if (glow.material instanceof THREE.MeshBasicMaterial) {
                      glow.material.opacity = 0.2 + Math.sin(time * 2) * 0.1
                    }
                    requestAnimationFrame(animate)
                  }
                  animate()
                  
                  return group
                }}
                objectAltitude={0.1}
                pointColor={"00FFFFFF"}
              />
            </div>

            {/* Tooltip hiển thị theo vị trí mouse với DaisyUI */}
            {hoveredCountryTrips && (
              <div 
                className="absolute pointer-events-none z-50"
                style={{
                  left: `${tooltipPosition.x + 10}px`,
                  top: `${tooltipPosition.y - 10}px`,
                  transform: 'translateY(-100%)'
                }}
              >
                <div className="card compact bg-base-100 shadow-xl border border-base-300 max-w-xs">
                  <div className="card-body p-3">
                    <h3 className="card-title text-sm font-bold text-base-content">
                      📍 {hoveredCountryTrips[0].country}
                    </h3>
                    <div className="divider my-1"></div>
                    <ul className="space-y-1">
                      {hoveredCountryTrips.map((trip) => (
                        <li 
                          key={trip.id} 
                          className="text-xs text-base-content/80 hover:text-primary cursor-pointer flex items-center gap-1 p-1 rounded hover:bg-base-200 transition-colors pointer-events-auto"
                          onClick={() => handleTripClick(trip.id)}
                        >
                          <span className="text-primary">✈️</span>
                          <span className="truncate">{trip.title}</span>
                        </li>
                      ))}
                    </ul>
                    {hoveredCountryTrips.length > 1 && (
                      <div className="badge badge-primary badge-sm mt-1">
                        {hoveredCountryTrips.length} trips
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
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
          onTripAdded={handleTripAddedOrDeletedorUpdated}
        />
      )}
    </div>
  )
}

export default Mainboard
