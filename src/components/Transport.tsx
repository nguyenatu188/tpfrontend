import { useState, useEffect, useCallback, useRef } from "react";
import { useTransport } from "../hooks/useTransport";
import { Transport as TransportType } from "../types/transport";
import { useAuthContext } from "../context/AuthContext";
import { useGetTrips } from "../hooks/trips/useGetTrips";
import { FiMapPin } from "react-icons/fi";
import { GiCash } from "react-icons/gi";
import { FaPlane, FaTrain, FaBus, FaCar, FaShip, FaBicycle, FaMotorcycle } from "react-icons/fa";

interface TransportProps {
  tripId: string;
}

// Hàm format giá tiền sang VND
const formatVND = (price: number): string => {
  return price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
};

// Mapping các loại phương tiện vận chuyển với biểu tượng tương ứng
const transportIcons: { [key: string]: React.ReactElement } = {
  Flight: <FaPlane className="mr-2 text-gray-600" />,
  Train: <FaTrain className="mr-2 text-gray-600" />,
  Bus: <FaBus className="mr-2 text-gray-600" />,
  Car: <FaCar className="mr-2 text-gray-600" />,
  Ferry: <FaShip className="mr-2 text-gray-600" />,
  Bicycle: <FaBicycle className="mr-2 text-gray-600" />,
  Motorcycle: <FaMotorcycle className="mr-2 text-gray-600" />,
};

const Transport = ({ tripId }: TransportProps) => {
  const {
    transports,
    loading,
    error,
    fetchTransports,
    createTransport,
    updateTransport,
    deleteTransport,
  } = useTransport(tripId);
  const { authUser } = useAuthContext();
  const { trips: userTrips } = useGetTrips();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editingTransport, setEditingTransport] = useState<TransportType | null>(null);
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({
    message: "",
    visible: false,
  });
  const popupRef = useRef<HTMLDivElement>(null);
  const isInitialLoadRef = useRef(true);

  const trip = userTrips.find((trip) => trip.id === tripId) || null;
  const isProfileOwner = trip && authUser ? authUser.id === trip.owner.id : false;

  const predefinedTypes = [
    "Flight",
    "Train",
    "Bus",
    "Car",
    "Ferry",
    "Bicycle",
    "Motorcycle",
  ];

  const showToast = useCallback((message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message: "", visible: false }), 3000);
  }, []);

  const togglePopup = useCallback(() => {
    setIsPopupOpen((prev) => !prev);
    setEditingTransport(null);
  }, []);

  const handleAddTransport = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const form = e.currentTarget;
      const type = (form.elements.namedItem("type") as HTMLSelectElement).value;
      const from = (form.elements.namedItem("from") as HTMLInputElement).value;
      const to = (form.elements.namedItem("to") as HTMLInputElement).value;
      const price = (form.elements.namedItem("price") as HTMLInputElement).value;
      const startDate = (form.elements.namedItem("startDate") as HTMLInputElement).value;
      const endDate = (form.elements.namedItem("endDate") as HTMLInputElement).value;

      if (!type.trim() || !from.trim() || !to.trim() || !price || !startDate || !endDate) {
        showToast("Type, from, to, price, startDate, and endDate are required");
        return;
      }

      const parsedPrice = parseFloat(price);
      if (isNaN(parsedPrice) || parsedPrice < 0) {
        showToast("Price must be a non-negative number");
        return;
      }

      const success = editingTransport
        ? await updateTransport(
            editingTransport.id,
            type,
            from,
            to,
            parsedPrice,
            startDate,
            endDate
          )
        : await createTransport(
            type,
            from,
            to,
            parsedPrice,
            startDate,
            endDate
          );

      if (success) {
        showToast(
          editingTransport
            ? "Transport updated successfully!"
            : "Transport added successfully!"
        );
        form.reset();
        togglePopup();
        await fetchTransports();
      } else {
        showToast("Failed to save transport");
      }
    },
    [
      createTransport,
      updateTransport,
      editingTransport,
      showToast,
      togglePopup,
      fetchTransports,
    ]
  );

  const handleDeleteTransport = useCallback(
    async (id: string) => {
      const success = await deleteTransport(id);
      if (success) {
        showToast("Transport deleted successfully!");
        await fetchTransports();
      } else {
        showToast("Failed to delete transport");
      }
    },
    [deleteTransport, showToast, fetchTransports]
  );

  const handleEditTransport = useCallback((transport: TransportType) => {
    setEditingTransport(transport);
    setIsPopupOpen(true);
  }, []);

  useEffect(() => {
    if (isInitialLoadRef.current) {
      fetchTransports();
      isInitialLoadRef.current = false;
    }
  }, [fetchTransports]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isPopupOpen &&
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setIsPopupOpen(false);
        setEditingTransport(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isPopupOpen]);

  return (
    <div className="flex min-h-screen relative">
      <div className="w-full p-6 bg-gray-100 flex flex-col">
        {/* Header Section */}
        <header className="mb-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img
                src={authUser?.avatarUrl || "https://via.placeholder.com/40"}
                alt="User Avatar"
                className="w-10 h-10 rounded-full"
              />
              <span className="text-black ml-2">
                {authUser?.username || "Unknown User"}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              {isProfileOwner && (
                <button
                  onClick={togglePopup}
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
                  Add transport
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Main Section */}
        <main>
          {/* Transport List Section */}
          <div className="mt-6">
            {loading && <p className="text-gray-600">Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {transports.length === 0 && !loading ? (
              <p className="text-gray-600">
                No transports added yet. Add one to get started!
              </p>
            ) : (
              transports.map((transport) => (
                <div
                  key={transport.id}
                  className="mt-4 bg-white p-4 rounded-lg shadow"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-blue-600 text-lg flex items-center flex-wrap">
                        <FiMapPin className="mr-2 text-blue-500" />
                        <span className="font-bold">{transport.from}</span>
                        <span className="mx-2">-</span>
                        <span className="font-bold">{transport.to}</span>
                      </p>
                      <p className="font-semibold text-gray-800 flex items-center">
                        {transportIcons[transport.type] || <FiMapPin className="mr-2 text-blue-500" />}
                        {transport.type}
                      </p>
                      <p className="text-yellow-600 flex items-center flex-wrap">
                        <GiCash className="mr-2 text-yellow-500" />
                        {formatVND(transport.price)}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-semibold">Start:</span>{" "}
                        {new Date(transport.startDate).toLocaleString("vi-VN")}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-semibold">End:</span>{" "}
                        {new Date(transport.endDate).toLocaleString("vi-VN")}
                      </p>
                    </div>
                    {isProfileOwner && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditTransport(transport)}
                          className="px-3 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTransport(transport.id)}
                          className="px-3 py-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Popup for Adding/Editing Transport */}
          {isPopupOpen && isProfileOwner && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div
                ref={popupRef}
                className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-md transform transition-all duration-300"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-black">
                    {editingTransport ? "Edit Transport" : "Add Transport"}
                  </h2>
                  <button
                    onClick={togglePopup}
                    className="text-black hover:text-gray-600"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 24"
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
                <form onSubmit={handleAddTransport} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Type
                    </label>
                    <select
                      name="type"
                      defaultValue={editingTransport?.type || ""}
                      className="mt-1 block w-full p-2 border rounded-lg text-black"
                    >
                      <option value="" disabled>
                        Select type
                      </option>
                      {predefinedTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      From
                    </label>
                    <input
                      name="from"
                      defaultValue={editingTransport?.from || ""}
                      type="text"
                      placeholder="Enter departure"
                      className="mt-1 block w-full p-2 border rounded-lg text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      To
                    </label>
                    <input
                      name="to"
                      defaultValue={editingTransport?.to || ""}
                      type="text"
                      placeholder="Enter destination"
                      className="mt-1 block w-full p-2 border rounded-lg text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Price
                    </label>
                    <input
                      name="price"
                      defaultValue={
                        editingTransport?.price != null
                          ? editingTransport.price.toString()
                          : "0" // Giá trị mặc định là "0"
                      }
                      type="number"
                      step="0.01"
                      placeholder="Enter price"
                      className="mt-1 block w-full p-2 border rounded-lg text-black"
                      required // Thêm thuộc tính required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Start Date
                    </label>
                    <input
                      name="startDate"
                      defaultValue={
                        editingTransport?.startDate
                          ? new Date(editingTransport.startDate).toISOString().slice(0, 16)
                          : ""
                      }
                      type="datetime-local"
                      className="mt-1 block w-full p-2 border rounded-lg text-black"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      End Date
                    </label>
                    <input
                      name="endDate"
                      defaultValue={
                        editingTransport?.endDate
                          ? new Date(editingTransport.endDate).toISOString().slice(0, 16)
                          : ""
                      }
                      type="datetime-local"
                      className="mt-1 block w-full p-2 border rounded-lg text-black"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600"
                  >
                    {editingTransport ? "Update Transport" : "Add Transport"}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Toast Notification */}
          {toast.visible && (
            <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in-out">
              {toast.message}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Transport;