import { useState } from "react";
import type { Accommodation } from "../types/accommodation";

// Hàm parse token từ cookies
const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

export const useAccommodation = () => {
  const [isLoading, setIsLoading] = useState(false);

  // Lấy token từ cookies và tạo headers
  const getAuthHeaders = () => {
    const token = getCookie("jwt");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  // Tạo accommodation mới
  const createAccommodation = async (accommodationData: Omit<Accommodation, "id">) => {
    setIsLoading(true);
    try {
      // Validate dữ liệu trước khi gửi
      const { name, location, tripId, startDate, endDate, price } = accommodationData;
      if (!name || !location || !tripId || !startDate || !endDate) {
        throw new Error("Name, location, tripId, startDate, and endDate are required");
      }

      // Validate price nếu được cung cấp
      if (price != null && (typeof price !== "number" || price < 0)) {
        throw new Error("Price must be a non-negative number or null");
      }

      // Chuyển đổi startDate và endDate thành Date
      const parsedStartDate = new Date(startDate);
      const parsedEndDate = new Date(endDate);
      if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
        throw new Error("Invalid startDate or endDate format");
      }

      // Kiểm tra startDate phải trước endDate
      if (parsedStartDate >= parsedEndDate) {
        throw new Error("startDate must be before endDate");
      }

      // Kiểm tra chồng lấn thời gian bằng cách lấy danh sách accommodations hiện có
      const existingAccommodations = await getAccommodations(tripId);
      const hasOverlap = existingAccommodations.data.some((acc: Accommodation) => {
        const existingStart = new Date(acc.startDate);
        const existingEnd = new Date(acc.endDate);
        return (
          (parsedStartDate <= existingEnd && parsedStartDate >= existingStart) ||
          (parsedEndDate >= existingStart && parsedEndDate <= existingEnd) ||
          (parsedStartDate <= existingStart && parsedEndDate >= existingEnd)
        );
      });

      if (hasOverlap) {
        throw new Error("Time range overlaps with an existing accommodation");
      }

      const response = await fetch("/api/accommodations/createAccommodation", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          ...accommodationData,
          startDate: parsedStartDate.toISOString(),
          endDate: parsedEndDate.toISOString(),
          price: price != null ? price : null, // Đảm bảo price được gửi đúng
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create accommodation");
      }

      return await response.json(); // { message: "Accommodation created successfully", data: accommodation }
    } finally {
      setIsLoading(false);
    }
  };

  // Lấy danh sách accommodations theo tripId
  const getAccommodations = async (tripId: string) => {
    setIsLoading(true);
    try {
      if (!tripId) {
        throw new Error("Valid tripId is required");
      }

      const response = await fetch(`/api/accommodations/getAccommodations?tripId=${tripId}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch accommodations");
      }

      return await response.json(); // { message: "Accommodations fetched successfully", data: accommodations }
    } finally {
      setIsLoading(false);
    }
  };

  // Cập nhật accommodation
  const updateAccommodation = async (id: string, accommodationData: Partial<Omit<Accommodation, "id">>) => {
    setIsLoading(true);
    try {
      if (!id) {
        throw new Error("Valid id is required");
      }

      // Validate price nếu được cung cấp
      if (accommodationData.price != null && (typeof accommodationData.price !== "number" || accommodationData.price < 0)) {
        throw new Error("Price must be a non-negative number or null");
      }

      // Validate startDate và endDate nếu được cung cấp
      let parsedStartDate: Date | undefined;
      let parsedEndDate: Date | undefined;
      if (accommodationData.startDate || accommodationData.endDate) {
        parsedStartDate = accommodationData.startDate
          ? new Date(accommodationData.startDate)
          : undefined;
        parsedEndDate = accommodationData.endDate
          ? new Date(accommodationData.endDate)
          : undefined;

        if (
          (parsedStartDate && isNaN(parsedStartDate.getTime())) ||
          (parsedEndDate && isNaN(parsedEndDate.getTime()))
        ) {
          throw new Error("Invalid startDate or endDate format");
        }

        // Kiểm tra startDate phải trước endDate nếu cả hai được cung cấp
        if (parsedStartDate && parsedEndDate && parsedStartDate >= parsedEndDate) {
          throw new Error("startDate must be before endDate");
        }

        // Lấy accommodation hiện tại để lấy tripId và các giá trị mặc định
        const currentAccommodationResponse = await fetch(
          `/api/accommodations/getAccommodations?tripId=${accommodationData.tripId}`,
          {
            method: "GET",
            headers: getAuthHeaders(),
          }
        );
        if (!currentAccommodationResponse.ok) {
          const errorData = await currentAccommodationResponse.json();
          throw new Error(errorData.error || "Failed to fetch current accommodations");
        }
        const { data: accommodations } = await currentAccommodationResponse.json();
        const currentAccommodation = accommodations.find((acc: Accommodation) => acc.id === id);

        if (!currentAccommodation) {
          throw new Error("Accommodation not found");
        }

        // Sử dụng giá trị hiện tại nếu không cung cấp
        parsedStartDate = parsedStartDate || new Date(currentAccommodation.startDate);
        parsedEndDate = parsedEndDate || new Date(currentAccommodation.endDate);

        // Kiểm tra chồng lấn thời gian
        const hasOverlap = accommodations.some((acc: Accommodation) => {
          if (acc.id === id) return false; // Bỏ qua accommodation đang cập nhật
          const existingStart = new Date(acc.startDate);
          const existingEnd = new Date(acc.endDate);
          return (
            (parsedStartDate! <= existingEnd && parsedStartDate! >= existingStart) ||
            (parsedEndDate! >= existingStart && parsedEndDate! <= existingEnd) ||
            (parsedStartDate! <= existingStart && parsedEndDate! >= existingEnd)
          );
        });

        if (hasOverlap) {
          throw new Error("Time range overlaps with an existing accommodation");
        }
      }

      const response = await fetch(`/api/accommodations/updateAccommodation?id=${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          ...accommodationData,
          ...(parsedStartDate && { startDate: parsedStartDate.toISOString() }),
          ...(parsedEndDate && { endDate: parsedEndDate.toISOString() }),
          ...(accommodationData.price != null && { price: accommodationData.price }),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update accommodation");
      }

      return await response.json(); // { message: "Accommodation updated successfully", data: updatedAccommodation }
    } finally {
      setIsLoading(false);
    }
  };

  // Xóa accommodation
  const deleteAccommodation = async (id: string) => {
    setIsLoading(true);
    try {
      if (!id) {
        throw new Error("Valid id is required");
      }

      const response = await fetch(`/api/accommodations/deleteAccommodation?id=${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete accommodation");
      }

      return await response.json(); // { message: "Accommodation deleted successfully" }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createAccommodation,
    getAccommodations,
    updateAccommodation,
    deleteAccommodation,
    isLoading,
  };
};