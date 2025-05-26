import { useState, useEffect, useCallback } from "react"
import { Activity } from "../../types/activity"

export const useGetActivities = (tripId: string | undefined) => {
  const [data, setData] = useState<Activity[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchActivities = useCallback(async () => {
    if (!tripId) {
      setData(null)
      return
    }

    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/activities/${tripId}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to fetch activities")
      }

      const jsonData = await response.json()
      setData(jsonData.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch activities")
      setData(null)
    } finally {
      setIsLoading(false)
    }
  }, [tripId]) // Dependency array chứa tripId

  // Tự động fetch khi tripId thay đổi
  useEffect(() => {
    fetchActivities()
  }, [fetchActivities]) // Chạy lại khi fetchActivities thay đổi

  return { 
    data, 
    isLoading, 
    error, 
    refetch: fetchActivities // Cho phép refetch thủ công
  }
}
