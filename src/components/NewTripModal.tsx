import React, { useState, useEffect, useRef } from "react"
import { useCountryCityData } from "../utils/useCountryCityData"
import { useAddNewTrip } from "../hooks/trips/useAddNewTrip"

type Props = {
  onClose: () => void
  modalId: string
  onTripAdded?: () => void // New prop for callback after successful trip creation
}

function NewTripModal({ onClose, modalId, onTripAdded }: Props) {
  const [tripName, setTripName] = useState("")
  const [country, setCountry] = useState("")
  const [city, setCity] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [privacy, setPrivacy] = useState("")
  const [latlng, setLatlng] = useState<[number, number]>()


  const dialogRef = useRef<HTMLDialogElement | null>(null)

  const {
    countries,
    cities,
    loadingCountries,
    loadingCities,
    error,
    fetchCities,
  } = useCountryCityData()

  const { createTrip, isLoading } = useAddNewTrip()

  useEffect(() => {
    dialogRef.current?.showModal()
  }, [])

  const handleClose = () => {
    dialogRef.current?.close()
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!tripName || !country || !city || !startDate || !endDate || !privacy) {
      alert("Vui lòng điền đầy đủ thông tin.")
      return
    }

    if (new Date(endDate) <= new Date(startDate)) {
      alert("Ngày kết thúc phải sau ngày bắt đầu.")
      return
    }

    // Chuyen doi code quoc gia thanh ten quoc gia
    const selectedCountryName = countries.find((c) => c.code === country)?.name || country

    try {
      await createTrip({
        title: tripName,
        country: selectedCountryName,
        city,
        startDate,
        endDate,
        privacy: privacy as "PRIVATE" | "PUBLIC",
        lat: latlng?.[0] ?? 0,
        lng: latlng?.[1] ?? 0,
      })

      
      // Call the onTripAdded callback if provided
      if (onTripAdded) {
        onTripAdded()
      }
      
      handleClose()
    } catch (error) {
      console.error("Error creating trip:", error)
      alert("Failed to create trip. Please try again.")
    }
  }

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCode = e.target.value
    setCountry(selectedCode)
    setCity("")
    fetchCities(selectedCode)

    const selected = countries.find((c) => c.code === selectedCode)
    if (selected?.latlng) {
      setLatlng(selected.latlng)
    } else {
      setLatlng([0, 0])
    }
  }

  return (
    <dialog id={modalId} className="modal" ref={dialogRef}>
      <div className="modal-box">
        <h2 className="text-xl font-bold mb-4">Create New Trip</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Trip Name"
            className="input input-bordered w-full"
            value={tripName}
            onChange={(e) => setTripName(e.target.value)}
            required
          />

          <select
            value={country}
            onChange={handleCountryChange}
            className="select select-bordered w-full"
            required
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

          {country && (
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="select select-bordered w-full"
              required
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
          )}

          <input
            type="date"
            className="input input-bordered w-full"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
          <input
            type="date"
            className="input input-bordered w-full"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />

          <div className="flex gap-4 items-center">
            <label className="label cursor-pointer">
              <span className="label-text">Private</span>
              <input
                type="radio"
                name="privacy"
                className="radio"
                value="PRIVATE"
                checked={privacy === "PRIVATE"}
                onChange={(e) => setPrivacy(e.target.value)}
              />
            </label>
            <label className="label cursor-pointer">
              <span className="label-text">Public</span>
              <input
                type="radio"
                name="privacy"
                className="radio"
                value="PUBLIC"
                checked={privacy === "PUBLIC"}
                onChange={(e) => setPrivacy(e.target.value)}
              />
            </label>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-end gap-2">
            <button type="button" onClick={handleClose} className="btn btn-ghost">
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>Close</button>
      </form>
    </dialog>
  )
}

export default NewTripModal
