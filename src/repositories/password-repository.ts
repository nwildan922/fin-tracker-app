import { Password } from "@/models/password";
import { BaseRepository } from "./base-repository";
import { getDatabase } from "./db";

export class PasswordRepository extends BaseRepository<Password> {
  constructor() {
    super("passwords");
  }
  async getAll(): Promise<Password[]> {
    const db = await getDatabase();
    const docs = await db.passwords.find().exec();
    return docs.map((d: any) => d.toJSON() as Password);
  }
}
