import { useState, useEffect, useCallback, useRef } from "react";
import type { Accommodation } from "../types/accommodation";
import { useAuthContext } from "../context/AuthContext";
import { useAccommodation } from "../hooks/useAccommodation";
import { useNavigate } from "react-router-dom";
import { useGetTrips } from "../hooks/trips/useGetTrips";
import { FaHotel } from "react-icons/fa";
import { GiCash } from "react-icons/gi";
import { IoEyeSharp } from "react-icons/io5";

interface AccommodationProps {
  tripId?: string;
}

// Utility function to format price in VND
const formatVND = (price: number | string | null): string => {
  if (price == null) return "N/A";
  const num = typeof price === "string" ? parseFloat(price) : price;
  if (isNaN(num)) return "N/A";
  return num.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
};

export default function Accommodation({ tripId }: AccommodationProps) {
  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState<string>(""); // Thay đổi từ null thành chuỗi rỗng
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [error, setError] = useState("");
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({
    message: "",
    visible: false,
  });
  const floatboxRef = useRef<HTMLDivElement>(null);
  const isInitialLoadRef = useRef(true);

  const { authUser } = useAuthContext();
  const { getAccommodations, createAccommodation, deleteAccommodation } =
    useAccommodation();
  const { trips: userTrips } = useGetTrips();

  const trip = tripId ? userTrips.find((trip) => trip.id === tripId) : null;
  const isProfileOwner =
    trip && authUser ? authUser.id === trip.owner.id : false;

  const showToast = useCallback((message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message: "", visible: false }), 3000);
  }, []);

  const handleBookingClick = useCallback(() => {
    window.open("https://www.booking.com", "_blank", "noopener,noreferrer");
  }, []);

  useEffect(() => {
    if (!tripId) {
      setError("Trip ID is missing");
      showToast("Trip ID is missing");
      const timer = setTimeout(() => navigate("/trips"), 2000);
      return () => clearTimeout(timer);
    }
  }, [tripId, navigate, showToast]);

  useEffect(() => {
    if (!tripId || !isInitialLoadRef.current) return;

    let isMounted = true;

    const fetchAccommodations = async () => {
      try {
        setIsInitialLoading(true);
        const response = await getAccommodations(tripId);
        if (isMounted) {
          setAccommodations(response.data || []);
          setError("");
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to fetch accommodations"
          );
          showToast("Failed to fetch accommodations");
        }
      } finally {
        if (isMounted) {
          setIsInitialLoading(false);
          isInitialLoadRef.current = false;
        }
      }
    };

    fetchAccommodations();

    return () => {
      isMounted = false;
    };
  }, [tripId, showToast]);

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
        setPrice(""); // Thay đổi từ null thành chuỗi rỗng
        setStartDate("");
        setEndDate("");
        setError("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isPopupOpen]);

  const parseBookingUrl = useCallback(
    (url: string) => {
      setError("");
      if (!url) {
        setName("");
        setLocation("");
        setPrice(""); // Thay đổi từ null thành chuỗi rỗng
        return;
      }

      try {
        const urlObj = new URL(url);
        if (!urlObj.hostname.includes("booking.com")) {
          setError("Please use a valid Booking.com URL");
          showToast("Please use a valid Booking.com URL");
          return;
        }

        const pathParts = urlObj.pathname.split("/").filter(Boolean);
        const hotelName =
          pathParts[pathParts.length - 1]
            ?.replace(/-/g, " ")
            .replace(/\.html$/, "") || "";

        const params = new URLSearchParams(urlObj.search);
        const priceBlock = params.get("sr_pri_blocks");
        let extractedPrice = "0"; // Giá trị mặc định nếu không tìm thấy
        if (priceBlock) {
          const priceParts = priceBlock.split("_");
          const priceValue = priceParts[priceParts.length - 1];
          if (priceValue && !isNaN(Number(priceValue))) {
            extractedPrice = (Number(priceValue) / 100).toFixed(0);
          }
        }

        setName(hotelName);
        setLocation(url);
        setPrice(extractedPrice);
      } catch {
        setError("Invalid URL format");
        showToast("Invalid URL format");
        setName("");
        setLocation("");
        setPrice(""); // Thay đổi từ null thành chuỗi rỗng
      }
    },
    [showToast]
  );

  const handleAddAccommodation = useCallback(async () => {
    if (!tripId) {
      setError("Trip ID is missing");
      showToast("Trip ID is missing");
      return;
    }

    if (!name || !location || !price || !startDate || !endDate) {
      setError("Name, URL, price, start date, and end date are required");
      showToast("Name, URL, price, start date, and end date are required");
      return;
    }

    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);
    if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
      setError("Invalid start date or end date format");
      showToast("Invalid start date or end date format");
      return;
    }

    if (parsedStartDate >= parsedEndDate) {
      setError("Start date must be before end date");
      showToast("Start date must be before end date");
      return;
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      setError("Price must be a non-negative number");
      showToast("Price must be a non-negative number");
      return;
    }

    try {
      setIsAdding(true);
      setError("");
      const newAccommodation = {
        name,
        location,
        tripId,
        price: parsedPrice,
        startDate: parsedStartDate.toISOString(),
        endDate: parsedEndDate.toISOString(),
      };

      const response = await createAccommodation(newAccommodation);
      setAccommodations((prev) => [...prev, response.data]);
      setIsPopupOpen(false);
      setName("");
      setLocation("");
      setPrice(""); // Thay đổi từ null thành chuỗi rỗng
      setStartDate("");
      setEndDate("");
      setError("");
      showToast("Accommodation added successfully!");
    } catch (err) {
      console.error("Error adding accommodation:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to add accommodation";
      setError(errorMessage);
      showToast(errorMessage);
    } finally {
      setIsAdding(false);
    }
  }, [
    tripId,
    name,
    location,
    price,
    startDate,
    endDate,
    createAccommodation,
    showToast,
  ]);

  const handleRemoveAccommodation = useCallback(
    async (accommodationId: string) => {
      try {
        setIsDeleting(accommodationId);
        setError("");
        await deleteAccommodation(accommodationId);
        setAccommodations((prev) =>
          prev.filter((acc) => acc.id !== accommodationId)
        );
        showToast("Accommodation deleted successfully!");
      } catch (err) {
        console.error("Error deleting accommodation:", err);
        setError("Failed to delete accommodation");
        showToast("Failed to delete accommodation");
      } finally {
        setIsDeleting(null);
      }
    },
    [deleteAccommodation, showToast]
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
    <div className="flex min-h-screen relative">
      <div className="w-full p-4 bg-gray-100 flex flex-col">
        <header className="mb-4">
          <div className="flex justify-between items-center">
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
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBookingClick}
                className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 text-sm"
              >
                Booking.com
              </button>
              {isProfileOwner && (
                <button
                  onClick={() => setIsPopupOpen(true)}
                  className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
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
              )}
            </div>
          </div>
        </header>

        <main>
          {isInitialLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg shadow animate-pulse"
                >
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
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
                  className="mt-4 bg-white p-4 rounded-lg shadow-md"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-black flex flex-wrap items-center text-blue-600">
                      <FaHotel className="mr-2" />
                      <span>{acc.name}</span>
                    </h3>
                    <div className="flex space-x-2">
                      <a
                        href={acc.location}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 flex flex-wrap items-center"
                      >
                        <IoEyeSharp className="mr-1" />
                        View
                      </a>
                      {isProfileOwner && (
                        <button
                          onClick={() => handleRemoveAccommodation(acc.id)}
                          disabled={isDeleting === acc.id}
                          className="px-3 py-1 bg-red-500 text-white rounded-full hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isDeleting === acc.id ? "Deleting..." : "Delete"}
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-yellow-600 mt-1 flex items-center flex-wrap">
                    <GiCash className="mr-2" />
                    {formatVND(acc.price)}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Start:</span>{" "}
                    {new Date(acc.startDate).toLocaleString("vi-VN")}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">End:</span>{" "}
                    {new Date(acc.endDate).toLocaleString("vi-VN")}
                  </p>
                </div>
              ))}
            </>
          )}

          {isPopupOpen && isProfileOwner && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
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
                      setPrice(""); // Thay đổi từ null thành chuỗi rỗng
                      setStartDate("");
                      setEndDate("");
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
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Price"
                  disabled={isAdding}
                  className="w-full p-2 border rounded mb-4 text-black disabled:bg-gray-100"
                />
                <input
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  placeholder="Start date and time"
                  disabled={isAdding}
                  className="w-full p-2 border rounded mb-4 text-black disabled:bg-gray-100"
                />
                <input
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  placeholder="End date and time"
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
                      setPrice(""); // Thay đổi từ null thành chuỗi rỗng
                      setStartDate("");
                      setEndDate("");
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

          {toast.visible && (
            <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in-out">
              {toast.message}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
