export interface Contact {
  id: string; // Primary key
  name: string; // name
  phone1: string; // Required
  phone2?: string; // Required
  email?: string; // Optional
  note?: string; // Optional notes
  created_at: string;
}
