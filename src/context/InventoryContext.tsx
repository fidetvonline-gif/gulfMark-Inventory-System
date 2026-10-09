import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Category, Supplier, Product, StockMovement, AuditLog, MovementType } from '../types';
import { initialUsers, initialCategories, initialSuppliers, initialProducts, initialStockMovements, initialAuditLogs } from '../data/initialData';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface InventoryContextType {
  currentUser: User | null;
  users: User[];
  categories: Category[];
  suppliers: Supplier[];
  products: Product[];
  stockMovements: StockMovement[];
  auditLogs: AuditLog[];
  toasts: Toast[];
  login: (emailOrUsername: string, roleHint?: string) => boolean;
  logout: () => void;
  switchUserRole: (role: string) => void;
  addCategory: (data: Omit<Category, 'id' | 'created_at'>) => void;
  updateCategory: (id: string, data: Partial<Category>) => void;
  toggleCategoryStatus: (id: string) => void;
  addSupplier: (data: Omit<Supplier, 'id' | 'created_at'>) => void;
  updateSupplier: (id: string, data: Partial<Supplier>) => void;
  toggleSupplierStatus: (id: string) => void;
  addProduct: (data: Omit<Product, 'id' | 'created_at'>) => void;
  updateProduct: (id: string, data: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  recordStockIn: (productId: string, quantity: number, supplierId: string, unitCost: number, reference: string, remarks: string) => boolean;
  recordStockOut: (productId: string, quantity: number, reason: string, reference: string, remarks: string) => { success: boolean; error?: string };
  recordStockAdjustment: (productId: string, adjustedQuantity: number, adjustmentType: 'Increase' | 'Decrease', reason: string, remarks: string) => boolean;
  addUser: (data: Omit<User, 'id' | 'created_at'>) => void;
  updateUser: (id: string, data: Partial<User>) => void;
  toggleUserStatus: (id: string) => void;
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('eulfmark_current_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return initialUsers[0]; // Default logged in as Administrator (Rose) for instant demo
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('eulfmark_users');
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('eulfmark_categories');
    return saved ? JSON.parse(saved) : initialCategories;
  });

  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    const saved = localStorage.getItem('eulfmark_suppliers');
    return saved ? JSON.parse(saved) : initialSuppliers;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('eulfmark_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [stockMovements, setStockMovements] = useState<StockMovement[]>(() => {
    const saved = localStorage.getItem('eulfmark_movements');
    return saved ? JSON.parse(saved) : initialStockMovements;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('eulfmark_audit_logs');
    return saved ? JSON.parse(saved) : initialAuditLogs;
  });

  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync with localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('eulfmark_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('eulfmark_current_user');
    }
  }, [currentUser]);

  useEffect(() => { localStorage.setItem('eulfmark_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('eulfmark_categories', JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem('eulfmark_suppliers', JSON.stringify(suppliers)); }, [suppliers]);
  useEffect(() => { localStorage.setItem('eulfmark_products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('eulfmark_movements', JSON.stringify(stockMovements)); }, [stockMovements]);
  useEffect(() => { localStorage.setItem('eulfmark_audit_logs', JSON.stringify(auditLogs)); }, [auditLogs]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const logAudit = (action: string, entityType: string, description: string, entityId?: string) => {
    if (!currentUser) return;
    const newLog: AuditLog = {
      id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      user_id: currentUser.id,
      user_name: currentUser.full_name,
      action,
      entity_type: entityType,
      entity_id: entityId,
      description,
      created_at: new Date().toISOString()
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const login = (emailOrUsername: string): boolean => {
    const found = users.find(
      (u) => (u.email.toLowerCase() === emailOrUsername.toLowerCase() || u.full_name.toLowerCase().includes(emailOrUsername.toLowerCase())) && u.status === 'Active'
    );
    if (found) {
      setCurrentUser(found);
      addToast(`Welcome back, ${found.full_name} (${found.role})!`, 'success');
      logAudit('User logged in', 'Auth', `${found.full_name} logged into the system.`);
      return true;
    }
    addToast('Invalid email/username or password.', 'error');
    return false;
  };

  const logout = () => {
    if (currentUser) {
      logAudit('User logged out', 'Auth', `${currentUser.full_name} logged out.`);
    }
    setCurrentUser(null);
    addToast('Logged out successfully.', 'info');
  };

  const switchUserRole = (roleName: string) => {
    const matched = users.find((u) => u.role === roleName && u.status === 'Active');
    if (matched) {
      setCurrentUser(matched);
      addToast(`Switched active session to ${matched.full_name} (${matched.role})`, 'info');
    }
  };

  const addCategory = (data: Omit<Category, 'id' | 'created_at'>) => {
    const newCat: Category = {
      ...data,
      id: `cat-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    setCategories((prev) => [...prev, newCat]);
    addToast(`Category "${newCat.name}" added successfully.`);
    logAudit('Category created', 'Category', `Created category ${newCat.name}`, newCat.id);
  };

  const updateCategory = (id: string, data: Partial<Category>) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)));
    addToast('Category updated successfully.');
    logAudit('Category edited', 'Category', `Updated category details`, id);
  };

  const toggleCategoryStatus = (id: string) => {
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const newStatus = c.status === 'Active' ? 'Inactive' : 'Active';
          logAudit('Category status changed', 'Category', `Changed category ${c.name} status to ${newStatus}`, id);
          return { ...c, status: newStatus };
        }
        return c;
      })
    );
    addToast('Category status updated.');
  };

  const addSupplier = (data: Omit<Supplier, 'id' | 'created_at'>) => {
    const newSup: Supplier = {
      ...data,
      id: `sup-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    setSuppliers((prev) => [...prev, newSup]);
    addToast(`Supplier "${newSup.name}" registered successfully.`);
    logAudit('Supplier added', 'Supplier', `Registered supplier ${newSup.name}`, newSup.id);
  };

  const updateSupplier = (id: string, data: Partial<Supplier>) => {
    setSuppliers((prev) => prev.map((s) => (s.id === id ? { ...s, ...data } : s)));
    addToast('Supplier updated successfully.');
    logAudit('Supplier edited', 'Supplier', `Updated supplier details`, id);
  };

  const toggleSupplierStatus = (id: string) => {
    setSuppliers((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const newStatus = s.status === 'Active' ? 'Inactive' : 'Active';
          return { ...s, status: newStatus };
        }
        return s;
      })
    );
    addToast('Supplier status updated.');
  };

  const addProduct = (data: Omit<Product, 'id' | 'created_at'>) => {
    const newProd: Product = {
      ...data,
      id: `prod-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    setProducts((prev) => [newProd, ...prev]);
    addToast(`Product "${newProd.name}" registered successfully.`);
    logAudit('Product created', 'Product', `Created product ${newProd.name} (SKU: ${newProd.sku})`, newProd.id);
  };

  const updateProduct = (id: string, data: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)));
    addToast('Product updated successfully.');
    logAudit('Product edited', 'Product', `Updated product details`, id);
  };

  const deleteProduct = (id: string) => {
    const product = products.find((p) => p.id === id);
    // Deactivate instead of permanent delete if staff, or mark Inactive
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, status: 'Inactive' } : p)));
    addToast(`Product "${product?.name || id}" deactivated.`);
    logAudit('Product deactivated', 'Product', `Deactivated product ${product?.name}`, id);
  };

  const recordStockIn = (
    productId: string,
    quantity: number,
    supplierId: string,
    unitCost: number,
    reference: string,
    remarks: string
  ): boolean => {
    const product = products.find((p) => p.id === productId);
    if (!product || quantity <= 0) {
      addToast('Invalid product or quantity.', 'error');
      return false;
    }

    const prevQty = product.quantity;
    const newQty = prevQty + quantity;

    // Update product quantity & cost price if provided
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, quantity: newQty, cost_price: unitCost > 0 ? unitCost : p.cost_price } : p))
    );

    // Record stock movement
    const movement: StockMovement = {
      id: `mov-${Date.now()}`,
      product_id: productId,
      user_id: currentUser?.id || 'sys',
      user_name: currentUser?.full_name || 'System User',
      movement_type: 'STOCK_IN',
      quantity: quantity,
      previous_quantity: prevQty,
      new_quantity: newQty,
      reference: reference || `REF-${Math.floor(10000 + Math.random() * 90000)}`,
      reason: 'Stock-In (Restock)',
      remarks: remarks || 'Received into inventory',
      created_at: new Date().toISOString()
    };

    setStockMovements((prev) => [movement, ...prev]);
    addToast(`Successfully added ${quantity} units of ${product.name}. New total: ${newQty}`);
    logAudit('Stock-in recorded', 'Inventory', `Added ${quantity} units to ${product.name} (Ref: ${movement.reference})`, productId);
    return true;
  };

  const recordStockOut = (
    productId: string,
    quantity: number,
    reason: string,
    reference: string,
    remarks: string
  ): { success: boolean; error?: string } => {
    const product = products.find((p) => p.id === productId);
    if (!product) {
      return { success: false, error: 'Product not found.' };
    }
    if (quantity <= 0) {
      return { success: false, error: 'Please enter a valid quantity.' };
    }

    // STOCK VALIDATION BUSINESS RULE
    if (quantity > product.quantity) {
      const errMsg = `Insufficient stock. Available quantity is ${product.quantity}.`;
      addToast(errMsg, 'error');
      return { success: false, error: errMsg };
    }

    const prevQty = product.quantity;
    const newQty = prevQty - quantity;

    // Update product quantity
    setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, quantity: newQty } : p)));

    // Record stock movement
    const movement: StockMovement = {
      id: `mov-${Date.now()}`,
      product_id: productId,
      user_id: currentUser?.id || 'sys',
      user_name: currentUser?.full_name || 'System User',
      movement_type: 'STOCK_OUT',
      quantity: quantity,
      previous_quantity: prevQty,
      new_quantity: newQty,
      reference: reference || `SO-${Math.floor(10000 + Math.random() * 90000)}`,
      reason: reason || 'Sales / Dispatch',
      remarks: remarks || 'Removed from inventory',
      created_at: new Date().toISOString()
    };

    setStockMovements((prev) => [movement, ...prev]);
    addToast(`Successfully removed ${quantity} units of ${product.name}. Remaining: ${newQty}`);
    logAudit('Stock-out recorded', 'Inventory', `Recorded ${quantity} units stock-out for ${product.name} (Reason: ${reason})`, productId);
    return { success: true };
  };

  const recordStockAdjustment = (
    productId: string,
    adjustedQuantity: number,
    adjustmentType: 'Increase' | 'Decrease',
    reason: string,
    remarks: string
  ): boolean => {
    const product = products.find((p) => p.id === productId);
    if (!product) {
      addToast('Product not found.', 'error');
      return false;
    }

    const prevQty = product.quantity;
    const diff = adjustedQuantity - prevQty;
    if (diff === 0) {
      addToast('Adjusted quantity is the same as current stock.', 'info');
      return false;
    }

    const movementType: MovementType = diff > 0 ? 'ADJUSTMENT_IN' : 'ADJUSTMENT_OUT';

    setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, quantity: adjustedQuantity } : p)));

    const movement: StockMovement = {
      id: `mov-${Date.now()}`,
      product_id: productId,
      user_id: currentUser?.id || 'sys',
      user_name: currentUser?.full_name || 'System User',
      movement_type: movementType,
      quantity: Math.abs(diff),
      previous_quantity: prevQty,
      new_quantity: adjustedQuantity,
      reference: `ADJ-${Math.floor(10000 + Math.random() * 90000)}`,
      reason: reason || `Stock Adjustment (${adjustmentType})`,
      remarks: remarks || 'Physical count reconciliation',
      created_at: new Date().toISOString()
    };

    setStockMovements((prev) => [movement, ...prev]);
    addToast(`Stock adjusted for ${product.name}. From ${prevQty} to ${adjustedQuantity}`);
    logAudit('Stock adjusted', 'Inventory', `Adjusted stock for ${product.name} from ${prevQty} to ${adjustedQuantity} (${reason})`, productId);
    return true;
  };

  const addUser = (data: Omit<User, 'id' | 'created_at'>) => {
    const newUser: User = {
      ...data,
      id: `usr-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    setUsers((prev) => [...prev, newUser]);
    addToast(`User "${newUser.full_name}" created successfully.`);
    logAudit('User created', 'User', `Created user account for ${newUser.full_name} (${newUser.role})`, newUser.id);
  };

  const updateUser = (id: string, data: Partial<User>) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...data } : u)));
    addToast('User updated successfully.');
    logAudit('User edited', 'User', `Updated user account settings`, id);
  };

  const toggleUserStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const newStatus = u.status === 'Active' ? 'Inactive' : 'Active';
          logAudit('User deactivated', 'User', `Changed user ${u.full_name} status to ${newStatus}`, id);
          return { ...u, status: newStatus };
        }
        return u;
      })
    );
    addToast('User account status updated.');
  };

  return (
    <InventoryContext.Provider
      value={{
        currentUser,
        users,
        categories,
        suppliers,
        products,
        stockMovements,
        auditLogs,
        toasts,
        login,
        logout,
        switchUserRole,
        addCategory,
        updateCategory,
        toggleCategoryStatus,
        addSupplier,
        updateSupplier,
        toggleSupplierStatus,
        addProduct,
        updateProduct,
        deleteProduct,
        recordStockIn,
        recordStockOut,
        recordStockAdjustment,
        addUser,
        updateUser,
        toggleUserStatus,
        addToast,
        removeToast
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) throw new Error('useInventory must be used within an InventoryProvider');
  return context;
};
