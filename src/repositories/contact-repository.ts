import { Contact } from "@/models/contact";
import { BaseRepository } from "./base-repository";
import { getDatabase } from "./db";

export class ContactRepository extends BaseRepository<Contact> {
  constructor() {
    super("contacts");
  }
  async getAll(): Promise<Contact[]> {
    const db = await getDatabase();
    const docs = await db.contacts.find().exec();
    return docs.map((d: any) => d.toJSON() as Contact);
  }
}
