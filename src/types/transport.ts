export interface Transport {
  id: string;
  type: string;
  from: string;
  to: string;
  price: number; // Bắt buộc, không cho phép null
  tripId: string;
  startDate: Date | string;
  endDate: Date | string;
}