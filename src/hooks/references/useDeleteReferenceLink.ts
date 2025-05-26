import { useState } from "react"

export const useDeleteReferenceLink = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deleteLink = async (linkId: string) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/references/${linkId}`, {
        method: "DELETE"
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to delete reference link")
      }

      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete reference link")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return { deleteLink, isLoading, error }
}
