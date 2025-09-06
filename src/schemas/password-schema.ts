import { RxJsonSchema } from "rxdb";
import type { Password } from "@/models/password";

export const PasswordSchema: RxJsonSchema<Password> = {
  title: "password schema",
  version: 0,
  description: "Schema for storing saved passwords",
  type: "object",
  primaryKey: "id",
  properties: {
    id: {
      type: "string",
      maxLength: 128,
    },
    site: {
      type: "string",
    },
    username: {
      type: "string",
    },
    password: {
      type: "string",
    },
    note: {
      type: "string",
    },
    created_at: {
      type: "string",
      format: "date-time",
    },
  },
  required: ["id", "site", "username", "password", "created_at"],
  indexes: ["created_at", "site", "username"],
};
