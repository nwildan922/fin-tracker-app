export const CategorySchema = {
  version: 0,
  // The primary key is the unique identifier for each document.
  primaryKey: "id",
  type: "object",
  properties: {
    // A unique string ID for the category, enforced with maxLength
    id: {
      type: "string",
      maxLength: 100,
    },
    // The name of the category, required and must be a string
    name: {
      type: "string",
    },
    // The name of the category, required and must be a string
    is_private: {
      type: "number",
    },
    created_at: {
      type: "string",
      format: "date-time",
    },
  },
  // 'id' and 'name' are required fields for every category document.
  required: ["id", "name", "is_private", "createdAt"],
};
