import { Backup } from "@/models/backup";
import { AssetRepository } from "@/repositories/asset-repository";
import { CategoryRepository } from "@/repositories/category-repository";
import { ContactRepository } from "@/repositories/contact-repository";
import { NoteRepository } from "@/repositories/note-repository";
import { PasswordRepository } from "@/repositories/password-repository";
import { TransactionRepository } from "@/repositories/transaction-repository";

export async function importData(data: Backup) {
  // 1. Insert Categories sequentially
  for (const item of data.categories) {
    await new CategoryRepository().create(item);
  }

  // 2. Insert Assets sequentially
  for (const item of data.assets) {
    await new AssetRepository().create(item);
  }

  // 3. Insert Transactions sequentially
  for (const item of data.transactions) {
    await new TransactionRepository().create(item);
  }

  // 4. Insert Notes sequentially
  for (const item of data.notes) {
    await new NoteRepository().create(item);
  }

  // 5. Insert Contacts sequentially
  for (const item of data.contacts) {
    await new ContactRepository().create(item);
  }

  // 6. Insert Passwords sequentially
  for (const item of data.passwords) {
    await new PasswordRepository().create(item);
  }
}
export async function exportData(): Promise<Backup> {
  // Fetch all data concurrently using Promise.all
  const [assets, categories, transactions, notes, contacts, passwords] =
    await Promise.all([
      new AssetRepository().getAll(),
      new CategoryRepository().getAll(),
      new TransactionRepository().getAll(),
      new NoteRepository().getAll(),
      new ContactRepository().getAll(),
      new PasswordRepository().getAll(),
    ]);

  // Assign the fetched data to the Backup object
  const data: Backup = {
    assets,
    categories,
    transactions,
    notes,
    contacts,
    passwords,
  };

  return data;
}
