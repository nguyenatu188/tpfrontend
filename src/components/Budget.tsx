const Budget = () => {
  return (
    <div className="flex-1 p-6 bg-white">
      <h1 className="text-2xl font-bold text-black">Budget</h1>
      <p className="text-black">Trip ID: </p>

      {/* Activities and Costs Section */}
      <div className="mt-6 bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold text-black mb-4">Trip Activities & Costs</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="flex items-center text-black">
              <span className="mr-2">🏠</span> Sleep
            </span>
            <input
              type="text"
              className="w-24 p-1 border rounded-lg text-right text-black"
              placeholder="0 ₫"
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="flex items-center text-black">
              <span className="mr-2">🚗</span> Transport
            </span>
            <input
              type="text"
              className="w-24 p-1 border rounded-lg text-right text-black"
              placeholder="0 ₫"
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="flex items-center text-black">
              <span className="mr-2">📸</span> See & Do
            </span>
            <input
              type="text"
              className="w-24 p-1 border rounded-lg text-right text-black"
              placeholder="0 ₫"
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="flex items-center text-black">
              <span className="mr-2">🍽️</span> Eat & Drink
            </span>
            <input
              type="text"
              className="w-24 p-1 border rounded-lg text-right text-black"
              placeholder="0 ₫"
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="flex items-center text-black">
              <span className="mr-2">⋯</span> Other
            </span>
            <input
              type="text"
              className="w-24 p-1 border rounded-lg text-right text-black"
              placeholder="0 ₫"
            />
          </div>
        </div>
      </div>

      {/* Total Cost Section */}
      <div className="mt-6 bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-black">Total Trip Cost</h2>
          <p className="text-lg font-semibold text-black">0 ₫</p>
        </div>
      </div>
    </div>
  );
};

export default Budget;
