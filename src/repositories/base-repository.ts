// src/repositories/base-repository.ts
import { getDatabase } from "@/repositories/db";
import { RxDocument } from "rxdb";

export class BaseRepository<T extends { id: string }> {
  private collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  async create(data: T): Promise<void> {
    const db = await getDatabase();
    await db[this.collectionName].insert(data);
  }

  async fetchAll(): Promise<T[]> {
    const db = await getDatabase();
    return db[this.collectionName].find().exec();
  }

  async fetchById(id: string): Promise<T | null> {
    const db = await getDatabase();
    const doc = await db[this.collectionName]
      .findOne({ selector: { id } })
      .exec();
    return doc ? (doc.toJSON() as T) : null;
  }

  async update(id: string, data: Partial<T>): Promise<boolean> {
    const db = await getDatabase();
    const doc = await db[this.collectionName]
      .findOne({ selector: { id } })
      .exec();
    if (!doc) return false;

    await doc.incrementalPatch(data);
    return true;
  }

  async delete(id: string): Promise<boolean> {
    const db = await getDatabase();
    const doc = await db[this.collectionName]
      .findOne({ selector: { id } })
      .exec();
    if (!doc) return false;

    await doc.remove();
    return true;
  }

  async observeAll(callback: (items: T[]) => void) {
    const db = await getDatabase();
    return db[this.collectionName]
      .find()
      .sort({ created_at: "desc" }) // 👈 order by created_at descending
      .$.subscribe((docs: RxDocument<T>[]) => {
        callback(docs.map((d) => d.toJSON() as T));
      });
  }
}
