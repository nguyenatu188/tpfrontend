import { useState, useCallback } from 'react';
import { PackingItem } from '../types/packingItem'; // Adjust path to your type definition

const usePackingItem = () => {
  const [items, setItems] = useState<PackingItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Add a new PackingItem
  const addPackingItem = useCallback(
    async (name: string, quantity: number, tripId: string, categoryId: string): Promise<PackingItem | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/packingItem', { // Changed to camelCase
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, quantity, tripId, categoryId }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to add packing item');
        }

        const result = await response.json();
        setItems((prev) => [...prev, result.data]);
        return result.data;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to add packing item');
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Delete a PackingItem
  const deletePackingItem = useCallback(
    async (id: string): Promise<boolean> => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/packingItem/${id}`, { // Changed to camelCase
          method: 'DELETE',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to delete packing item');
        }

        setItems((prev) => prev.filter((item) => item.id !== id));
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete packing item');
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Get PackingItems by tripId
  const getItemsByTripId = useCallback(
    async (tripId: string): Promise<PackingItem[] | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/packingItem/trip/${tripId}`, { // Changed to camelCase
          method: 'GET',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch packing items');
        }

        const result = await response.json();
        setItems(result.data);
        return result.data;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch packing items');
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Get PackingItems by categoryId
  const getItemsByCategory = useCallback(
    async (categoryId: string): Promise<PackingItem[] | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/packingItem/category/${categoryId}`, { // Changed to camelCase
          method: 'GET',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch packing items');
        }

        const result = await response.json();
        setItems(result.data);
        return result.data;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch packing items');
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    items,
    isLoading,
    error,
    addPackingItem,
    deletePackingItem,
    getItemsByTripId,
    getItemsByCategory,
  };
};

export default usePackingItem;