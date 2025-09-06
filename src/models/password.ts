export interface Password {
  id: string; // Primary key
  site: string; // Website / app name
  username: string; // Login username
  password: string; // Login password
  note?: string; // Optional note
  created_at: string;
}
