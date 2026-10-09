import { User, Category, Supplier, Product, StockMovement, AuditLog } from '../types';

export const initialUsers: User[] = [
  {
    id: 'usr-1',
    full_name: 'Rose Okon',
    email: 'rose@gulfmart.com',
    phone: '08012345678',
    role: 'Administrator',
    status: 'Active',
    created_at: '2026-01-10T08:00:00Z'
  },
  {
    id: 'usr-2',
    full_name: 'John Etim',
    email: 'john@gulfmart.com',
    phone: '08087654321',
    role: 'Manager',
    status: 'Active',
    created_at: '2026-01-15T09:30:00Z'
  },
  {
    id: 'usr-3',
    full_name: 'Grace Umo',
    email: 'staff@gulfmart.com',
    phone: '08091122334',
    role: 'Inventory Staff',
    status: 'Active',
    created_at: '2026-02-01T10:00:00Z'
  }
];

export const initialCategories: Category[] = [
  { id: 'cat-1', name: 'Food', description: 'Staple foods, noodles, rice, sugar, flour', status: 'Active', created_at: '2026-01-10T08:00:00Z' },
  { id: 'cat-2', name: 'Beverages', description: 'Milk, tea, beverages, malt, juices', status: 'Active', created_at: '2026-01-10T08:00:00Z' },
  { id: 'cat-3', name: 'Snacks', description: 'Biscuits, rolls, chips, chocolates', status: 'Active', created_at: '2026-01-10T08:00:00Z' },
  { id: 'cat-4', name: 'Toiletries', description: 'Soaps, toothpastes, deodorants, tissues', status: 'Active', created_at: '2026-01-10T08:00:00Z' },
  { id: 'cat-5', name: 'Household', description: 'Detergents, disinfectants, pest control', status: 'Active', created_at: '2026-01-10T08:00:00Z' },
  { id: 'cat-6', name: 'Cosmetics', description: 'Creams, lotions, hair care', status: 'Active', created_at: '2026-01-10T08:00:00Z' }
];

export const initialSuppliers: Supplier[] = [
  {
    id: 'sup-1',
    name: 'ABC Distributors',
    contact_person: 'Mr. John',
    phone: '08033445566',
    email: 'abc.dist@gulfmartsup.com',
    address: 'Uyo, Akwa Ibom State',
    description: 'Major food and beverage distributor',
    status: 'Active',
    created_at: '2026-01-10T08:00:00Z'
  },
  {
    id: 'sup-2',
    name: 'XYZ Wholesale Centre',
    contact_person: 'Mrs. Mary',
    phone: '08022114455',
    email: 'xyz.wholesale@gmail.com',
    address: 'Calabar Road, Uyo',
    description: 'Toiletries and household goods supplier',
    status: 'Active',
    created_at: '2026-01-12T10:00:00Z'
  },
  {
    id: 'sup-3',
    name: 'Akwa Ibom Mega Suppliers',
    contact_person: 'Chief Bassey',
    phone: '08055667788',
    email: 'akwamega@yahoo.com',
    address: 'Industrial Layout, Uyo',
    description: 'General supermarket goods and snacks',
    status: 'Active',
    created_at: '2026-01-15T11:00:00Z'
  },
  {
    id: 'sup-4',
    name: 'Prime Retail Supplies',
    contact_person: 'Emeka Nnaji',
    phone: '08077889900',
    email: 'prime@retail.ng',
    address: 'Barracks Road, Uyo',
    description: 'Beverages and cosmetics',
    status: 'Active',
    created_at: '2026-01-20T14:00:00Z'
  }
];

export const initialProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Indomie Chicken Noodles',
    sku: 'IND-001',
    category_id: 'cat-1',
    supplier_id: 'sup-1',
    description: 'Instant noodles chicken flavor (Carton of 40)',
    unit: 'Carton',
    cost_price: 8000,
    selling_price: 9500,
    quantity: 45,
    reorder_level: 20,
    status: 'Active',
    created_at: '2026-02-01T08:00:00Z'
  },
  {
    id: 'prod-2',
    name: 'Peak Milk Tin 400g',
    sku: 'PM-002',
    category_id: 'cat-2',
    supplier_id: 'sup-4',
    description: 'Full cream milk powder 400g tin',
    unit: 'Tin',
    cost_price: 4500,
    selling_price: 5200,
    quantity: 8,
    reorder_level: 20,
    status: 'Active',
    created_at: '2026-02-01T09:00:00Z'
  },
  {
    id: 'prod-3',
    name: 'Golden Penny Sugar 1kg',
    sku: 'SG-003',
    category_id: 'cat-1',
    supplier_id: 'sup-1',
    description: 'Refined crystal sugar 1kg pack',
    unit: 'Bag',
    cost_price: 1200,
    selling_price: 1500,
    quantity: 0,
    reorder_level: 15,
    status: 'Active',
    created_at: '2026-02-02T10:00:00Z'
  },
  {
    id: 'prod-4',
    name: 'Coca-Cola 50cl PET',
    sku: 'CC-004',
    category_id: 'cat-2',
    supplier_id: 'sup-4',
    description: 'Refreshing carbonated soft drink 50cl (Pack of 12)',
    unit: 'Pack',
    cost_price: 3200,
    selling_price: 3800,
    quantity: 60,
    reorder_level: 25,
    status: 'Active',
    created_at: '2026-02-03T11:00:00Z'
  },
  {
    id: 'prod-5',
    name: 'Eva Table Water 75cl',
    sku: 'EV-005',
    category_id: 'cat-2',
    supplier_id: 'sup-3',
    description: 'Pure drinking water 75cl (Dispenser/Pack of 20)',
    unit: 'Pack',
    cost_price: 1500,
    selling_price: 2000,
    quantity: 12,
    reorder_level: 15,
    status: 'Active',
    created_at: '2026-02-04T12:00:00Z'
  },
  {
    id: 'prod-6',
    name: 'Milo Refill Pack 500g',
    sku: 'ML-006',
    category_id: 'cat-2',
    supplier_id: 'sup-4',
    description: 'Energy food drink nourishing chocolate malt 500g',
    unit: 'Pouch',
    cost_price: 3800,
    selling_price: 4600,
    quantity: 22,
    reorder_level: 10,
    status: 'Active',
    created_at: '2026-02-05T09:00:00Z'
  },
  {
    id: 'prod-7',
    name: 'Dettol Antiseptic Liquid 500ml',
    sku: 'DT-007',
    category_id: 'cat-4',
    supplier_id: 'sup-2',
    description: 'Trusted germ protection antiseptic liquid 500ml',
    unit: 'Bottle',
    cost_price: 2800,
    selling_price: 3400,
    quantity: 4,
    reorder_level: 15,
    status: 'Active',
    created_at: '2026-02-06T14:00:00Z'
  },
  {
    id: 'prod-8',
    name: 'Close-Up Toothpaste 140g',
    sku: 'CU-008',
    category_id: 'cat-4',
    supplier_id: 'sup-2',
    description: 'Deep action red menthol toothpaste 140g',
    unit: 'Tube',
    cost_price: 900,
    selling_price: 1200,
    quantity: 35,
    reorder_level: 12,
    status: 'Active',
    created_at: '2026-02-07T15:00:00Z'
  },
  {
    id: 'prod-9',
    name: 'Gala Sausage Roll (Box of 20)',
    sku: 'GL-009',
    category_id: 'cat-3',
    supplier_id: 'sup-3',
    description: 'Beef sausage roll snack box',
    unit: 'Box',
    cost_price: 4000,
    selling_price: 5000,
    quantity: 18,
    reorder_level: 10,
    status: 'Active',
    created_at: '2026-02-08T16:00:00Z'
  }
];

export const initialStockMovements: StockMovement[] = [
  {
    id: 'mov-1',
    product_id: 'prod-1',
    user_id: 'usr-1',
    user_name: 'Rose Okon',
    movement_type: 'STOCK_IN',
    quantity: 50,
    previous_quantity: 0,
    new_quantity: 50,
    reference: 'REF-88392',
    reason: 'Initial Restock from ABC Distributors',
    remarks: 'Delivered in good condition',
    created_at: '2026-09-18T10:30:00Z'
  },
  {
    id: 'mov-2',
    product_id: 'prod-2',
    user_id: 'usr-2',
    user_name: 'John Etim',
    movement_type: 'STOCK_OUT',
    quantity: 10,
    previous_quantity: 18,
    new_quantity: 8,
    reference: 'SO-99120',
    reason: 'Sales dispatch to retail floor',
    remarks: 'Counter restocking',
    created_at: '2026-09-18T11:05:00Z'
  },
  {
    id: 'mov-3',
    product_id: 'prod-6',
    user_id: 'usr-1',
    user_name: 'Rose Okon',
    movement_type: 'ADJUSTMENT_OUT',
    quantity: 3,
    previous_quantity: 25,
    new_quantity: 22,
    reference: 'ADJ-10293',
    reason: 'Damaged products (torn seal)',
    remarks: 'Found during morning audit',
    created_at: '2026-09-18T12:15:00Z'
  }
];

export const initialAuditLogs: AuditLog[] = [
  {
    id: 'aud-1',
    user_id: 'usr-1',
    user_name: 'Rose Okon',
    action: 'User logged in',
    entity_type: 'Auth',
    description: 'Rose Okon successfully logged into the system.',
    created_at: '2026-09-18T08:00:00Z'
  },
  {
    id: 'aud-2',
    user_id: 'usr-1',
    user_name: 'Rose Okon',
    action: 'Stock-in recorded',
    entity_type: 'Inventory',
    entity_id: 'prod-1',
    description: 'Added 50 units of Indomie Chicken Noodles (Ref: REF-88392).',
    created_at: '2026-09-18T10:30:00Z'
  },
  {
    id: 'aud-3',
    user_id: 'usr-2',
    user_name: 'John Etim',
    action: 'Stock-out recorded',
    entity_type: 'Inventory',
    entity_id: 'prod-2',
    description: 'Recorded 10 units of Peak Milk Tin as stock-out.',
    created_at: '2026-09-18T11:05:00Z'
  },
  {
    id: 'aud-4',
    user_id: 'usr-1',
    user_name: 'Rose Okon',
    action: 'Stock adjusted',
    entity_type: 'Inventory',
    entity_id: 'prod-6',
    description: 'Adjusted Milo Refill quantity by -3 due to damaged packaging.',
    created_at: '2026-09-18T12:15:00Z'
  }
];
