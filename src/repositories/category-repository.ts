import { Category } from "@/models/category";
import { BaseRepository } from "./base-repository";
import { getDatabase } from "./db";

export class CategoryRepository extends BaseRepository<Category> {
  constructor() {
    super("categories");
  }
  async getAll(): Promise<Category[]> {
    const db = await getDatabase();
    const docs = await db.categories.find().exec();
    return docs.map((d: any) => d.toJSON() as Category);
  }
}
