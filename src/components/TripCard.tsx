import { useState } from "react";
import { FiMoreVertical, FiTrash, FiLock, FiGlobe } from "react-icons/fi";
import { useDeleteTrip } from "../hooks/trips/useDeleteTrip";
import { useAuthContext } from "../context/AuthContext";
import { calculateDuration } from "../utils/calculateDate";
import usePexelsImage from "../utils/usePexelsImage";
import { useUpdatePrivacy } from "../hooks/trips/useUpdatePrivacy";
import { Trip } from "../types/trip";

interface TripCardProps {
  trip: Trip;
  onClick: (id: number) => void;
  onTripDeleted?: () => void;
  viewOnly?: boolean;
}

const TripCard = ({ trip, onClick, onTripDeleted, viewOnly = false }: TripCardProps) => {
  const imageUrl = usePexelsImage(trip.city);
  const { authUser } = useAuthContext();
  const isOwner = authUser?.id === trip.owner?.id;
  const [menuOpen, setMenuOpen] = useState(false);
  const [visibility, setVisibility] = useState<"public" | "private">(trip.privacy.toLowerCase() as "public" | "private");
  const { deleteTrip, isDeleting } = useDeleteTrip();
  const { updatePrivacy } = useUpdatePrivacy();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteTrip(trip.id.toString());
      setMenuOpen(false);
      setShowDeleteConfirm(false);
      if (onTripDeleted) {
        onTripDeleted();
      }
    } catch (error) {
      console.error("Failed to delete trip:", error);
    }
  };

  const cancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(false);
  };

  const toggleVisibility = async (value: "public" | "private") => {
    setVisibility(value);
    try {
      await updatePrivacy(trip.id, value.toUpperCase() as "PUBLIC" | "PRIVATE");
    } catch (err) {
      console.error("Failed to update visibility:", err);
    }
  };

  return (
    <div
      className="max-w-5xl flex-shrink-0 rounded-xl overflow-hidden mb-4 cursor-pointer hover:bg-gray-100 transition duration-300 ease-in-out relative"
      onClick={() => onClick(trip.id)}
    >
      <header className="flex items-center justify-between p-4">
        {trip.owner ? (
          <div className="flex items-center">
            <div className="avatar w-9 h-9 mx-2">
              <img
                src={trip.owner.avatarUrl || "/default-avatar.png"}
                alt={trip.owner.username}
                className="rounded-full w-full h-full object-cover"
              />
            </div>
            <p className="text-sm font-medium text-custom-2">
              {trip.owner.username}
            </p>
          </div>
        ) : (
          <div className="flex items-center">
            <p className="text-sm font-medium text-custom-2">Unknown Owner</p>
          </div>
        )}

        {isOwner && !viewOnly && (
          <div className="relative z-10">
            <FiMoreVertical
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
              className="text-gray-500 hover:text-black cursor-pointer size-6"
            />
            {menuOpen && (
              <div
                className="absolute right-0 top-6 bg-white shadow-lg rounded-md p-3 space-y-2 text-sm z-20"
                onClick={(e) => e.stopPropagation()}
              >
                {showDeleteConfirm ? (
                  <div className="flex flex-col space-y-2">
                    <p className="text-red-500">Are you sure?</p>
                    <div className="flex space-x-2">
                      <button
                        onClick={confirmDelete}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 disabled:opacity-50"
                        disabled={isDeleting}
                      >
                        {isDeleting ? "Deleting..." : "Yes, delete"}
                      </button>
                      <button
                        onClick={cancelDelete}
                        className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                        disabled={isDeleting}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleDelete}
                    className="flex items-center text-red-500 hover:text-red-700"
                  >
                    <FiTrash className="mr-2" />
                    Delete
                  </button>
                )}
                <div className="flex items-center space-x-3 text-custom font-bold">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name={`visibility-${trip.id}`}
                      checked={visibility === "public"}
                      onChange={() => toggleVisibility("public")}
                    />
                    <FiGlobe className="ml-1 mr-1" /> Public
                  </label>
                  <label className="flex items-center cursor-pointer text-custom font-bold">
                    <input
                      type="radio"
                      name={`visibility-${trip.id}`}
                      checked={visibility === "private"}
                      onChange={() => toggleVisibility("private")}
                    />
                    <FiLock className="ml-1 mr-1" /> Private
                  </label>
                </div>
              </div>
            )}
          </div>
        )}
      </header>

      <div className="flex flex-col">
        <div className="relative h-80">
          <img
            src={imageUrl || "https://picsum.photos/seed/landscape/640/360"}
            alt={trip.city}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 left-2 flex space-x-2">
            <span className="bg-white text-custom-2 text-xs font-semibold px-2 py-1 rounded-full shadow">
              🕒 {calculateDuration(trip.startDate, trip.endDate)}
            </span>
            <span className="bg-white text-custom-2 text-xs font-semibold px-2 py-1 rounded-full shadow">
              📍 {trip.country} - {trip.city}
            </span>
          </div>
        </div>

        <div className="p-4">
          <h2 className="text-lg font-bold text-custom-2">{trip.title}</h2>
          <p className="text-sm text-custom-2">
            {new Date(trip.startDate).toLocaleDateString("vi-VN")} -{" "}
            {new Date(trip.endDate).toLocaleDateString("vi-VN")}
          </p>

          {trip.sharedUsers && trip.sharedUsers.length > 0 && (
            <div className="flex items-center mt-2 space-x-1 relative group">
              {trip.sharedUsers.slice(0, 5).map((user) => (
                <img
                  key={user.id}
                  src={user.avatarUrl || "/default-avatar.png"}
                  alt={user.username}
                  title={user.username}
                  className="w-6 h-6 rounded-full border border-white object-cover"
                />
              ))}
              {trip.sharedUsers.length > 5 && (
                <span className="text-xs text-gray-500 ml-2 group-hover:block hidden absolute left-[calc(5*1.5rem)] top-1">
                  +{trip.sharedUsers.length - 5} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripCard;