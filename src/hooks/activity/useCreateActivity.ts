import { useState, useCallback } from "react"
import { Activity } from "../../types/activity"

type CreateActivityParams = {
  name: string
  placeName: string
  location: string
  time: string
  price: string
}

export const useCreateActivity = (tripId: string | undefined) => {
  const [data, setData] = useState<Activity | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createActivity = useCallback(async (activityData: CreateActivityParams) => {
    if (!tripId) {
      setError("Trip ID is required")
      return null
    }

    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/activities/${tripId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(activityData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to create activity")
      }

      const jsonData = await response.json()
      setData(jsonData.data)
      return jsonData.data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create activity")
      setData(null)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [tripId])

  return { 
    createActivity,
    createdActivity: data,
    isLoading, 
    error
  }
}
