import { useState } from "react"

export const useAddNewTrip = () => {
  const [isLoading, setIsLoading] = useState(false)

  const createTrip = async (tripData: {
    title: string;
    country: string;
    city: string;
    startDate: string;
    endDate: string;
    privacy: "PRIVATE" | "PUBLIC";
    lat: number;
    lng: number;
  }) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/trip/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tripData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create trip")
      }

      return await response.json()
    } finally {
      setIsLoading(false)
    }
  }

  return { createTrip, isLoading }
}
