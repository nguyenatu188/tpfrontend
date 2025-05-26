import { useEffect, useState } from "react"
import { Trip } from "../types/trip"
import { useCountryCityData } from "../utils/useCountryCityData"
import { useUpdateTripDetails } from "../hooks/trips/useUpdateTripDetails"
import { toast } from "react-toastify"

interface EditTripModalProps {
  isOpen: boolean
  onClose: () => void
  trip: Trip
  onSave: () => void
}

const EditTripModal = ({ isOpen, onClose, trip, onSave }: EditTripModalProps) => {
  const [currentCountryCode, setCurrentCountryCode] = useState("")
  const { updateTripDetails } = useUpdateTripDetails()
  const {
    countries,
    cities,
    loadingCountries,
    loadingCities,
    fetchCities,
  } = useCountryCityData()

  const [editFormData, setEditFormData] = useState<{
    title: string
    countryCode: string
    city: string
    startDate: string
    endDate: string
  }>({
    title: trip.title,
    countryCode: "",
    city: trip.city,
    startDate: new Date(trip.startDate).toISOString().split('T')[0],
    endDate: new Date(trip.endDate).toISOString().split('T')[0],
  })

  useEffect(() => {
    if (isOpen && countries.length > 0) {
      const matchedCountry = countries.find(c => c.name === trip.country)
      if (matchedCountry) {
        setCurrentCountryCode(matchedCountry.code)
        fetchCities(matchedCountry.code)
      }
    }
  }, [isOpen, countries, trip.country])

  useEffect(() => {
    if (currentCountryCode) {
      setEditFormData(prev => ({
        ...prev,
        countryCode: currentCountryCode
      }))
    }
  }, [currentCountryCode])

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCode = e.target.value
    setCurrentCountryCode(selectedCode)
    fetchCities(selectedCode)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const selectedCountry = countries.find(c => c.code === editFormData.countryCode)
      await updateTripDetails(trip.id, {
        title: editFormData.title,
        country: selectedCountry?.name || editFormData.countryCode,
        city: editFormData.city,
        startDate: editFormData.startDate,
        endDate: editFormData.endDate,
      })
      onClose()
      toast.success("Trip updated successfully!")
      onSave()
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message)
      } else {
        toast.error("Failed to update trip")
      }
    }
  }

  if (!isOpen) return null

  return (
    <dialog open={isOpen} 
      className="modal modal-bottom sm:modal-middle" 
      onClick={(e) => e.stopPropagation()}
    >
      <div className="modal-box">
        <h3 className="font-bold text-lg">Edit Trip Details</h3>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="form-control flex flex-col">
            <label className="label">
              <span className="label-text">Title</span>
            </label>
            <input
              type="text"
              required
              className="input input-bordered"
              value={editFormData.title}
              onChange={(e) => setEditFormData(prev => ({...prev, title: e.target.value}))}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Country</span>
            </label>
            <select
              value={editFormData.countryCode}
              onChange={handleCountryChange}
              className="select select-bordered w-full"
              required
              disabled={loadingCountries}
            >
              <option value="" disabled>
                {loadingCountries ? "Loading countries..." : "Select a country"}
              </option>
              {countries.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {editFormData.countryCode && (
            <div className="form-control">
              <label className="label">
                <span className="label-text">City</span>
              </label>
              <select
                value={editFormData.city}
                onChange={(e) => setEditFormData(prev => ({...prev, city: e.target.value}))}
                className="select select-bordered w-full"
                required
                disabled={loadingCities}
              >
                <option value="" disabled>
                  {loadingCities ? "Loading cities..." : "Select a city"}
                </option>
                {cities.map((ct) => (
                  <option key={ct} value={ct}>
                    {ct}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex gap-4">
            <div className="form-control flex-1">
              <label className="label">
                <span className="label-text">Start Date</span>
              </label>
              <input
                type="date"
                required
                className="input input-bordered"
                value={editFormData.startDate}
                onChange={(e) => setEditFormData(prev => ({...prev, startDate: e.target.value}))}
              />
            </div>

            <div className="form-control flex-1">
              <label className="label">
                <span className="label-text">End Date</span>
              </label>
              <input
                type="date"
                required
                className="input input-bordered"
                value={editFormData.endDate}
                onChange={(e) => setEditFormData(prev => ({...prev, endDate: e.target.value}))}
              />
            </div>
          </div>

          <div className="modal-action">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={(e) => {
                e.stopPropagation()
                onClose()
              }}
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="btn btn-soft btn-primary"
              onClick={(e) => e.stopPropagation()}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </dialog>
  )
}

export default EditTripModal
