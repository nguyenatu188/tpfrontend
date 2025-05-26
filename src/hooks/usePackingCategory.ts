import { useState } from "react";
import { PackingCategory, UsePackingResult } from "../types/packingCategory";

// Hàm parse token từ cookies
const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

export const usePackingCategory = (tripId?: string): UsePackingResult => {
  const [categories, setCategories] = useState<PackingCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lấy token từ cookies và tạo headers
  const getAuthHeaders = () => {
    const token = getCookie("jwt"); // Giả sử token được lưu trong cookie với key 'jwt'
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  // Lấy danh sách danh mục theo tripId
  const fetchCategories = async () => {
    if (!tripId) {
      setError("Trip ID is missing");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/getPackingCategoriesInTripId?tripId=${tripId}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch packing categories");
      }

      const data = await response.json();
      setCategories(data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch packing categories");
    } finally {
      setLoading(false);
    }
  };

  // Tạo danh mục mới
  const createCategory = async (name: string, isDefault = false): Promise<boolean> => {
    if (!tripId && !isDefault) {
      setError("Trip ID is required when isDefault is false");
      return false;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/createPackingCategory", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name,
          tripId: isDefault ? null : tripId,
          isDefault,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Failed to create packing category");
        return false;
      }

      const newCategory = await response.json();
      setCategories((prev) => [...prev, newCategory]);
      setError(null);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create packing category");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Cập nhật danh mục
  const updateCategory = async (id: string, name: string, isDefault = false): Promise<boolean> => {
    if (!tripId && !isDefault) {
      setError("Trip ID is required when isDefault is false");
      return false;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/updatePackingCategory/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name,
          tripId: isDefault ? null : tripId,
          isDefault,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Failed to update packing category");
        return false;
      }

      const updatedCategory = await response.json();
      setCategories((prev) =>
        prev.map((cat) => (cat.id === id ? updatedCategory : cat))
      );
      setError(null);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update packing category");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Xóa danh mục
  const deleteCategory = async (id: string): Promise<boolean> => {
    if (!tripId) {
      setError("Trip ID is missing");
      return false;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/deletePackingCategory/${id}?tripId=${tripId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Failed to delete packing category");
        return false;
      }

      setCategories((prev) => prev.filter((cat) => cat.id !== id));
      setError(null);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete packing category");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};