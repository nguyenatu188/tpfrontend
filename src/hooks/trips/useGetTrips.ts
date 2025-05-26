import { useEffect, useState, useCallback } from "react"
import { Trip } from "../../types/trip"

export const useGetTrips = () => {
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const fetchTrips = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/trip", {
        credentials: 'include',
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to fetch trips")
      setTrips(data)
      return data
    } catch (err) {
      console.error("Error fetching trips:", err)
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  const refetch = useCallback(() => {
    return fetchTrips()
  }, [fetchTrips])

  useEffect(() => {
    fetchTrips()
  }, [fetchTrips])

  return { trips, loading, refetch }
}
