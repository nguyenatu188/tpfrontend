import { useState, useCallback } from "react"
import { Activity } from "../../types/activity"

type UpdateActivityParams = {
  name: string
  placeName: string
  location: string
  time: string
  price: string
}

export const useUpdateActivity = (tripId: string | undefined, activityId: string | undefined) => {
  const [data, setData] = useState<Activity | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateActivity = useCallback(async (activityData: UpdateActivityParams) => {
    if (!tripId || !activityId) {
      setError("Trip ID và Activity ID là bắt buộc")
      return null
    }

    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/activities/${tripId}/${activityId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(activityData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Cập nhật activity thất bại")
      }

      const jsonData = await response.json()
      setData(jsonData.data)
      return jsonData.data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Cập nhật activity thất bại")
      setData(null)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [tripId, activityId])

  return { 
    updateActivity,
    updatedActivity: data,
    isLoading, 
    error
  }
}
