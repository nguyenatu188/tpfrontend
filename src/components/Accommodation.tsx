import { useState, useEffect, useCallback, useRef } from "react";
import type { Accommodation } from "../types/accommodation";
import { useAuthContext } from "../context/AuthContext";
import { useAccommodation } from "../hooks/useAccommodation";
import { useNavigate } from "react-router-dom";
import useGetTrips from "../hooks/trips/useGetTrips";

interface AccommodationProps {
  tripId?: string;
}

export default function Accommodation({ tripId }: AccommodationProps) {
  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const floatboxRef = useRef<HTMLDivElement>(null);

  const { authUser } = useAuthContext();
  const { getAccommodations, createAccommodation, deleteAccommodation } =
    useAccommodation();
  const { trips: userTrips } = useGetTrips();

  const trip = tripId ? userTrips.find((trip) => trip.id === tripId) : null;

  useEffect(() => {
    if (trip) {
      console.log("Trip found for tripId:", tripId);
      console.log("startDate:", trip.startDate || "Not specified");
      console.log("endDate:", trip.endDate || "Not specified");
    } else if (tripId) {
      console.log("No trip found for tripId:", tripId);
    }
  }, [trip, tripId, userTrips]);

  useEffect(() => {
    if (!tripId) {
      setError("Trip ID is missing");
      const timer = setTimeout(() => navigate("/trips"), 2000);
      return () => clearTimeout(timer);
    }
  }, [tripId, navigate]);

  useEffect(() => {
    if (!tripId) return;

    let isMounted = true;

    const fetchAccommodations = async () => {
      try {
        setIsInitialLoading(true);
        setError("");
        const response = await getAccommodations(tripId);
        if (isMounted) {
          setAccommodations(response.data || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to fetch accommodations"
          );
        }
      } finally {
        if (isMounted) {
          setIsInitialLoading(false);
        }
      }
    };

    fetchAccommodations();

    return () => {
      isMounted = false;
    };
  }, [tripId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isPopupOpen &&
        floatboxRef.current &&
        !floatboxRef.current.contains(event.target as Node)
      ) {
        setIsPopupOpen(false);
        setName("");
        setLocation("");
        setPrice(null);
        setError("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isPopupOpen]);

  const parseBookingUrl = useCallback((url: string) => {
    setError("");
    if (!url) {
      setName("");
      setLocation("");
      setPrice(null);
      return;
    }

    try {
      const urlObj = new URL(url);
      if (!urlObj.hostname.includes("booking.com")) {
        setError("Please use a valid Booking.com URL");
        return;
      }

      const pathParts = urlObj.pathname.split("/").filter(Boolean);
      const hotelName =
        pathParts[pathParts.length - 1]
          ?.replace(/-/g, " ")
          .replace(/\.html$/, "") || "";

      const params = new URLSearchParams(urlObj.search);
      const priceBlock = params.get("sr_pri_blocks");
      let extractedPrice = null;
      if (priceBlock) {
        const priceParts = priceBlock.split("_");
        const priceValue = priceParts[priceParts.length - 1];
        if (priceValue && !isNaN(Number(priceValue))) {
          extractedPrice = (Number(priceValue) / 100).toFixed(0);
        }
      }

      setName(hotelName);
      setLocation(url); // Store the full URL in location
      setPrice(extractedPrice);
    } catch {
      setError("Invalid URL format");
      setName("");
      setLocation("");
      setPrice(null);
    }
  }, []);

  const handleAddAccommodation = useCallback(async () => {
    if (!tripId) {
      setError("Trip ID is missing");
      return;
    }

    if (!name || !location) {
      setError("Name and URL are required");
      return;
    }

    try {
      setIsAdding(true);
      setError("");
      const newAccommodation = {
        name,
        location, // location stores the URL
        tripId,
        price: price ? parseFloat(price) : null,
      };

      const response = await createAccommodation(newAccommodation);
      setAccommodations((prev) => [...prev, response.data]);
      setIsPopupOpen(false);
      setName("");
      setLocation("");
      setPrice(null);
      setError("");
    } catch (err) {
      console.error("Error adding accommodation:", err);
      setError("Failed to add accommodation");
    } finally {
      setIsAdding(false);
    }
  }, [tripId, name, location, price, createAccommodation]);

  const handleRemoveAccommodation = useCallback(
    async (accommodationId: string) => {
      try {
        setIsDeleting(accommodationId);
        setError("");
        await deleteAccommodation(accommodationId);
        setAccommodations((prev) =>
          prev.filter((acc) => acc.id !== accommodationId)
        );
      } catch (err) {
        console.error("Error deleting accommodation:", err);
        setError("Failed to delete accommodation");
      } finally {
        setIsDeleting(null);
      }
    },
    [deleteAccommodation]
  );

  const handleUrlChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newUrl = e.target.value;
      setLocation(newUrl);
      parseBookingUrl(newUrl);
    },
    [parseBookingUrl]
  );

  if (!tripId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-500 text-lg">
          Error: Trip ID is missing. Redirecting to trip selection...
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex min-h-screen relative">
        <div className="w-full p-4 bg-gray-100 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <img
                src={authUser?.avatarUrl || "/default-profile.png"}
                alt="User avatar"
                className="w-8 h-8 rounded-full"
              />
              <span className="text-black ml-2">
                {authUser?.username || "Unknown User"}
              </span>
            </div>
            <a
              href="https://www.booking.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline text-sm"
            >
              Booking.com
            </a>
            <h3 className="text-sm font-semibold text-gray-600 flex items-center">
              <svg
                className="w-4 h-4 mr-2 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              In your trip
              <span className="text-gray-500 text-sm ml-6">
                {accommodations.length}
              </span>
            </h3>

            <button
              onClick={() => setIsPopupOpen(true)}
              className="mt-4 flex items-center px-3 py-2 bg-green-500 text-white rounded-full hover:bg-green-600"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add accommodation
            </button>
          </div>
          {isInitialLoading ? (
            <p className="text-gray-600">Loading accommodations...</p>
          ) : (
            <>
              {error && <p className="text-red-500 mb-4">{error}</p>}
              {accommodations.length === 0 && !error && (
                <p className="text-gray-600">
                  No accommodations found. Add one to get started!
                </p>
              )}
              {accommodations.map((acc) => (
                <div
                  key={acc.id}
                  className="mt-4 bg-white p-4 rounded-lg shadow"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-black">
                      {acc.name}
                    </h3>
                    <div className="flex space-x-2">
                      <a
                        href={acc.location}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                      >
                        View on Booking
                      </a>
                      <button
                        onClick={() => handleRemoveAccommodation(acc.id)}
                        disabled={isDeleting === acc.id}
                        className="px-3 py-1 bg-gray-200 text-black rounded-full hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isDeleting === acc.id ? "Removing..." : "Remove"}
                      </button>
                    </div>
                  </div>
                  {acc.price != null && (
                    <p className="text-sm text-gray-600 mt-1">
                      Price: ${acc.price.toFixed(2)}
                    </p>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
        {isPopupOpen && (
          <div className="absolute inset-0 flex items-center justify-center z-50">
            <div
              ref={floatboxRef}
              className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-md transform transition-all duration-300"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-black">
                  Add Accommodation
                </h2>
                <button
                  onClick={() => {
                    setIsPopupOpen(false);
                    setName("");
                    setLocation("");
                    setPrice(null);
                    setError("");
                  }}
                  disabled={isAdding}
                  className="text-black hover:text-gray-600 disabled:opacity-50"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <input
                type="text"
                value={location}
                onChange={handleUrlChange}
                placeholder="Paste Booking.com URL"
                disabled={isAdding}
                className="w-full p-2 border rounded mb-4 text-black disabled:bg-gray-100"
              />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Hotel name"
                disabled={isAdding}
                className="w-full p-2 border rounded mb-4 text-black disabled:bg-gray-100"
              />
              <input
                type="number"
                value={price || ""}
                onChange={(e) => setPrice(e.target.value || null)}
                placeholder="Price (optional)"
                disabled={isAdding}
                className="w-full p-2 border rounded mb-4 text-black disabled:bg-gray-100"
              />
              {error && <p className="text-red-500 mb-4">{error}</p>}
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setIsPopupOpen(false);
                    setName("");
                    setLocation("");
                    setPrice(null);
                    setError("");
                  }}
                  disabled={isAdding}
                  className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddAccommodation}
                  disabled={isAdding}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAdding ? "Adding..." : "Add"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
