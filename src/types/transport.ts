export interface Transport {
  id: string;
  type: string;
  from: string;
  to: string;
  price?: number | null;
  tripId: string;
  startDate: Date | string; // Có thể nhận string từ API và parse thành Date
  endDate: Date | string;   // Có thể nhận string từ API và parse thành Date
}
