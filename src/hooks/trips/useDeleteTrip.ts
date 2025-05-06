import { useState } from "react"

export const useDeleteTrip = () => {
  const [isDeleting, setIsDeleting] = useState(false)

  const deleteTrip = async (tripId: string) => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/trip/${tripId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to delete trip")
      }

      return await response.json()
    } finally {
      setIsDeleting(false)
    }
  }

  return { deleteTrip, isDeleting }
}
