export interface Asset {
  id: string; // Primary key
  name: string; // Asset name
  category_id: string; // Foreign key to category.id
  created_at: string;
}
