export interface Accommodation {
  id: string;
  name: string;
  location: string;
  tripId: string;
  price?: number | null;
  startDate: Date | string; // Có thể nhận string từ API và parse thành Date
  endDate: Date | string;   // Có thể nhận string từ API và parse thành Date
}