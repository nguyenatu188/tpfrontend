export type PackingCategory = {
  id: string;
  name: string;
  tripId?: string | null;
  trip?: {
    id: string;
    title: string;
  } | null;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
  }>;
};