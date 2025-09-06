import { BaseRepository } from "./base-repository";
import { Asset } from "@/models/asset";
import { getDatabase } from "./db";

export class AssetRepository extends BaseRepository<Asset> {
  constructor() {
    super("assets");
  }
  async getAll(): Promise<Asset[]> {
    const db = await getDatabase();
    const docs = await db.assets.find().exec();
    return docs.map((d: any) => d.toJSON() as Asset);
  }
}
