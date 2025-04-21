import React, { useState, useEffect } from 'react';

interface BudgetProps {
  id: string;
}

const Budget: React.FC<BudgetProps> = ({ id }) => {
  // State to manage the raw costs of each category (as numbers)
  const [costs, setCosts] = useState({
    sleep: 0,
    transport: 0,
    seeAndDo: 0,
    eatAndDrink: 0,
    other: 0,
  });

  // State to manage the formatted input values (as strings)
  const [displayValues, setDisplayValues] = useState({
    sleep: '',
    transport: '',
    seeAndDo: '',
    eatAndDrink: '',
    other: '',
  });

  // State to manage the total cost
  const [total, setTotal] = useState(0);

  // Function to format a number to VND style (e.g., 1234567 -> 1,234,567 ₫)
  const formatVND = (amount: number) => {
    if (amount === 0) return '';
    return `${amount.toLocaleString('vi-VN')} ₫`;
  };

  // Function to parse VND formatted string back to a number (e.g., "1,234,567 ₫" -> 1234567)
  const parseVND = (value: string) => {
    const cleanedValue = value.replace(/[^0-9]/g, ''); // Remove all non-numeric characters
    return parseFloat(cleanedValue) || 0;
  };

  // Function to handle input changes
  const handleCostChange = (category: keyof typeof costs, value: string) => {
    const numericValue = parseVND(value);
    // Prevent negative values
    if (numericValue < 0) return;

    setCosts((prevCosts) => ({
      ...prevCosts,
      [category]: numericValue,
    }));

    setDisplayValues((prevDisplayValues) => ({
      ...prevDisplayValues,
      [category]: formatVND(numericValue),
    }));
  };

  // Calculate total cost whenever costs change
  useEffect(() => {
    const totalCost = Object.values(costs).reduce((sum, cost) => sum + cost, 0);
    setTotal(totalCost);
  }, [costs]);

  return (
    <div className="flex-1 p-6 bg-white">
      <h1 className="text-2xl font-bold text-black">Budget</h1>
      <p className="text-black">Trip ID: {id}</p>

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
              value={displayValues.sleep || ''}
              onChange={(e) => handleCostChange('sleep', e.target.value)}
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
              value={displayValues.transport || ''}
              onChange={(e) => handleCostChange('transport', e.target.value)}
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
              value={displayValues.seeAndDo || ''}
              onChange={(e) => handleCostChange('seeAndDo', e.target.value)}
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
              value={displayValues.eatAndDrink || ''}
              onChange={(e) => handleCostChange('eatAndDrink', e.target.value)}
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
              value={displayValues.other || ''}
              onChange={(e) => handleCostChange('other', e.target.value)}
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
          <p className="text-lg font-semibold text-black">{formatVND(total)}</p>
        </div>
      </div>
    </div>
  );
};

export default Budget;