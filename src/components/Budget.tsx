import useBudget from "../hooks/useBudget";
import { useGetTrips } from "../hooks/trips/useGetTrips";

interface BudgetProps {
  tripId: string;
}

function Budget({ tripId }: BudgetProps) {
  const { budget, error, loading } = useBudget(tripId);
  const { trips, loading: tripsLoading } = useGetTrips();
  
  // Tìm tên trip theo tripId
  const currentTrip = trips.find(trip => trip.id === tripId);
  const tripName = currentTrip?.title || `Trip ID: ${tripId}`;

  if (loading || tripsLoading) {
    return (
      <div className="p-4 text-center">
        <div className="text-black">Loading budget...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <div className="text-red-600 font-medium">Error: {error}</div>
      </div>
    );
  }

  if (!budget || !budget.data.items.length) {
    return (
      <div className="p-4 text-center">
        <div className="text-black">
          No budget data available for: {tripName}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-3xl font-semibold text-blue-600 text-center mb-6">
        Budget for: {tripName}
      </h2>
      
      <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
        <ul className="list-none p-0 m-0">
          {budget.data.items.map((item, index) => (
            <li
              key={index}
              className={`px-5 py-4 flex justify-between items-center ${
                index < budget.data.items.length - 1 ? 'border-b border-gray-200' : ''
              } ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
            >
              <div>
                <span className="text-black font-medium text-base">
                  {item.name}
                </span>
                <span className="text-gray-500 text-sm ml-2 italic">
                  ({item.type})
                </span>
              </div>
              <span className="text-yellow-500 font-semibold text-base">
                {item.price.toLocaleString('vi-VN')} VNĐ
              </span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="font-bold text-right text-xl text-yellow-500 m-0">
          Total Price: {budget.data.totalPrice.toLocaleString('vi-VN')} VNĐ
        </p>
      </div>
    </div>
  );
}

export default Budget;