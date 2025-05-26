import { PackingItem } from './packingItem';

export type PackingCategory = {
  id: string;
  name: string;
  tripId: string | null;
  isDefault: boolean;
  items: PackingItem[];
};

export type UsePackingResult = {
  categories: PackingCategory[];
  loading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  createCategory: (name: string, isDefault?: boolean) => Promise<boolean>;
  updateCategory: (id: string, name: string, isDefault?: boolean) => Promise<boolean>;
  deleteCategory: (id: string) => Promise<boolean>;
};