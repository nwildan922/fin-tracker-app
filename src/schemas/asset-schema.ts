export const AssetSchema = {
  version: 0,
  primaryKey: "id",
  type: "object",
  properties: {
    id: {
      type: "string", // UUID string
      maxLength: 100,
    },
    name: {
      type: "string",
    },
    category_id: {
      type: "number", // foreign key to category.id
    },
    created_at: {
      type: "string",
      format: "date-time",
    },
  },
  required: ["id", "name", "category_id", "created_at"],
};
