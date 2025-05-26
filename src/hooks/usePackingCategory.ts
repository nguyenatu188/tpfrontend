import { useState, useCallback } from 'react';
import { PackingCategory } from '../types/packingCategory'; // Adjust path to your type definition

const usePackingCategory = () => {
  const [categories, setCategories] = useState<PackingCategory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Add a new PackingCategory
  const addPackingCategory = useCallback(
    async (name: string, tripId?: string | null): Promise<PackingCategory | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/packingCategory', { // Changed to camelCase
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, tripId }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to add packing category');
        }

        const result = await response.json();
        setCategories((prev) => [...prev, result.data]);
        return result.data;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to add packing category');
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Delete a PackingCategory
  const deletePackingCategory = useCallback(
    async (id: string): Promise<boolean> => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/packingCategory/${id}`, { // Changed to camelCase
          method: 'DELETE',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to delete packing category');
        }

        setCategories((prev) => prev.filter((category) => category.id !== id));
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete packing category');
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Get PackingCategories by tripId
  const getCategoriesByTripId = useCallback(
    async (tripId: string): Promise<PackingCategory[] | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/packingCategory/${tripId}`, { // Changed to camelCase
          method: 'GET',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch packing categories');
        }

        const result = await response.json();
        setCategories(result.data);
        return result.data;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch packing categories');
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    categories,
    isLoading,
    error,
    addPackingCategory,
    deletePackingCategory,
    getCategoriesByTripId,
  };
};

export default usePackingCategory;