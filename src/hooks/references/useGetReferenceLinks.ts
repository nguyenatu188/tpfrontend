import { useState, useEffect, useCallback } from "react"
import { ReferenceLink } from "../../types/referenceLink"

export const useGetReferenceLinks = (tripId: string | undefined) => {
  const [data, setData] = useState<ReferenceLink[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchLinks = useCallback(async () => {
    if (!tripId) {
      setData(null)
      return
    }

    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/references/${tripId}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to fetch reference links")
      }

      const jsonData = await response.json()
      setData(jsonData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch reference links")
      setData(null)
    } finally {
      setIsLoading(false)
    }
  }, [tripId])

  useEffect(() => {
    fetchLinks()
  }, [fetchLinks])

  return { 
    data, 
    isLoading, 
    error, 
    refetch: fetchLinks
  }
}
