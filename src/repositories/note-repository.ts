import { BaseRepository } from "./base-repository";
import { Note } from "@/models/note";
import { getDatabase } from "./db";

export class NoteRepository extends BaseRepository<Note> {
  constructor() {
    super("notes");
  }
  async getAll(): Promise<Note[]> {
    const db = await getDatabase();
    const docs = await db.notes.find().exec();
    return docs.map((d: any) => d.toJSON() as Note);
  }
}
