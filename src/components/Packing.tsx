import React, { useState, useEffect } from 'react';

interface PackingProps {
  id: string;
}

interface PackingItem {
  name: string;
  packed: boolean;
}

interface Category {
  name: string;
  items: PackingItem[];
}

const Packing: React.FC<PackingProps> = ({ id }) => {
  // State to manage selected categories and their items
  const [categories, setCategories] = useState<Category[]>([]);

  // State to control the visibility of the popup
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // State to track progress
  const [progress, setProgress] = useState(0);

  // Predefined categories (as shown in the screenshot)
  const predefinedCategories = [
    'Baby', 'Beach', 'Business', 'Camping', 'Clothing', 'Cycling',
    'Electronics', 'Essentials', 'Fancy dinner', 'Food', 'Gym', 'Hiking',
    'Kitesurfing', 'Make-up', 'Motorcycling', 'Music Festival',
  ];

  // Function to handle category selection from the popup
  const handleCategorySelect = (categoryName: string) => {
    if (!categories.some((cat) => cat.name === categoryName)) {
      setCategories([...categories, { name: categoryName, items: [] }]);
    }
  };

  // Function to open/close the popup
  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  // Function to add a new item to a category
  const addItemToCategory = (categoryName: string, itemName: string) => {
    if (!itemName.trim()) return; // Prevent adding empty items
    setCategories((prevCategories) =>
      prevCategories.map((cat) =>
        cat.name === categoryName
          ? { ...cat, items: [...cat.items, { name: itemName, packed: false }] }
          : cat
      )
    );
  };

  // Function to toggle the packed status of an item
  const toggleItemPacked = (categoryName: string, itemIndex: number) => {
    setCategories((prevCategories) =>
      prevCategories.map((cat) =>
        cat.name === categoryName
          ? {
              ...cat,
              items: cat.items.map((item, idx) =>
                idx === itemIndex ? { ...item, packed: !item.packed } : item
              ),
            }
          : cat
      )
    );
  };

  // Function to delete a category
  const deleteCategory = (categoryName: string) => {
    setCategories((prevCategories) =>
      prevCategories.filter((cat) => cat.name !== categoryName)
    );
  };

  // Function to delete an item from a category
  const deleteItem = (categoryName: string, itemIndex: number) => {
    setCategories((prevCategories) =>
      prevCategories.map((cat) =>
        cat.name === categoryName
          ? { ...cat, items: cat.items.filter((_, idx) => idx !== itemIndex) }
          : cat
      )
    );
  };

  // Calculate progress based on packed items
  useEffect(() => {
    const totalItems = categories.reduce((sum, cat) => sum + cat.items.length, 0);
    const packedItems = categories.reduce(
      (sum, cat) => sum + cat.items.filter((item) => item.packed).length,
      0
    );
    const newProgress = totalItems === 0 ? 0 : (packedItems / totalItems) * 100;
    setProgress(newProgress);
  }, [categories]);

  return (
    <div className="flex-1 p-6 bg-white">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-black">Packing list</h1>
        <div className="flex space-x-2">
          
          <button
            onClick={togglePopup}
            className="px-4 py-2 bg-container text-white rounded-full "
          >
            + Add list
          </button>
        </div>
      </div>

      {/* Progress Section */}
      <div className="mt-4">
        <p className="text-black">{Math.round(progress)}%</p>
        <div className="w-full h-2 bg-gray-200 rounded-full">
          <div
            className="h-2 bg-blue-500 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Categories and Items Section */}
      <div className="mt-6">
        {categories.length === 0 ? (
          <p className="text-black">No categories added yet.</p>
        ) : (
          categories.map((category, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-4 mb-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-black">{category.name}</h2>
                <button
                  onClick={() => deleteCategory(category.name)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
              {/* Item List */}
              {category.items.length === 0 ? (
                <p className="text-black">No items added yet.</p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {category.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={item.packed}
                          onChange={() => toggleItemPacked(category.name, itemIndex)}
                          className="mr-2"
                        />
                        <span className={`text-black ${item.packed ? 'line-through' : ''}`}>
                          {item.name}
                        </span>
                      </div>
                      <button
                        onClick={() => deleteItem(category.name, itemIndex)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {/* Add Item Input */}
              <div className="mt-4 flex items-center">
                <input
                  type="text"
                  placeholder="Add item..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const input = e.target as HTMLInputElement;
                      addItemToCategory(category.name, input.value);
                      input.value = ''; // Clear input after adding
                    }
                  }}
                  className="flex-1 p-2 border rounded-lg text-black"
                />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Popup for Category Selection */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-3/4 max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-black">Select category</h2>
              <button onClick={togglePopup} className="text-black">
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {predefinedCategories.map((category, index) => (
                <button
                  key={index}
                  onClick={() => handleCategorySelect(category)}
                  className="flex items-center justify-between p-2 bg-white border rounded-lg hover:bg-gray-100 text-black"
                >
                  <span>{category}</span>
                  <span className="text-custom">select</span>
                </button>
              ))}
            </div>
            <button className="mt-4 flex items-center text-custom">
              <span className="mr-1">➕</span> Create custom list
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Packing;