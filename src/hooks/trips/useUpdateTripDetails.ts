export function useUpdateTripDetails() {
  const updateTripDetails = async (
    tripId: string,
    details: {
      title: string
      country: string
      city: string
      startDate: string
      endDate: string
    }
  ) => {
    if (details.startDate > details.endDate) {
      throw new Error("Start date must be before end date")
    }
    try {
      const res = await fetch(`/api/trip/${tripId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(details),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || "Failed to update trip details")
      }

      return await res.json()
    } catch (err) {
      console.error("Update trip details error:", err)
      throw err
    }
  }

  return { updateTripDetails }
}
