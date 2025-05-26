import { useEffect, useState } from "react"
import { Activity } from "../types/activity"

const useGetActivitiesByTripId = (tripId: string) => {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error] = useState<string | null>(null)

  useEffect(() => {
    if (!tripId) return

    const fetchActivities = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/trips/${tripId}/activities`)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        setActivities(data)
        console.log("Activities for trip", tripId, ":", data)
      } catch (error) {
        console.error("Failed to fetch activities:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [tripId])

  return { activities, loading, error }
}

export default useGetActivitiesByTripId
