export interface Transaction {
  id: string;
  asset_id: string;
  time: string; // ISO datetime string
  buy_price: number; // Purchase price
  qty: number; // Quantity
  amount: number; // Total amount (buy_price * qty)
  created_at: string;
}
