import { RxJsonSchema } from "rxdb";
import type { Note } from "@/models/note";

export const NoteSchema: RxJsonSchema<Note> = {
  title: "note schema",
  version: 0,
  description: "Schema for storing notes",
  type: "object",
  primaryKey: "id",
  properties: {
    id: {
      type: "string",
      maxLength: 128,
    },
    title: {
      type: "string",
    },
    content: {
      type: "string",
    },
    created_at: {
      type: "string",
      format: "date-time",
    },
  },
  required: ["id", "title", "content", "created_at"],
  indexes: ["created_at", "title"],
};
