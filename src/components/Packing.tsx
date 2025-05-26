import { useState, useEffect, useRef } from "react";
import usePackingCategory from "../hooks/usePackingCategory";
import usePackingItem from "../hooks/usePackingItem";
import { PackingCategory } from "../types/packingCategory";
import { useAuthContext } from "../context/AuthContext";
import { useGetTrips } from "../hooks/trips/useGetTrips";
import { FiPackage } from "react-icons/fi";

interface PackingProps {
  tripId?: string;
}

interface Toast {
  message: string;
  type: "success" | "error";
}

const Packing = ({ tripId }: PackingProps) => {
  const {
    categories,
    addPackingCategory,
    deletePackingCategory,
    getCategoriesByTripId,
    isLoading: categoryLoading,
    error: categoryError,
  } = usePackingCategory();
  const {
    addPackingItem,
    deletePackingItem,
    isLoading: itemLoading,
    error: itemError,
  } = usePackingItem();
  const { authUser } = useAuthContext();
  const { trips: userTrips } = useGetTrips();

  const [isCategoryFloatboxOpen, setIsCategoryFloatboxOpen] = useState(false);
  const [isItemsFloatboxOpen, setIsItemsFloatboxOpen] = useState(false);
  const [isConfirmFloatboxOpen, setIsConfirmFloatboxOpen] = useState(false);
  const [confirmType, setConfirmType] = useState<"item" | "category" | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<PackingCategory | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemQuantity, setItemQuantity] = useState(1);
  const [toast, setToast] = useState<Toast | null>(null);
  const categoryFloatboxRef = useRef<HTMLDivElement>(null);
  const itemsFloatboxRef = useRef<HTMLDivElement>(null);
  const confirmFloatboxRef = useRef<HTMLDivElement>(null);

  const trip = tripId ? userTrips.find((trip) => trip.id === tripId) : null;
  const isProfileOwner = trip && authUser ? authUser.id === trip.owner.id : false;

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    if (tripId) {
      getCategoriesByTripId(tripId).catch((err) => {
        console.error("Error fetching categories:", err);
        setToast({ message: "Unable to load categories", type: "error" });
      });
    }
  }, [tripId, getCategoriesByTripId]);

  useEffect(() => {
    if (itemError || categoryError) {
      setToast({ message: itemError || categoryError || "Unknown error", type: "error" });
    }
  }, [itemError, categoryError]);

  useEffect(() => {
    const handleClickOutside = async (event: MouseEvent) => {
      if (
        isCategoryFloatboxOpen &&
        categoryFloatboxRef.current &&
        !categoryFloatboxRef.current.contains(event.target as Node)
      ) {
        setIsCategoryFloatboxOpen(false);
        setCategoryName("");
        if (tripId) await getCategoriesByTripId(tripId);
      }
      if (
        isItemsFloatboxOpen &&
        itemsFloatboxRef.current &&
        !itemsFloatboxRef.current.contains(event.target as Node)
      ) {
        setIsItemsFloatboxOpen(false);
        setItemName("");
        setItemQuantity(1);
        if (tripId) await getCategoriesByTripId(tripId);
      }
      if (
        isConfirmFloatboxOpen &&
        confirmFloatboxRef.current &&
        !confirmFloatboxRef.current.contains(event.target as Node)
      ) {
        setIsConfirmFloatboxOpen(false);
        setConfirmType(null);
        setConfirmId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isCategoryFloatboxOpen, isItemsFloatboxOpen, isConfirmFloatboxOpen, tripId, getCategoriesByTripId]);

  const handleAddCategory = async () => {
    if (categoryName.trim() && tripId) {
      const result = await addPackingCategory(categoryName, tripId);
      if (result) {
        setCategoryName("");
        setIsCategoryFloatboxOpen(false);
        setToast({ message: "Category added successfully", type: "success" });
        await getCategoriesByTripId(tripId);
      } else {
        setToast({ message: "Unable to add category", type: "error" });
      }
    }
  };

  const handleDeleteCategory = (categoryId: string) => {
    setConfirmType("category");
    setConfirmId(categoryId);
    setIsConfirmFloatboxOpen(true);
  };

  const handleDeleteItem = (itemId: string) => {
    setConfirmType("item");
    setConfirmId(itemId);
    setIsConfirmFloatboxOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (tripId && confirmId && confirmType) {
      if (confirmType === "item" && selectedCategory) {
        const success = await deletePackingItem(confirmId);
        if (success) {
          await getCategoriesByTripId(tripId);
          const updatedCategory = categories.find((cat: PackingCategory) => cat.id === selectedCategory.id);
          if (updatedCategory) setSelectedCategory(updatedCategory);
          setToast({ message: "Item deleted successfully", type: "success" });
        } else {
          setToast({ message: "Unable to delete item", type: "error" });
        }
      } else if (confirmType === "category") {
        const success = await deletePackingCategory(confirmId);
        if (success) {
          await getCategoriesByTripId(tripId);
          if (selectedCategory?.id === confirmId) {
            setSelectedCategory(null);
            setIsItemsFloatboxOpen(false);
          }
          setToast({ message: "Category deleted successfully", type: "success" });
        } else {
          setToast({ message: "Unable to delete category", type: "error" });
        }
      }
      setIsConfirmFloatboxOpen(false);
      setConfirmType(null);
      setConfirmId(null);
    }
  };

  const handleCancelDelete = () => {
    setIsConfirmFloatboxOpen(false);
    setConfirmType(null);
    setConfirmId(null);
  };

  const handleCategoryClick = async (category: PackingCategory) => {
    setSelectedCategory(category);
    setIsItemsFloatboxOpen(true);
    if (tripId) await getCategoriesByTripId(tripId);
  };

  const handleCloseCategoryFloatbox = async () => {
    setIsCategoryFloatboxOpen(false);
    setCategoryName("");
    if (tripId) await getCategoriesByTripId(tripId);
  };

  const handleCloseItemsFloatbox = async () => {
    setIsItemsFloatboxOpen(false);
    setItemName("");
    setItemQuantity(1);
    if (tripId) await getCategoriesByTripId(tripId);
  };

  const handleAddItem = async () => {
    if (itemName.trim() && selectedCategory && tripId) {
      const result = await addPackingItem(itemName, itemQuantity, tripId, selectedCategory.id);
      if (result) {
        setItemName("");
        setItemQuantity(1);
        setIsItemsFloatboxOpen(false);
        setToast({ message: "Item added successfully", type: "success" });
        await getCategoriesByTripId(tripId);
      } else {
        setToast({ message: "Unable to add item", type: "error" });
      }
    }
  };

  return (
    <div className="p-4 bg-white text-black min-h-screen relative">
      <h2 className="text-xl font-bold">Packing List</h2>
      <div className="flex justify-between items-center mt-2">
        {isProfileOwner && (
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => setIsCategoryFloatboxOpen(true)}
            disabled={categoryLoading || itemLoading}
          >
            Add Category
          </button>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        {categories.length > 0 ? (
          categories.map((category: PackingCategory) => (
            <div
              key={category.id}
              className="border border-gray-300 rounded-lg p-4 flex items-center justify-between bg-white cursor-pointer hover:bg-gray-100"
              onClick={() => handleCategoryClick(category)}
            >
              <div className="flex items-center">
                <div className="mr-4">
                  <span className="text-2xl"><FiPackage className="text-blue-500" /></span>
                </div>
                <div>
                  <h3 className="font-semibold text-black">{category.name}</h3>
                  <p className="text-gray-500">
                    {category.items.length}
                  </p>
                </div>
              </div>
              {isProfileOwner && (
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteCategory(category.id);
                  }}
                  disabled={categoryLoading || itemLoading}
                >
                  Delete
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500">User has no items</p>
        )}
      </div>

      {toast && (
        <div
          className={`fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg text-white ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {toast.message}
        </div>
      )}

      {isCategoryFloatboxOpen && isProfileOwner && (
        <div
          ref={categoryFloatboxRef}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl text-black max-w-sm w-full z-50"
        >
          <h3 className="text-lg font-semibold mb-4">Add New Category</h3>
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Category Name"
            className="border border-gray-300 p-2 rounded w-full mb-4 bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex justify-end gap-2">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              onClick={handleAddCategory}
              disabled={categoryLoading}
            >
              Create Category
            </button>
            <button
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
              onClick={handleCloseCategoryFloatbox}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {isItemsFloatboxOpen && selectedCategory && (
        <div
          ref={itemsFloatboxRef}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl text-black max-w-md w-full z-50"
        >
          <h3 className="text-lg font-semibold mb-4">Items in {selectedCategory.name}</h3>
          <div className="mb-4 max-h-60 overflow-y-auto">
            {selectedCategory.items.length > 0 ? (
              <ul className="space-y-2">
                {selectedCategory.items.map((item: { id: string; name: string; quantity: number }) => (
                  <li key={item.id} className="border-b pb-2 flex justify-between items-center text-gray-700">
                    <span>{item.name} (Quantity: {item.quantity})</span>
                    {isProfileOwner && (
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                        onClick={() => handleDeleteItem(item.id)}
                        disabled={itemLoading}
                      >
                        Delete
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No items in this category.</p>
            )}
          </div>
          {isProfileOwner && (
            <div>
              <input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="Item Name"
                className="border border-gray-300 p-2 rounded w-full mb-4 bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="number"
                value={itemQuantity}
                onChange={(e) => setItemQuantity(parseInt(e.target.value) || 1)}
                min="1"
                className="border border-gray-300 p-2 rounded w-full mb-4 bg-white text-black focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                  onClick={handleAddItem}
                  disabled={itemLoading}
                >
                  Add Item
                </button>
                <button
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
                  onClick={handleCloseItemsFloatbox}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {isConfirmFloatboxOpen && isProfileOwner && confirmType && (
        <div
          ref={confirmFloatboxRef}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl text-black max-w-sm w-full z-50"
        >
          <h3 className="text-lg font-semibold mb-4">
            Are you sure you want to delete this {confirmType === "item" ? "item" : "category"}?
          </h3>
          <div className="flex justify-end gap-2">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              onClick={handleConfirmDelete}
              disabled={categoryLoading || itemLoading}
            >
              Confirm
            </button>
            <button
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
              onClick={handleCancelDelete}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Packing;