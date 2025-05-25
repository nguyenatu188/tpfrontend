export type PackingItem = {
  id?: string;
  name: string;
  packed: boolean;
};

export type Category = {
  id: string;
  name: string;
  tripId: string | null;
  isDefault: boolean;
  items: PackingItem[];
};

export type UsePackingResult = {
  categories: Category[];
  loading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  createCategory: (name: string, isDefault?: boolean) => Promise<boolean>;
  updateCategory: (id: string, name: string, isDefault?: boolean) => Promise<boolean>;
  deleteCategory: (id: string) => Promise<boolean>;
};