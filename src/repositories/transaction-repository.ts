import { BaseRepository } from "./base-repository";
import { Transaction } from "@/models/transaction";
import { getDatabase } from "./db";

export class TransactionRepository extends BaseRepository<Transaction> {
  constructor() {
    super("transactions");
  }
  async getAll(): Promise<Transaction[]> {
    const db = await getDatabase();
    const docs = await db.transactions.find().exec();
    return docs.map((d: any) => d.toJSON() as Transaction);
  }
}
