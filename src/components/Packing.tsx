import { useState, useEffect, useCallback, useRef } from "react";

interface PackingProps {
  tripId: string;
}

interface PackingItem {
  name: string;
  packed: boolean;
}

interface Category {
  name: string;
  items: PackingItem[];
}

const Packing: React.FC<PackingProps> = ({ tripId }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({
    message: "",
    visible: false,
  });
  const popupRef = useRef<HTMLDivElement>(null);

  const predefinedCategories = [
    "Baby",
    "Beach",
    "Business",
    "Camping",
    "Clothing",
    "Cycling",
    "Electronics",
    "Essentials",
    "Fancy dinner",
    "Food",
    "Gym",
    "Hiking",
    "Kitesurfing",
    "Make-up",
    "Motorcycling",
    "Music Festival",
  ];
console.log("Packing component rendered with tripId:", tripId);
  const showToast = useCallback((message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message: "", visible: false }), 3000);
  }, []);

  const handleCategorySelect = useCallback((categoryName: string) => {
    if (!categories.some((cat) => cat.name === categoryName)) {
      setCategories((prev) => [...prev, { name: categoryName, items: [] }]);
      showToast(`Category "${categoryName}" added successfully!`);
      setIsPopupOpen(false);
    }
  }, [categories, showToast]);

  const togglePopup = useCallback(() => {
    setIsPopupOpen((prev) => !prev);
  }, []);

  const addItemToCategory = useCallback(
    (categoryName: string, itemName: string) => {
      if (!itemName.trim()) return;
      setCategories((prevCategories) =>
        prevCategories.map((cat) =>
          cat.name === categoryName
            ? { ...cat, items: [...cat.items, { name: itemName, packed: false }] }
            : cat
        )
      );
      showToast(`Item "${itemName}" added to "${categoryName}"!`);
    },
    [showToast]
  );

  const toggleItemPacked = useCallback((categoryName: string, itemIndex: number) => {
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
  }, []);

  const deleteCategory = useCallback((categoryName: string) => {
    setCategories((prevCategories) =>
      prevCategories.filter((cat) => cat.name !== categoryName)
    );
  }, []);

  const deleteItem = useCallback((categoryName: string, itemIndex: number) => {
    setCategories((prevCategories) =>
      prevCategories.map((cat) =>
        cat.name === categoryName
          ? { ...cat, items: cat.items.filter((_, idx) => idx !== itemIndex) }
          : cat
      )
    );
  }, []);

  useEffect(() => {
    const totalItems = categories.reduce((sum, cat) => sum + cat.items.length, 0);
    const packedItems = categories.reduce(
      (sum, cat) => sum + cat.items.filter((item) => item.packed).length,
      0
    );
    const newProgress = totalItems === 0 ? 0 : (packedItems / totalItems) * 100;
    setProgress(newProgress);
  }, [categories]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isPopupOpen &&
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setIsPopupOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isPopupOpen]);

  return (
    <div className="flex min-h-screen relative">
      <div className="w-full p-4 bg-gray-100 flex flex-col">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <img
              src="/default-profile.png"
              alt="User avatar"
              className="w-8 h-8 rounded-full"
            />
            <span className="text-black ml-2">Unknown User</span>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href="https://www.booking.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline text-sm"
            >
              Booking.com
            </a>
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
              In your packing list
              <span className="text-gray-500 text-sm ml-2">
                {categories.reduce((sum, cat) => sum + cat.items.length, 0)}
              </span>
            </h3>
            <button
              onClick={togglePopup}
              className="flex items-center px-3 py-2 bg-green-500 text-white rounded-full hover:bg-green-600"
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
              Add list
            </button>
          </div>
        </div>

        {/* Progress Section */}
        <div className="mt-4">
          <p className="text-black">{Math.round(progress)}% packed</p>
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
            <p className="text-gray-600">No categories added yet. Add one to get started!</p>
          ) : (
            categories.map((category, index) => (
              <div key={index} className="mt-4 bg-white p-4 rounded-lg shadow">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-black">{category.name}</h2>
                  <button
                    onClick={() => deleteCategory(category.name)}
                    className="px-3 py-1 bg-gray-200 text-black rounded-full hover:bg-gray-300"
                  >
                    Delete
                  </button>
                </div>
                {category.items.length === 0 ? (
                  <p className="text-gray-600 mt-2">No items added yet.</p>
                ) : (
                  <ul className="mt-2 space-y-2">
                    {category.items.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={item.packed}
                            onChange={() => toggleItemPacked(category.name, itemIndex)}
                            className="mr-2"
                          />
                          <span
                            className={`text-black ${item.packed ? "line-through" : ""}`}
                          >
                            {item.name}
                          </span>
                        </div>
                        <button
                          onClick={() => deleteItem(category.name, itemIndex)}
                          className="px-3 py-1 bg-gray-200 text-black rounded-full hover:bg-gray-300"
                        >
                          Delete
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-4 flex items-center">
                  <input
                    type="text"
                    placeholder="Add item..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const input = e.target as HTMLInputElement;
                        addItemToCategory(category.name, input.value);
                        input.value = "";
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
          <div className="absolute inset-0 flex items-center justify-center z-50">
            <div
              ref={popupRef}
              className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-md transform transition-all duration-300"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-black">Select category</h2>
                <button
                  onClick={togglePopup}
                  className="text-black hover:text-gray-600"
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
    </div>
  );
};

export default Packing;