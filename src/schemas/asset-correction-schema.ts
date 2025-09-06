export const AssetCorrectionSchema = {
  title: "asset_correction schema",
  version: 0,
  description: "Schema for asset corrections",
  primaryKey: "id",
  type: "object",
  properties: {
    id: {
      type: "string",
      maxLength: 100, // good practice to limit string size
    },
    asset_id: {
      type: "number",
    },
    total: {
      type: "string", // stored as text, even if numeric
    },
    created_at: {
      type: "string",
      format: "date-time", // ISO string
    },
  },
  required: ["id", "asset_id", "total", "created_at"],
};
