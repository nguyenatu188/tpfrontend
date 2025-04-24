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

const Packing: React.FC<PackingProps> = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({
    message: '',
    visible: false,
  });

  const predefinedCategories = [
    'Baby', 'Beach', 'Business', 'Camping', 'Clothing', 'Cycling',
    'Electronics', 'Essentials', 'Fancy dinner', 'Food', 'Gym', 'Hiking',
    'Kitesurfing', 'Make-up', 'Motorcycling', 'Music Festival',
  ];

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message: '', visible: false }), 3000);
  };

  const handleCategorySelect = (categoryName: string) => {
    if (!categories.some((cat) => cat.name === categoryName)) {
      setCategories([...categories, { name: categoryName, items: [] }]);
      showToast(`Category "${categoryName}" added successfully!`);
      setIsPopupOpen(false);
    }
  };

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const addItemToCategory = (categoryName: string, itemName: string) => {
    if (!itemName.trim()) return;
    setCategories((prevCategories) =>
      prevCategories.map((cat) =>
        cat.name === categoryName
          ? { ...cat, items: [...cat.items, { name: itemName, packed: false }] }
          : cat
      )
    );
    showToast(`Item "${itemName}" added to "${categoryName}"!`);
  };

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

  const deleteCategory = (categoryName: string) => {
    setCategories((prevCategories) =>
      prevCategories.filter((cat) => cat.name !== categoryName)
    );
  };

  const deleteItem = (categoryName: string, itemIndex: number) => {
    setCategories((prevCategories) =>
      prevCategories.map((cat) =>
        cat.name === categoryName
          ? { ...cat, items: cat.items.filter((_, idx) => idx !== itemIndex) }
          : cat
      )
    );
  };

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
    <div className="flex-1 p-6 bg-white relative">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-black">Packing list</h1>
        <div className="flex space-x-2">
          <button
            onClick={togglePopup}
            className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
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
                      input.value = '';
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
        <div className="fixed inset-0 bg-gray-500 bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-3/4 max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-black">Select category</h2>
              <button onClick={togglePopup} className="text-black hover:text-gray-700">
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
                  <span className="text-blue-500">select</span>
                </button>
              ))}
            </div>
            <button className="mt-4 flex items-center text-blue-500 hover:text-blue-600">
              <span className="mr-1">➕</span> Create custom list
            </button>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.visible && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in-out">
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default Packing;