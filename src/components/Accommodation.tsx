import React, { useState } from "react";

interface AccommodationProps {
  id: string;
}

interface Hotel {
  name: string;
  date: string;
  website: string;
  booked: boolean;
  source: string;
}

const Accommodation: React.FC<AccommodationProps> = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [link, setLink] = useState("");
  const [error, setError] = useState("");
  const [hotels, setHotels] = useState<Hotel[]>([
    {
      name: "Mayfair New York",
      date: "Fri 11 Apr - Sat 12 Apr",
      website:
        "https://www.booking.com/hotel/us/mayfair-new-york.vi.html?aid=1787423&ucfs=1",
      booked: false,
      source: "Booking.com",
    },
  ]);

  // List of supported travel websites
  const supportedSites = [
    { hostname: "booking.com", name: "Booking.com" },
    { hostname: "hostelworld.com", name: "Hostelworld" },
  ];

  // Function to parse hotel name from URL
  const parseHotelNameFromUrl = (url: string, source: string): string => {
    try {
      const urlObj = new URL(url);
      const pathSegments = urlObj.pathname.split("/").filter((segment) => segment);

      let hotelSlug = "";
      if (source === "Booking.com") {
        // Booking.com URLs: /hotel/{country}/{hotel-slug}.html
        const hotelSegmentIndex = pathSegments.findIndex((seg) => seg === "hotel") + 2;
        hotelSlug = pathSegments[hotelSegmentIndex]?.split(".")[0] || "";
      } else if (source === "Airbnb") {
        // Airbnb URLs: /rooms/{id} or /stays/{slug}
        const roomSegment = pathSegments.find((seg) => seg.includes("rooms") || seg.includes("stays"));
        hotelSlug = roomSegment
          ? pathSegments[pathSegments.indexOf(roomSegment) + 1] || ""
          : "";
      } else if (source === "Expedia") {
        // Expedia URLs: /hotels/{id}/{hotel-slug}
        const hotelSegmentIndex = pathSegments.findIndex((seg) => seg === "hotels") + 2;
        hotelSlug = pathSegments[hotelSegmentIndex]?.split("?")[0] || "";
      } else if (source === "Agoda") {
        // Agoda URLs: /hotel/{hotel-slug}.html
        const hotelSegmentIndex = pathSegments.findIndex((seg) => seg === "hotel") + 1;
        hotelSlug = pathSegments[hotelSegmentIndex]?.split(".")[0] || "";
      } else if (source === "Hostelworld") {
        // Hostelworld URLs: /pwa/hosteldetails.php/{hotel-slug}/{city}/{id}
        const hostelSegmentIndex = pathSegments.findIndex((seg) => seg === "hosteldetails.php");
        if (hostelSegmentIndex !== -1 && pathSegments[hostelSegmentIndex + 1]) {
          hotelSlug = pathSegments[hostelSegmentIndex + 1] || "";
        } else {
          // Fallback for other Hostelworld URL patterns (e.g., /hostels/{city}/{hotel-slug})
          const citySegmentIndex = pathSegments.findIndex((seg) => seg === "hostels") + 2;
          hotelSlug = pathSegments[citySegmentIndex]?.split("?")[0] || "";
        }
      } else if (source === "Tripadvisor") {
        // Tripadvisor URLs: /Hotel_Review-{code}-{hotel-slug}
        const hotelSegment = pathSegments.find((seg) => seg.startsWith("Hotel_Review"));
        hotelSlug = hotelSegment?.split("-").slice(2).join("-") || "";
      }

      // Clean up the slug to make it human-readable
      if (hotelSlug) {
        return hotelSlug
          .replace(/-/g, " ") // Replace hyphens with spaces
          .replace(/_/g, " ") // Replace underscores with spaces
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(" ")
          .trim();
      }

      return "Hotel"; // Fallback if no name is parsed
    } catch {
      return "Hotel"; // Fallback on error
    }
  };

  const handleAddLink = () => {
    try {
      const url = new URL(link);
      const hostname = url.hostname.replace(/^www\./, "");
      const site = supportedSites.find((s) => hostname.includes(s.hostname));

      if (site) {
        const hotelName = parseHotelNameFromUrl(link, site.name);
        setHotels([
          ...hotels,
          {
            name: hotelName,
            date: "Fri 11 Apr - Sat 12 Apr",
            website: link,
            booked: false,
            source: site.name,
          },
        ]);
        setError("");
        setIsPopupOpen(false);
        setLink("");
      } else {
        setError("Please enter a link from a supported travel website (e.g., Booking.com, Airbnb, Expedia)");
      }
    } catch {
      setError("Invalid URL format");
    }
  };

  const handleRemoveHotel = (index: number) => {
    setHotels(hotels.filter((_, i) => i !== index));
  };

  const handleToggleBooked = (index: number) => {
    const updatedHotels = [...hotels];
    updatedHotels[index].booked = !updatedHotels[index].booked;
    setHotels(updatedHotels);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar bên trái */}
      <div className="w-1/4 p-4 bg-gray-50 border-r">
        <div className="flex items-center mb-4">
          <button className="text-gray-600 mr-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-black">Back to plan</h1>
        </div>
        <h2 className="text-xl font-bold text-black">
          1 nights in Hai Duong province
        </h2>
        <p className="text-sm text-black">Fri 11 Apr - Sat 12 Apr</p>
        <button
          onClick={() => setIsPopupOpen(true)}
          className="mt-4 flex items-center px-3 py-2 bg-green-500 text-white rounded-full"
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
          Add custom
        </button>

        {/* Places to sleep */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-600 flex items-center">
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
                d="M3 9h18M3 9l9-7 9 7M3 9v10a2 2 0 002 2h14a2 2 0 002-2V9"
              />
            </svg>
            Places to sleep
          </h3>
          <ul className="mt-2 space-y-2">
            {supportedSites.map((site) => (
              <li key={site.hostname} className="flex justify-between items-center">
                <a
                  href={`https://www.${site.hostname}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black hover:underline"
                >
                  {site.name}
                </a>
                <span className="text-gray-500">
                  {hotels.filter((hotel) => hotel.source === site.name).length}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* In your trip */}
        <div className="mt-6">
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
          </h3>
          <span className="text-gray-500 text-sm ml-6">{hotels.length}</span>
        </div>
      </div>

      {/* Nội dung bên phải */}
      <div className="w-3/4 p-4 bg-gray-100 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <span className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center mr-2">
              V
            </span>
            <span className="text-black">vinh28212</span>
            <span className="ml-2 px-2 py-1 bg-gray-200 text-black rounded-full text-sm">
              Wishlist
            </span>
          </div>
          <button className="text-black">View</button>
        </div>

        {/* Danh sách khách sạn */}
        {hotels.map((hotel, index) => (
          <div key={index} className="mt-4 bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-black">{hotel.name}</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleRemoveHotel(index)}
                  className="px-3 py-1 bg-gray-200 text-black rounded-full"
                >
                  Remove
                </button>
                <a
                  href={hotel.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-blue-600 text-white rounded-full flex items-center"
                >
                  View on {hotel.source}
                </a>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-1">{hotel.date}</p>
            <div className="flex items-center mt-2">
              <span className="text-black mr-2">Booked</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={hotel.booked}
                  onChange={() => handleToggleBooked(index)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-500">
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      hotel.booked ? "translate-x-5" : "translate-x-1"
                    } mt-0.5`}
                  ></div>
                </div>
              </label>
            </div>
          </div>
        ))}
      </div>

      {/* Popup */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-black">
                Add Accommodation Link
              </h2>
              <button
                onClick={() => setIsPopupOpen(false)}
                className="text-black"
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
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="Enter a travel website link (e.g., Booking.com, Airbnb)"
              className="w-full p-2 border rounded mb-4 text-black"
            />
            {error && <p className="text-black mb-4">{error}</p>}
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setIsPopupOpen(false);
                  setLink("");
                  setError("");
                }}
                className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleAddLink}
                className="px-4 py-2 bg-blue-500 text-black rounded hover:bg-blue-600"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accommodation;