import { Asset } from "./asset";
import { Category } from "./category";
import { Contact } from "./contact";
import { Note } from "./note";
import { Password } from "./password";
import { Transaction } from "./transaction";

export interface Backup {
  categories: Category[];
  assets: Asset[];
  transactions: Transaction[];
  notes: Note[];
  passwords: Password[];
  contacts: Contact[];
}
