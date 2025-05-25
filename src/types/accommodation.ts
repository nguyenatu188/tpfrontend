export type Accommodation = {
  id: string;
  name: string;
  location: string;
  price?: number | null;
  tripId: string;
};