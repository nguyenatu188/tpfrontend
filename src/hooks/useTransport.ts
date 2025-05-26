import { useState, useCallback } from "react";
import { Transport } from "../types/transport";

// Hàm parse token từ cookies
const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  return parts.length === 2 ? parts.pop()?.split(";").shift() || null : null;
};

// Hàm kiểm tra chồng lấn thời gian
const hasTimeOverlap = (
  startDate: Date,
  endDate: Date,
  existingTransports: Transport[],
  excludeId?: string
): boolean => {
  return existingTransports.some((transport) => {
    if (excludeId && transport.id === excludeId) return false;
    const existingStart = new Date(transport.startDate);
    const existingEnd = new Date(transport.endDate);
    return (
      (startDate <= existingEnd && startDate >= existingStart) ||
      (endDate >= existingStart && endDate <= existingEnd) ||
      (startDate <= existingStart && endDate >= existingEnd)
    );
  });
};

export const useTransport = (tripId?: string) => {
  const [transports, setTransports] = useState<Transport[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lấy headers với token từ cookies
  const getAuthHeaders = useCallback(() => {
    const token = getCookie("jwt");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }, []);

  // Lấy danh sách phương tiện vận chuyển theo tripId
  const fetchTransports = useCallback(async () => {
    if (!tripId) {
      setError("Trip ID is required");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/transports/getTransports?tripId=${encodeURIComponent(tripId)}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to fetch transports (status: ${response.status})`);
      }

      const data = await response.json();
      const normalizedData = Array.isArray(data)
        ? data.map((transport: Transport) => ({
            ...transport,
            price: transport.price ?? undefined,
            startDate: new Date(transport.startDate),
            endDate: new Date(transport.endDate),
          }))
        : [];
      setTransports(normalizedData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch transports");
    } finally {
      setLoading(false);
    }
  }, [tripId]);

  // Tạo phương tiện vận chuyển mới
  const createTransport = useCallback(
    async (
      type: string,
      from: string,
      to: string,
      price?: number,
      startDate?: string,
      endDate?: string
    ): Promise<boolean> => {
      if (!tripId) {
        setError("Trip ID is required");
        return false;
      }

      if (!type?.trim() || !from?.trim() || !to?.trim() || !startDate || !endDate) {
        setError("Type, from, to, startDate, and endDate are required and cannot be empty");
        return false;
      }

      const parsedStartDate = new Date(startDate);
      const parsedEndDate = new Date(endDate);
      if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
        setError("Invalid startDate or endDate format");
        return false;
      }

      if (parsedStartDate >= parsedEndDate) {
        setError("startDate must be before endDate");
        return false;
      }

      // Kiểm tra chồng lấn thời gian
      try {
        const response = await fetch(`/api/transports/getTransports?tripId=${encodeURIComponent(tripId)}`, {
          method: "GET",
          headers: getAuthHeaders(),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch existing transports");
        }
        const existingTransports: Transport[] = await response.json();
        if (hasTimeOverlap(parsedStartDate, parsedEndDate, existingTransports)) {
          setError("Time range overlaps with an existing transport");
          return false;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to check transport overlaps");
        return false;
      }

      setLoading(true);
      try {
        const response = await fetch("/api/transports/createTransport", {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            type: type.trim(),
            from: from.trim(),
            to: to.trim(),
            price: price != null ? Number(price) : null,
            tripId,
            startDate: parsedStartDate.toISOString(),
            endDate: parsedEndDate.toISOString(),
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Failed to create transport (status: ${response.status})`);
        }

        const newTransport = (await response.json()).data;
        setTransports((prev) => [
          ...prev,
          {
            ...newTransport,
            price: newTransport.price ?? undefined,
            startDate: new Date(newTransport.startDate),
            endDate: new Date(newTransport.endDate),
          },
        ]);
        setError(null);
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create transport");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [tripId]
  );

  // Cập nhật phương tiện vận chuyển
  const updateTransport = useCallback(
    async (
      id: string,
      type: string,
      from: string,
      to: string,
      price?: number,
      startDate?: string,
      endDate?: string
    ): Promise<boolean> => {
      if (!tripId) {
        setError("Trip ID is required");
        return false;
      }

      if (!id?.trim() || !type?.trim() || !from?.trim() || !to?.trim() || !startDate || !endDate) {
        setError("ID, type, from, to, startDate, and endDate are required and cannot be empty");
        return false;
      }

      const parsedStartDate = new Date(startDate);
      const parsedEndDate = new Date(endDate);
      if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
        setError("Invalid startDate or endDate format");
        return false;
      }

      if (parsedStartDate >= parsedEndDate) {
        setError("startDate must be before endDate");
        return false;
      }

      // Kiểm tra chồng lấn thời gian
      try {
        const response = await fetch(`/api/transports/getTransports?tripId=${encodeURIComponent(tripId)}`, {
          method: "GET",
          headers: getAuthHeaders(),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch existing transports");
        }
        const existingTransports: Transport[] = await response.json();
        if (hasTimeOverlap(parsedStartDate, parsedEndDate, existingTransports, id)) {
          setError("Time range overlaps with an existing transport");
          return false;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to check transport overlaps");
        return false;
      }

      setLoading(true);
      try {
        const response = await fetch(`/api/transports/updateTransport/${encodeURIComponent(id)}`, {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            type: type.trim(),
            from: from.trim(),
            to: to.trim(),
            price: price != null ? Number(price) : null,
            tripId,
            startDate: parsedStartDate.toISOString(),
            endDate: parsedEndDate.toISOString(),
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Failed to update transport (status: ${response.status})`);
        }

        const updatedTransport = (await response.json()).data;
        setTransports((prev) =>
          prev.map((transport) =>
            transport.id === id
              ? {
                  ...updatedTransport,
                  price: updatedTransport.price ?? undefined,
                  startDate: new Date(updatedTransport.startDate),
                  endDate: new Date(updatedTransport.endDate),
                }
              : transport
          )
        );
        setError(null);
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update transport");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [tripId]
  );

  // Xóa phương tiện vận chuyển
  const deleteTransport = useCallback(async (id: string): Promise<boolean> => {
    if (!tripId) {
      setError("Trip ID is required");
      return false;
    }

    if (!id?.trim()) {
      setError("Transport ID is required and cannot be empty");
      return false;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `/api/transports/deleteTransport/${encodeURIComponent(id)}?tripId=${encodeURIComponent(tripId)}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to delete transport (status: ${response.status})`);
      }

      setTransports((prev) => prev.filter((transport) => transport.id !== id));
      setError(null);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete transport");
      return false;
    } finally {
      setLoading(false);
    }
  }, [tripId]);

  return {
    transports,
    loading,
    error,
    fetchTransports,
    createTransport,
    updateTransport,
    deleteTransport,
  };
};