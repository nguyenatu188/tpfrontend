export function useUpdatePrivacy() {
  const updatePrivacy = async (tripId: number, privacy: "PUBLIC" | "PRIVATE") => {
    try {
      const res = await fetch(`/api/trips/${tripId}/privacy`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ privacy }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || "Failed to update privacy")
      }

      return await res.json()
    } catch (err) {
      console.error("Update privacy error:", err)
      throw err
    }
  }

  return { updatePrivacy }
}
