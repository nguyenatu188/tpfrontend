export type PackingItem = {
  id: string;
  name: string;
  quantity: number;
  tripId: string;
  trip: {
    id: string;
    title: string;
  };
  categoryId: string;
  category: {
    id: string;
    name: string;
  };
};