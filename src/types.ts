export type UserRole = 'Administrator' | 'Manager' | 'Inventory Staff';

export interface User {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: 'Active' | 'Inactive';
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'Inactive';
  created_at: string;
}

export interface Supplier {
  id: string;
  name: string;
  contact_person: string;
  phone: string;
  email: string;
  address: string;
  description: string;
  status: 'Active' | 'Inactive';
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category_id: string;
  supplier_id: string;
  description: string;
  unit: string;
  cost_price: number;
  selling_price: number;
  quantity: number;
  reorder_level: number;
  image_url?: string;
  status: 'Active' | 'Inactive';
  created_at: string;
}

export type MovementType = 'STOCK_IN' | 'STOCK_OUT' | 'ADJUSTMENT_IN' | 'ADJUSTMENT_OUT';

export interface StockMovement {
  id: string;
  product_id: string;
  user_id: string;
  user_name: string;
  movement_type: MovementType;
  quantity: number;
  previous_quantity: number;
  new_quantity: number;
  reference: string;
  reason: string;
  remarks: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  user_name: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  description: string;
  created_at: string;
}

export type ActiveTab = 
  | 'dashboard' 
  | 'products' 
  | 'categories' 
  | 'suppliers' 
  | 'stock-in' 
  | 'stock-out' 
  | 'adjustment' 
  | 'movements' 
  | 'reports' 
  | 'users' 
  | 'audit-logs' 
  | 'settings';
