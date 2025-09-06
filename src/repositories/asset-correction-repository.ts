import { AssetCorrection } from "@/models/asset-correction";
import { BaseRepository } from "./base-repository";
import { getDatabase } from "./db";

export class AssetCorrectionRepository extends BaseRepository<AssetCorrection> {
  constructor() {
    super("asset_corrections");
  }

  async fetchByAssetId(assetId: number): Promise<AssetCorrection[]> {
    const db = await getDatabase();
    return db.asset_corrections
      .find({
        selector: { asset_id: assetId },
      })
      .exec();
  }
}
