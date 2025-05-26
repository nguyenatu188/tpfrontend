import { useState } from "react"
import { ReferenceLink } from "../../types/referenceLink"

type AddLinkParams = {
  url: string
  title?: string
  description?: string
  image?: string
}

export const useAddReferenceLink = (tripId: string | undefined) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [newLink, setNewLink] = useState<ReferenceLink | null>(null)

  const addLink = async (linkData: AddLinkParams) => {
    if (!tripId) {
      setError("Trip ID is required")
      return null
    }

    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/references/${tripId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(linkData)
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to add reference link")
      }

      const jsonData = await response.json()
      setNewLink(jsonData)
      return jsonData
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add reference link")
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return { addLink, isLoading, error, newLink }
}
