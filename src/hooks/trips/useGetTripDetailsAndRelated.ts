import { useEffect, useState, useCallback } from "react";
import { Trip } from "../../types/trip";

export const useGetTripDetailsAndRelated = (tripId: string) => {
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);
  const [relatedTrips, setRelatedTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTripDetailsAndRelated = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Bước 1: Lấy chi tiết chuyến đi hiện tại
      const tripRes = await fetch(`/api/trip/${tripId}`, {
        credentials: "include",
      });
      const tripData = await tripRes.json();
      if (!tripRes.ok) throw new Error(tripData.message || "Failed to fetch trip details");
      setCurrentTrip(tripData);

      // Bước 2: Lấy các chuyến đi liên quan theo city
      const city = tripData.city;
      const relatedRes = await fetch(`/api/trip/city?city=${encodeURIComponent(city)}`, {
        credentials: "include",
      });
      const relatedData = await relatedRes.json();
      if (!relatedRes.ok) throw new Error(relatedData.message || "Failed to fetch related trips");

      // Loại bỏ chuyến đi hiện tại khỏi danh sách liên quan
      const filteredTrips = relatedData.filter((trip: Trip) => trip.id !== tripId);
      setRelatedTrips(filteredTrips);
    } catch (err) {
      console.error("Error fetching trip details or related trips:", err);
      setError( "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    fetchTripDetailsAndRelated();
  }, [fetchTripDetailsAndRelated]);

  return { currentTrip, relatedTrips, loading, error };
};