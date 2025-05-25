import { useState, useEffect, useCallback } from 'react';
import { Category, UsePackingResult } from '../types/packingCategory';

// Hàm parse token từ cookies
const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

const usePackingCategory = (tripId: string): UsePackingResult => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lấy token từ cookies
  const getAuthHeaders = useCallback(() => {
    const token = getCookie('token'); // Giả sử token được lưu trong cookie với key 'token'
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }, []); // Không có phụ thuộc vì getCookie không thay đổi

  // Lấy danh sách danh mục
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5001/getAllPackingCategories', {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data: Category[] = await response.json();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders, setCategories, setLoading, setError]);

  // Tạo danh mục mới
  const createCategory = useCallback(async (name: string, isDefault: boolean = false) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5001/createPackingCategory', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ name, tripId: isDefault ? null : tripId, isDefault }),
      });
      if (!response.ok) throw new Error('Failed to create category');
      const newCategory: Category = await response.json();
      setCategories((prev) => [...prev, newCategory]);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return false;
    } finally {
      setLoading(false);
    }
  }, [tripId, getAuthHeaders, setCategories, setLoading, setError]);

  // Cập nhật danh mục
  const updateCategory = useCallback(async (id: string, name: string, isDefault: boolean = false) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5001/updatePackingCategory/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ name, tripId: isDefault ? null : tripId, isDefault }),
      });
      if (!response.ok) throw new Error('Failed to update category');
      const updatedCategory: Category = await response.json();
      setCategories((prev) =>
        prev.map((cat) => (cat.id === id ? updatedCategory : cat))
      );
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return false;
    } finally {
      setLoading(false);
    }
  }, [tripId, getAuthHeaders, setCategories, setLoading, setError]);

  // Xóa danh mục
  const deleteCategory = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5001/deletePackingCategory/${id}?tripId=${tripId}`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to delete category');
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return false;
    } finally {
      setLoading(false);
    }
  }, [tripId, getAuthHeaders, setCategories, setLoading, setError]);

  // Tự động lấy danh mục khi hook được gọi
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

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

export default usePackingCategory;