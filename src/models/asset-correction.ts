export interface AssetCorrection {
  id: string; // Primary key
  asset_id: number; // Foreign key to asset.id
  total: string; // Could be numeric but schema says TEXT
  created_at: string;
}
