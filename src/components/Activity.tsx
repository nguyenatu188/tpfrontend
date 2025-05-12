import { useState } from "react";
import tripsData from "../data/tripsData.json";

interface Destination {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  nights: number;
  latitude: number;
  longitude: number;
}

interface ActivityProps {
  id: string;
}

const Activity: React.FC<ActivityProps> = ({ id }) => {
  const trip = tripsData.find((trip) => trip.id === parseInt(id));
  const [destinations, setDestinations] = useState<Destination[]>(trip?.destinationsList || []);
  const [nights, setNights] = useState<number[]>(destinations.map((dest) => dest.nights));
  const [activeTab, setActivityeTab] = useState<"DESTINATIONS" | "DAY BY DAY" | "SHOW NOTES">("DESTINATIONS");
  const [showAddDestination, setShowAddDestination] = useState(false);
  const [newDestination, setNewDestination] = useState({
    name: "",
    startDate: "",
    endDate: "",
    nights: 1,
    latitude: 0,
    longitude: 0,
  });

  if (!trip) {
    return <div className="p-6 text-red-500">Trip not found!</div>;
  }

  // Hàm tạo danh sách ngày cho tab "DAY BY DAY"
  const generateDayByDaySchedule = () => {
    const schedule: { date: string; day: number; destination: string; note: string; hasSleeping: boolean }[] = [];
    let currentDay = 1;
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    destinations.forEach((dest, destIndex) => {
      const startDate = new Date(dest.startDate + " 2025");
      const totalDays = dest.nights + 1; // Bao gồm cả ngày đầu và ngày cuối

      for (let i = 0; i < totalDays; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        const dayName = daysOfWeek[currentDate.getDay()];
        const formattedDate = `${dayName} ${currentDate.getDate()} Apr 2025`;

        const isFirstDay = i === 0;
        const isLastDay = i === totalDays - 1 && destIndex === destinations.length - 1;
        const note = isFirstDay
          ? "Start of your adventure!"
          : isLastDay
          ? "Last day of your adventure!"
          : "";

        schedule.push({
          date: formattedDate,
          day: currentDay,
          destination: dest.name,
          note,
          hasSleeping: i === 0, // Chỉ hiển thị nút SLEEPING cho ngày đầu của mỗi điểm đến
        });
        currentDay++;
      }
    });

    return schedule;
  };

  const schedule = generateDayByDaySchedule();

  // const handleNightsChange = (index: number, delta: number) => {
  //   const newNights = [...nights];
  //   newNights[index] = Math.max(0, newNights[index] + delta);
  //   setNights(newNights);

  //   const updatedDestinations = [...destinations];
  //   updatedDestinations[index] = { ...updatedDestinations[index], nights: newNights[index] };
  //   setDestinations(updatedDestinations);
  // };

  const handleAddDestination = () => {
    if (!newDestination.name || !newDestination.startDate || !newDestination.endDate) {
      alert("Please fill in all fields!");
      return;
    }

    const newId = destinations.length ? destinations[destinations.length - 1].id + 1 : 1;
    setDestinations([...destinations, { ...newDestination, id: newId }]);
    setNights([...nights, newDestination.nights]);
    setShowAddDestination(false);
    setNewDestination({ name: "", startDate: "", endDate: "", nights: 1, latitude: 0, longitude: 0 });
  };

  // const handleMapClick = (event: any) => {
  //   const { lng, lat } = event.lngLat;
  //   setNewDestination({ ...newDestination, latitude: lat, longitude: lng });
  //   setShowAddDestination(true);
  // };

  const handleAction = (action: string, destinationName: string, date: string) => {
    alert(`${action} clicked for ${destinationName} on ${date}`);
  };

  const handleDiscover = () => {
    alert("Discover clicked! This could redirect to a discover page.");
  };

  const handleCollection = () => {
    alert("Collection clicked! This could redirect to a collection page.");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Tiêu đề chuyến đi */}
      <div className="p-4 bg-white shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-gray-800">{trip.name}</h1>
            <span className="text-sm text-gray-500">
              {trip.startDate} – {trip.endDate}
            </span>
          </div>
          
        </div>
      </div>

      {/* Tabs điều hướng */}
      <div className="p-4 bg-white border-b">
        <div className="flex space-x-4">
          <button
            onClick={() => setActivityeTab("DESTINATIONS")}
            className={`pb-2 font-semibold ${
              activeTab === "DESTINATIONS"
                ? "text-custom border-b-2 border-custom"
                : "text-gray-500 hover:text-custom"
            }`}
          >
            DESTINATIONS
          </button>
          <button
            onClick={() => setActivityeTab("DAY BY DAY")}
            className={`pb-2 font-semibold ${
              activeTab === "DAY BY DAY"
                ? "text-custom border-b-2 border-custom"
                : "text-gray-500 hover:text-custom"
            }`}
          >
            DAY BY DAY
          </button>
          <button
            onClick={() => setActivityeTab("SHOW NOTES")}
            className={`pb-2 flex items-center space-x-1 ${
              activeTab === "SHOW NOTES"
                ? "text-custom border-b-2 border-teal-500"
                : "text-gray-500 hover:text-custom"
            }`}
          >
            <span>SHOW NOTES</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Nội dung chính */}
      <div className="flex flex-1">
        {/* Nội dung tab */}
        <div className="w-1/2 p-4 bg-gray-50 text-custom-2 ">
          {activeTab === "DESTINATIONS" ? (
            <>
              {destinations.map((dest, index) => (
                <div
                  key={dest.id}
                  className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm mb-4 "
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-custom">{index + 1}</span>
                    <svg
                      className="w-5 h-5 text-custom"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <div>
                      <h3 className="text-lg font-semibold">{dest.name}</h3>
                      <p className="text-sm text-gray-500">
                        {dest.startDate} – {dest.endDate}
                      </p>
                    </div>
                  </div>
                  
                </div>
              ))}
              <button
                onClick={() => setShowAddDestination(true)}
                className="w-full p-4 text-gray-500 text-left hover:bg-gray-100 rounded-lg"
              >
                <svg
                  className="w-5 h-5 inline-block mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Add new destination...
              </button>
              <div className="flex space-x-2 mt-4">
                <button
                  onClick={handleDiscover}
                  className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 text-white rounded-lg"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <span>Discover</span>
                </button>
                <button
                  onClick={handleCollection}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 5h14v14H5z"
                    />
                  </svg>
                  <span>Collection</span>
                </button>
              </div>

              {/* Modal để thêm điểm đến mới */}
              {showAddDestination && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                    <h2 className="text-lg font-semibold mb-4">Add New Destination</h2>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <input
                        type="text"
                        value={newDestination.name}
                        onChange={(e) =>
                          setNewDestination({ ...newDestination, name: e.target.value })
                        }
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">Start Date</label>
                      <input
                        type="text"
                        value={newDestination.startDate}
                        onChange={(e) =>
                          setNewDestination({ ...newDestination, startDate: e.target.value })
                        }
                        className="w-full p-2 border rounded-lg"
                        placeholder="e.g., Thu 10 Apr"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">End Date</label>
                      <input
                        type="text"
                        value={newDestination.endDate}
                        onChange={(e) =>
                          setNewDestination({ ...newDestination, endDate: e.target.value })
                        }
                        className="w-full p-2 border rounded-lg"
                        placeholder="e.g., Fri 11 Apr"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">Nights</label>
                      <input
                        type="number"
                        value={newDestination.nights}
                        onChange={(e) =>
                          setNewDestination({
                            ...newDestination,
                            nights: parseInt(e.target.value) || 1,
                          })
                        }
                        className="w-full p-2 border rounded-lg"
                        min="1"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">Latitude</label>
                      <input
                        type="number"
                        value={newDestination.latitude}
                        onChange={(e) =>
                          setNewDestination({
                            ...newDestination,
                            latitude: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">Longitude</label>
                      <input
                        type="number"
                        value={newDestination.longitude}
                        onChange={(e) =>
                          setNewDestination({
                            ...newDestination,
                            longitude: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setShowAddDestination(false)}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddDestination}
                        className="px-4 py-2 bg-text-custom text-white rounded-lg"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : activeTab === "DAY BY DAY" ? (
            <div className="p-4">
              {/* Tiêu đề cột */}
              <div className="flex items-center justify-between mb-4 text-sm font-semibold text-gray-500">
                <div className="w-1/3">DATE</div>
                <div className="w-1/3 flex items-center space-x-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>DESTINATION</span>
                </div>
                <div className="w-1/3 flex justify-end space-x-4">
                  <span>SLEEPING</span>
                  <span>DISCOVER</span>
                </div>
              </div>

              {/* Lịch trình từng ngày */}
              {schedule.map((day, index) => (
                <div key={index} className="mb-6">
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                    <div className="w-1/3">
                      <p className="text-sm text-gray-500">{day.date}</p>
                      <p className="text-sm font-semibold text-gray-800">Day {day.day}</p>
                    </div>
                    <div className="w-1/3">
                      <p className="text-lg font-semibold">{day.destination}</p>
                      {day.note && <p className="text-sm text-gray-500">{day.note}</p>}
                    </div>
                    <div className="w-1/3 flex justify-end space-x-4">
                      {day.hasSleeping && (
                        <button
                          onClick={() => handleAction("SLEEPING", day.destination, day.date)}
                          className="text-custom hover:text-teal-700"
                        >
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                            />
                          </svg>
                        </button>
                      )}
                      <button
                        onClick={() => handleAction("DISCOVER", day.destination, day.date)}
                        className="text-yellow-500 hover:text-yellow-700"
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800">Show Notes</h2>
              <p className="text-gray-500">This section is under development.</p>
            </div>
          )}
        </div>

        {/* Bản đồ */}
        <div className="w-1/2 h-full">
          <div className="h-full bg-gray-200 flex items-center justify-center">
            <p className="text-gray-500">Map will be displayed here.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Activity;