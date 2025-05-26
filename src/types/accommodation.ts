export interface Accommodation {
  id: string;
  name: string;
  location: string;
  tripId: string;
  price: number; // Bắt buộc, không cho phép null
  startDate: Date | string;
  endDate: Date | string;
}