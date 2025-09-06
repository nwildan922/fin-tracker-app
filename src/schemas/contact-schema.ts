import { Contact } from "@/models/contact";
import { RxJsonSchema } from "rxdb";

export const ContactSchema: RxJsonSchema<Contact> = {
  title: "contact schema",
  version: 0,
  description: "Schema for storing contacts",
  type: "object",
  primaryKey: "id",
  properties: {
    id: {
      type: "string",
      maxLength: 128, // good practice for string primary keys
    },
    name: {
      type: "string",
    },
    phone1: {
      type: "string",
    },
    phone2: {
      type: "string",
    },
    email: {
      type: "string",
      format: "email",
    },
    note: {
      type: "string",
    },
    created_at: {
      type: "string",
      format: "date-time",
    },
  },
  required: ["id", "name", "phone1", "phone2", "created_at"],
  indexes: ["created_at", "name", "phone1"], // for sorting & searching
};
