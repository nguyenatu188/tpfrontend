import { useState, useCallback } from "react"

export const useDeleteActivity = (tripId: string | undefined, activityId: string | undefined) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deleteActivity = useCallback(async () => {
    if (!tripId || !activityId) {
      setError("Trip ID và Activity ID là bắt buộc")
      return false
    }

    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/activities/${tripId}/${activityId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Xóa activity thất bại")
      }

      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xóa activity thất bại")
      return false
    } finally {
      setIsLoading(false)
    }
  }, [tripId, activityId])

  return { 
    deleteActivity,
    isLoading, 
    error
  }
}
