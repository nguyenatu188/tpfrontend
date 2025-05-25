import { useState } from "react";
import type { Accommodation } from "../types/accommodation"; // Giả sử bạn đã định nghĩa type Accommodation trong types/accommodation.ts


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
    const token = getCookie("jwt"); // Giả sử token được lưu trong cookie với key 'jwt'
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  // Tạo accommodation mới
  const createAccommodation = async (accommodationData: Omit<Accommodation, "id">) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/accommodations/createAccommodation", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(accommodationData),
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
      const response = await fetch(`/api/accommodations/updateAccommodation?id=${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(accommodationData),
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