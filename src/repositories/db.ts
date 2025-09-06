import { createRxDatabase, addRxPlugin } from "rxdb/plugins/core";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";
import { CategorySchema } from "../schemas/category-schema";
import { AssetSchema } from "../schemas/asset-schema";
import { RxDBQueryBuilderPlugin } from "rxdb/plugins/query-builder";
import { NoteSchema } from "@/schemas/note-schema";
import { PasswordSchema } from "@/schemas/password-schema";
import { ContactSchema } from "@/schemas/contact-schema";
import { AssetCorrectionSchema } from "@/schemas/asset-correction-schema";
import { TransactionSchema } from "@/schemas/transaction-schema";

addRxPlugin(RxDBQueryBuilderPlugin);

let dbPromise: any;

export async function getDatabase() {
  if (!dbPromise) {
    dbPromise = createRxDatabase({
      name: "myionicdb",
      storage: getRxStorageDexie(),
    });

    const db = await dbPromise;
    await db.addCollections({
      categories: { schema: CategorySchema },
      assets: { schema: AssetSchema },
      assetCorrections: { schema: AssetCorrectionSchema },
      notes: { schema: NoteSchema },
      passwords: { schema: PasswordSchema },
      contacts: { schema: ContactSchema },
      transactions: { schema: TransactionSchema },
    });
  }
  return dbPromise;
}
