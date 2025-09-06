import { RxJsonSchema } from "rxdb";
import type { Transaction } from "@/models/transaction";

export const TransactionSchema: RxJsonSchema<Transaction> = {
  title: "transaction schema",
  version: 0,
  description: "Schema for storing transactions of assets",
  type: "object",
  primaryKey: "id",
  properties: {
    id: {
      type: "string",
      maxLength: 36, // UUID
    },
    asset_id: {
      type: "string",
    },
    time: {
      type: "string",
      format: "date-time", // ISO datetime string
    },
    buy_price: {
      type: "number",
      minimum: 0,
    },
    qty: {
      type: "number",
      minimum: 0,
    },
    amount: {
      type: "number",
      minimum: 0,
    },
    created_at: {
      type: "string",
      format: "date-time",
    },
  },
  required: [
    "id",
    "asset_id",
    "time",
    "buy_price",
    "qty",
    "amount",
    "created_at",
  ],
  indexes: ["asset_id", "time"],
};
