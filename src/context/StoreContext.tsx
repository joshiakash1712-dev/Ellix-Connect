import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ActiveModule,
  UserRole,
  User,
  Store,
  Product,
  Wholesaler,
  WholesalerProduct,
  RetailerWholesalerConnection,
  CustomerProfile,
  POSInvoice,
  RestockOrder,
  CustomerOrder,
  Employee,
  AppNotification,
  AuditLog,
  SubscriptionPlan,
  InvoiceTemplate,
  CloudSyncState,
  SaveFeedback
} from '../types';
import {
  mockStores,
  mockProducts,
  mockWholesalers,
  mockWholesalerProducts,
  mockConnections,
  mockCustomers,
  mockInvoices,
  mockRestockOrders,
  mockCustomerOrders,
  mockEmployees,
  mockNotifications,
  mockAuditLogs,
  mockSubscriptions,
  mockInvoiceTemplates
} from '../data/mockData';
import { useAuth } from './AuthContext';
import { syncManager, getOfflineQueue } from '../lib/firestoreSync';

interface StoreContextType {
  activeModule: ActiveModule;
  setActiveModule: (module: ActiveModule) => void;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  currentUser: User;
  activeStore: Store;
  setActiveStore: (store: Store) => void;
  stores: Store[];
  products: Product[];
  wholesalers: Wholesaler[];
  wholesalerProducts: WholesalerProduct[];
  connections: RetailerWholesalerConnection[];
  customers: CustomerProfile[];
  invoices: POSInvoice[];
  restockOrders: RestockOrder[];
  customerOrders: CustomerOrder[];
  employees: Employee[];
  notifications: AppNotification[];
  auditLogs: AuditLog[];
  subscription: SubscriptionPlan;
  invoiceTemplates: InvoiceTemplate[];
  unreadCount: number;

  // Theme & Settings
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
  isSettingsModalOpen: boolean;
  setIsSettingsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;

  // Global Popup Modals State
  isNotificationModalOpen: boolean;
  setIsNotificationModalOpen: React.Dispatch<React.SetStateAction<boolean>>;

  // Cloud Firestore Sync State
  cloudSyncState: CloudSyncState;
  saveFeedback: SaveFeedback;
  forceCloudSync: () => Promise<void>;

  // Actions
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleProductSharing: (id: string) => void;
  createInvoice: (invoice: Omit<POSInvoice, 'id' | 'invoiceNumber'>) => POSInvoice;
  deleteInvoice: (id: string) => void;
  addInvoiceTemplate: (template: Omit<InvoiceTemplate, 'id' | 'createdAt'>) => InvoiceTemplate;
  updateInvoiceTemplate: (id: string, updates: Partial<InvoiceTemplate>) => void;
  deleteInvoiceTemplate: (id: string) => void;
  setDefaultInvoiceTemplate: (id: string) => void;
  sendRestockRequest: (productId: string, quantity: number, wholesalerId?: string) => void;
  updateRestockOrder: (orderId: string, status: RestockOrder['status'], extra?: Partial<RestockOrder>) => void;
  acceptQuotationAndGeneratePO: (orderId: string) => void;
  createCustomerOrder: (orderData: Omit<CustomerOrder, 'id' | 'orderNumber' | 'createdAt' | 'pickupQrCode'>) => CustomerOrder;
  updateCustomerOrderStatus: (orderId: string, status: CustomerOrder['orderStatus']) => void;
  addCustomer: (customer: Omit<CustomerProfile, 'id' | 'totalPurchases'>) => CustomerProfile;
  updateCustomer: (id: string, updates: Partial<CustomerProfile>) => void;
  deleteCustomer: (id: string) => void;
  receiveCreditPayment: (customerId: string, amount: number) => void;
  batchAssignInvoiceTemplate: (customerIds: string[], templateId: string) => void;
  updateCustomerSegment: (customerId: string, segment: string) => void;
  addEmployee: (emp: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  batchUpdateEmployees: (ids: string[], updates: Partial<Employee>, actionDescription?: string) => void;
  batchDeleteEmployees: (ids: string[]) => void;
  addWholesaler: (wholesaler: Omit<Wholesaler, 'id'>) => Wholesaler;
  updateWholesaler: (id: string, updates: Partial<Wholesaler>) => void;
  deleteWholesaler: (id: string) => void;
  addStore: (store: Omit<Store, 'id' | 'rating' | 'reviewCount'>) => void;
  updateStore: (id: string, updates: Partial<Store>) => void;
  deleteStore: (id: string) => void;
  updateSubscription: (updates: Partial<SubscriptionPlan>) => void;
  clearAuditLogs: () => void;
  toggleConnectionStatus: (connectionId: string, status: RetailerWholesalerConnection['status']) => void;
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  addAuditLog: (action: string, details: string, status?: AuditLog['status']) => void;
  resetToDefaultData: () => void;
  restoreDatabaseFromJSON: (snapshot: any) => { success: boolean; message: string };
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from local storage or fallback to mock data
  const [activeModule, setActiveModule] = useState<ActiveModule>('retailer');
  const [activeRole, setActiveRole] = useState<UserRole>('owner');

  const [stores, setStores] = useState<Store[]>(() => {
    const saved = localStorage.getItem('ellix_stores');
    return saved ? JSON.parse(saved) : mockStores;
  });
  const [activeStore, setActiveStore] = useState<Store>(stores[0] || mockStores[0]);

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('ellix_products');
    return saved ? JSON.parse(saved) : mockProducts;
  });

  const [wholesalers, setWholesalers] = useState<Wholesaler[]>(() => {
    const saved = localStorage.getItem('ellix_wholesalers');
    return saved ? JSON.parse(saved) : mockWholesalers;
  });
  const [wholesalerProducts] = useState<WholesalerProduct[]>(mockWholesalerProducts);

  const [connections, setConnections] = useState<RetailerWholesalerConnection[]>(() => {
    const saved = localStorage.getItem('ellix_connections');
    return saved ? JSON.parse(saved) : mockConnections;
  });

  const [customers, setCustomers] = useState<CustomerProfile[]>(() => {
    const saved = localStorage.getItem('ellix_customers');
    return saved ? JSON.parse(saved) : mockCustomers;
  });

  const [invoices, setInvoices] = useState<POSInvoice[]>(() => {
    const saved = localStorage.getItem('ellix_invoices');
    return saved ? JSON.parse(saved) : mockInvoices;
  });

  const [restockOrders, setRestockOrders] = useState<RestockOrder[]>(() => {
    const saved = localStorage.getItem('ellix_restock_orders');
    return saved ? JSON.parse(saved) : mockRestockOrders;
  });

  const [customerOrders, setCustomerOrders] = useState<CustomerOrder[]>(() => {
    const saved = localStorage.getItem('ellix_customer_orders');
    return saved ? JSON.parse(saved) : mockCustomerOrders;
  });

  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('ellix_employees');
    return saved ? JSON.parse(saved) : mockEmployees;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('ellix_notifications');
    return saved ? JSON.parse(saved) : mockNotifications;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('ellix_audit_logs');
    return saved ? JSON.parse(saved) : mockAuditLogs;
  });

  const [invoiceTemplates, setInvoiceTemplates] = useState<InvoiceTemplate[]>(() => {
    const saved = localStorage.getItem('ellix_invoice_templates');
    return saved ? JSON.parse(saved) : mockInvoiceTemplates;
  });

  const [subscription, setSubscription] = useState<SubscriptionPlan>(() => {
    const saved = localStorage.getItem('ellix_subscription');
    return saved ? JSON.parse(saved) : mockSubscriptions[0];
  });
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);

  // Cloud Firestore Sync State
  const [cloudSyncState, setCloudSyncState] = useState<CloudSyncState>(() => ({
    status: 'synced',
    lastSyncedAt: new Date().toISOString(),
    pendingCount: getOfflineQueue().length,
    lastError: null,
    databaseId: syncManager.getDatabaseId(),
    syncedCounts: {
      products: 0,
      customers: 0,
      invoices: 0,
      restockOrders: 0,
      customerOrders: 0
    }
  }));

  const [saveFeedback, setSaveFeedback] = useState<SaveFeedback>({
    status: 'idle',
    message: '',
    timestamp: 0
  });

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('ellix_theme');
    return (saved === 'light' || saved === 'dark') ? saved : 'dark';
  });

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    localStorage.setItem('ellix_theme', theme);
    if (theme === 'light') {
      document.documentElement.classList.add('theme-light');
      document.documentElement.classList.remove('dark');
      document.body.classList.add('theme-light');
    } else {
      document.documentElement.classList.remove('theme-light');
      document.documentElement.classList.add('dark');
      document.body.classList.remove('theme-light');
    }
  }, [theme]);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('ellix_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('ellix_connections', JSON.stringify(connections));
  }, [connections]);

  useEffect(() => {
    localStorage.setItem('ellix_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('ellix_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('ellix_restock_orders', JSON.stringify(restockOrders));
  }, [restockOrders]);

  useEffect(() => {
    localStorage.setItem('ellix_customer_orders', JSON.stringify(customerOrders));
  }, [customerOrders]);

  useEffect(() => {
    localStorage.setItem('ellix_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('ellix_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('ellix_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('ellix_wholesalers', JSON.stringify(wholesalers));
  }, [wholesalers]);

  useEffect(() => {
    localStorage.setItem('ellix_invoice_templates', JSON.stringify(invoiceTemplates));
  }, [invoiceTemplates]);

  const { currentUser: authUser, userProfile } = useAuth();

  const currentUser: User = {
    id: authUser?.uid || 'usr-current',
    firebaseUid: authUser?.uid,
    name: userProfile?.displayName || authUser?.displayName || (activeRole === 'wholesaler_admin' ? 'Metro Wholesaler Admin' : 'Vikram Malhotra'),
    email: userProfile?.email || authUser?.email || 'user@ellixconnect.com',
    phone: userProfile?.phoneNumber || authUser?.phoneNumber || '+91 98765 43210',
    role: activeRole,
    storeId: activeStore.id,
    wholesalerId: 'ws-101',
    avatar: authUser?.photoURL || userProfile?.photoURL,
    permissions: ['all'],
    emailVerified: userProfile?.emailVerified || authUser?.emailVerified || false,
    phoneVerified: userProfile?.phoneVerified || Boolean(authUser?.phoneNumber),
    linkedProviders: userProfile?.linkedProviders || authUser?.providerData?.map(p => p.providerId) || [],
    passwordSynchronized: userProfile?.passwordSynchronized || false,
    isRealAuth: Boolean(authUser)
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const addAuditLog = (action: string, details: string, status: AuditLog['status'] = 'success') => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      user: currentUser.name,
      role: activeRole,
      action,
      details,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      ipAddress: '127.0.0.1',
      status
    };
    setAuditLogs(prev => [newLog, ...prev]);
    syncManager.syncAuditLog(activeStore.id, newLog);
  };

  const addNotification = (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}`,
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Firestore Real-Time Live Synchronization Effect
  useEffect(() => {
    const unsub = syncManager.subscribeToStore(
      activeStore.id,
      {
        onProductsUpdate: (cloudProducts) => {
          if (cloudProducts && cloudProducts.length > 0) {
            setProducts(cloudProducts);
          }
        },
        onCustomersUpdate: (cloudCustomers) => {
          if (cloudCustomers && cloudCustomers.length > 0) {
            setCustomers(cloudCustomers);
          }
        },
        onInvoicesUpdate: (cloudInvoices) => {
          if (cloudInvoices && cloudInvoices.length > 0) {
            setInvoices(cloudInvoices);
          }
        },
        onRestockOrdersUpdate: (cloudOrders) => {
          if (cloudOrders && cloudOrders.length > 0) {
            setRestockOrders(cloudOrders);
          }
        },
        onCustomerOrdersUpdate: (cloudCustomerOrders) => {
          if (cloudCustomerOrders && cloudCustomerOrders.length > 0) {
            setCustomerOrders(cloudCustomerOrders);
          }
        },
        onAuditLogsUpdate: (cloudLogs) => {
          if (cloudLogs && cloudLogs.length > 0) {
            setAuditLogs(cloudLogs);
          }
        },
        onWholesalersUpdate: (cloudWholesalers) => {
          if (cloudWholesalers && cloudWholesalers.length > 0) {
            setWholesalers(cloudWholesalers);
          }
        },
        onEmployeesUpdate: (cloudEmployees) => {
          if (cloudEmployees && cloudEmployees.length > 0) {
            setEmployees(cloudEmployees);
          }
        },
        onSaveFeedback: (feedback) => {
          setSaveFeedback(feedback);
        },
        onSyncStateChange: (stateUpdate) => {
          setCloudSyncState(prev => ({
            ...prev,
            ...stateUpdate,
            syncedCounts: {
              products: products.length,
              customers: customers.length,
              invoices: invoices.length,
              restockOrders: restockOrders.length,
              customerOrders: customerOrders.length
            }
          }));
        }
      },
      {
        products,
        customers,
        invoices,
        restockOrders,
        customerOrders,
        auditLogs,
        wholesalers,
        employees
      }
    );

    return () => unsub();
  }, [activeStore.id]);

  const forceCloudSync = async () => {
    setCloudSyncState(prev => ({ ...prev, status: 'syncing' }));
    try {
      await syncManager.flushQueue();
      await syncManager.seedProducts(activeStore.id, products);
      await syncManager.seedCustomers(activeStore.id, customers);
      await syncManager.seedInvoices(activeStore.id, invoices);
      await syncManager.seedRestockOrders(activeStore.id, restockOrders);
      await syncManager.seedCustomerOrders(activeStore.id, customerOrders);
      setCloudSyncState(prev => ({
        ...prev,
        status: 'synced',
        lastSyncedAt: new Date().toISOString(),
        pendingCount: getOfflineQueue().length,
        lastError: null,
        syncedCounts: {
          products: products.length,
          customers: customers.length,
          invoices: invoices.length,
          restockOrders: restockOrders.length,
          customerOrders: customerOrders.length
        }
      }));
      addNotification({
        title: 'Cloud Database Synchronized',
        message: 'All inventory items, POS invoices, and records are fully synced with Firestore without any data loss.',
        category: 'system',
        linkModule: 'retailer'
      });
    } catch (e: any) {
      setCloudSyncState(prev => ({
        ...prev,
        status: 'error',
        lastError: e?.message || 'Sync failed'
      }));
    }
  };

  // Product Actions
  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`
    };
    setProducts(prev => [newProduct, ...prev]);
    syncManager.syncProduct(activeStore.id, newProduct);
    addAuditLog('Add Product', `Added product: ${newProduct.name} (Stock: ${newProduct.stock})`);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const updated = { ...p, ...updates };
        syncManager.syncProduct(activeStore.id, updated);
        // Check low stock threshold trigger
        if (updated.stock <= updated.minThreshold && p.stock > p.minThreshold) {
          addNotification({
            title: `Low Stock Alert: ${updated.name}`,
            message: `Current stock (${updated.stock}) is below threshold (${updated.minThreshold}).`,
            category: 'low_stock',
            linkModule: 'retailer'
          });
        }
        return updated;
      }
      return p;
    }));
    addAuditLog('Update Product', `Updated product ID ${id}`);
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    syncManager.deleteProduct(activeStore.id, id);
    addAuditLog('Delete Product', `Deleted product ID ${id}`);
  };

  const toggleProductSharing = (id: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const updatedShare = !p.sharedWithWholesalers;
        const updated = { ...p, sharedWithWholesalers: updatedShare };
        syncManager.syncProduct(activeStore.id, updated);
        addAuditLog('Product Wholesaler Sharing Toggled', `${p.name} sharing set to ${updatedShare ? 'Enabled' : 'Disabled'}`);
        return updated;
      }
      return p;
    }));
  };

  // Billing POS Invoice
  const createInvoice = (invoiceData: Omit<POSInvoice, 'id' | 'invoiceNumber'>): POSInvoice => {
    const invCount = invoices.length + 1;
    const invoiceNumber = `INV-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${invCount.toString().padStart(2, '0')}`;
    const newInvoice: POSInvoice = {
      ...invoiceData,
      id: `inv-${Date.now()}`,
      invoiceNumber
    };

    // Deduct inventory stock automatically and sync to Firestore
    const updatedProductsList: Product[] = [];
    setProducts(prev => prev.map(p => {
      const soldItem = newInvoice.items.find(i => i.productId === p.id);
      if (soldItem) {
        const newStock = Math.max(0, p.stock - soldItem.quantity);
        const updatedProd = { ...p, stock: newStock };
        updatedProductsList.push(updatedProd);
        // Check threshold auto-restock trigger
        if (newStock <= p.minThreshold) {
          setTimeout(() => {
            sendRestockRequest(p.id, Math.max(15, p.minThreshold * 2), 'ws-101');
          }, 500);
        }
        return updatedProd;
      }
      return p;
    }));

    // Update Customer loyalty & total purchases if customer linked
    let updatedCustObj: CustomerProfile | undefined = undefined;
    if (newInvoice.customerPhone) {
      setCustomers(prev => prev.map(c => {
        if (c.phone === newInvoice.customerPhone) {
          const updatedCust = {
            ...c,
            totalPurchases: c.totalPurchases + newInvoice.grandTotal,
            loyaltyPoints: Math.max(0, c.loyaltyPoints - newInvoice.loyaltyPointsRedeemed + newInvoice.loyaltyPointsEarned)
          };
          updatedCustObj = updatedCust;
          return updatedCust;
        }
        return c;
      }));
    }

    setInvoices(prev => [newInvoice, ...prev]);

    const auditLogObj: AuditLog = {
      id: `log-${Date.now()}`,
      user: currentUser.name,
      role: activeRole,
      action: 'POS Invoice Created',
      details: `Invoice ${invoiceNumber} generated for ${newInvoice.customerName} (₹${newInvoice.grandTotal})`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      ipAddress: '127.0.0.1',
      status: 'success'
    };
    setAuditLogs(prev => [auditLogObj, ...prev]);

    // Atomic persistence across all related entities
    syncManager.syncPOSSaleAtomic(
      activeStore.id,
      newInvoice,
      updatedProductsList,
      updatedCustObj,
      auditLogObj
    );

    addNotification({
      title: 'Invoice Generated',
      message: `Invoice #${invoiceNumber} created for ₹${newInvoice.grandTotal} (${newInvoice.paymentMethod.toUpperCase()}).`,
      category: 'payment',
      linkModule: 'retailer'
    });

    return newInvoice;
  };

  const deleteInvoice = (id: string) => {
    setInvoices(prev => prev.filter(inv => inv.id !== id));
    syncManager.deleteInvoice(activeStore.id, id);
    addAuditLog('Invoice Deleted', `Deleted invoice ID ${id}`, 'warning');
  };

  // Invoice Template Actions
  const addInvoiceTemplate = (templateData: Omit<InvoiceTemplate, 'id' | 'createdAt'>): InvoiceTemplate => {
    const newTemplate: InvoiceTemplate = {
      ...templateData,
      id: `tpl-${Date.now()}`,
      createdAt: new Date().toISOString().slice(0, 10)
    };

    setInvoiceTemplates(prev => {
      let updated = prev;
      if (newTemplate.isDefault) {
        updated = prev.map(t => t.targetSegment === newTemplate.targetSegment ? { ...t, isDefault: false } : t);
      }
      return [newTemplate, ...updated];
    });

    addAuditLog('Invoice Template Created', `Created invoice template: ${newTemplate.name} for ${newTemplate.targetSegment}`);
    return newTemplate;
  };

  const updateInvoiceTemplate = (id: string, updates: Partial<InvoiceTemplate>) => {
    setInvoiceTemplates(prev => prev.map(t => {
      if (t.id === id) {
        return { ...t, ...updates };
      }
      if (updates.isDefault && t.targetSegment === updates.targetSegment) {
        return { ...t, isDefault: false };
      }
      return t;
    }));
    addAuditLog('Invoice Template Updated', `Updated template ID ${id}`);
  };

  const deleteInvoiceTemplate = (id: string) => {
    setInvoiceTemplates(prev => prev.filter(t => t.id !== id));
    addAuditLog('Invoice Template Deleted', `Deleted template ID ${id}`);
  };

  const setDefaultInvoiceTemplate = (id: string) => {
    const target = invoiceTemplates.find(t => t.id === id);
    if (!target) return;
    setInvoiceTemplates(prev => prev.map(t => {
      if (t.id === id) return { ...t, isDefault: true };
      if (t.targetSegment === target.targetSegment) return { ...t, isDefault: false };
      return t;
    }));
    addAuditLog('Default Invoice Template Changed', `Set ${target.name} as default for ${target.targetSegment}`);
  };

  // Restock Purchase Orders (Wholesaler Integration)
  const sendRestockRequest = (productId: string, quantity: number, wholesalerId: string = 'ws-101') => {
    const prod = products.find(p => p.id === productId);
    const ws = wholesalers.find(w => w.id === wholesalerId);
    if (!prod) return;

    const newRestockOrder: RestockOrder = {
      id: `ro-${Date.now()}`,
      retailerStoreId: activeStore.id,
      retailerName: activeStore.name,
      wholesalerId: ws?.id || 'ws-101',
      wholesalerName: ws?.name || 'Metro Mega Distribution Pvt Ltd',
      productId: prod.id,
      productName: prod.name,
      suggestedQty: quantity,
      status: 'suggested',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      notes: `Restock request triggered for ${prod.name} (Stock: ${prod.stock}).`
    };

    setRestockOrders(prev => [newRestockOrder, ...prev]);
    syncManager.syncRestockOrder(activeStore.id, newRestockOrder);

    addNotification({
      title: 'Restock Suggestion Sent',
      message: `Restock request for ${quantity}x ${prod.name} sent to ${newRestockOrder.wholesalerName}.`,
      category: 'restock',
      linkModule: 'wholesaler'
    });

    addAuditLog('Restock Request Sent', `Requested ${quantity} units of ${prod.name} from ${newRestockOrder.wholesalerName}`);
  };

  const updateRestockOrder = (orderId: string, status: RestockOrder['status'], extra?: Partial<RestockOrder>) => {
    setRestockOrders(prev => prev.map(ro => {
      if (ro.id === orderId) {
        const updated = { ...ro, status, ...extra };
        syncManager.syncRestockOrder(activeStore.id, updated);

        // If delivered, auto-update stock in retailer inventory!
        if (status === 'delivered') {
          setProducts(pList => pList.map(p => {
            if (p.id === ro.productId) {
              const qtyToAdd = updated.quotedQty || updated.suggestedQty;
              const updatedProduct = { ...p, stock: p.stock + qtyToAdd };
              syncManager.syncProduct(activeStore.id, updatedProduct);
              return updatedProduct;
            }
            return p;
          }));

          addNotification({
            title: 'Stock Auto-Updated upon Delivery',
            message: `${updated.quotedQty || updated.suggestedQty} units of ${updated.productName} added to inventory.`,
            category: 'restock',
            linkModule: 'retailer'
          });
        }

        return updated;
      }
      return ro;
    }));

    addAuditLog('Restock Order Status Updated', `PO #${orderId} set to ${status}`);
  };

  const acceptQuotationAndGeneratePO = (orderId: string) => {
    updateRestockOrder(orderId, 'po_created');
    addNotification({
      title: 'PO Generated & Wholesaler Notified',
      message: `Restock quotation accepted for PO #${orderId}. Delivery dispatch pending.`,
      category: 'restock',
      linkModule: 'wholesaler'
    });
  };

  // Customer Orders & Reservations
  const createCustomerOrder = (orderData: Omit<CustomerOrder, 'id' | 'orderNumber' | 'createdAt' | 'pickupQrCode'>): CustomerOrder => {
    const ordNumber = `ORD-ELLIX-${Math.floor(1000 + Math.random() * 9000)}`;
    const qrCode = `QR-PICKUP-${ordNumber}`;

    const newOrder: CustomerOrder = {
      ...orderData,
      id: `co-${Date.now()}`,
      orderNumber: ordNumber,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      pickupQrCode: qrCode
    };

    setCustomerOrders(prev => [newOrder, ...prev]);
    syncManager.syncCustomerOrder(activeStore.id, newOrder);

    // Add Notification to Retailer
    addNotification({
      title: `New Customer Order (${newOrder.orderType.toUpperCase()})`,
      message: `Order #${ordNumber} received from ${newOrder.customerName} (₹${newOrder.totalAmount}).`,
      category: 'customer_order',
      linkModule: 'retailer'
    });

    addAuditLog('Customer Order Placed', `Order #${ordNumber} created by ${newOrder.customerName}`);

    return newOrder;
  };

  const updateCustomerOrderStatus = (orderId: string, status: CustomerOrder['orderStatus']) => {
    setCustomerOrders(prev => prev.map(co => {
      if (co.id === orderId) {
        const updated = { ...co, orderStatus: status };
        syncManager.syncCustomerOrder(activeStore.id, updated);
        return updated;
      }
      return co;
    }));
    addAuditLog('Customer Order Updated', `Order #${orderId} status set to ${status}`);
  };

  // Customers & Credit Management
  const addCustomer = (customerData: Omit<CustomerProfile, 'id' | 'totalPurchases'>): CustomerProfile => {
    const newCust: CustomerProfile = {
      ...customerData,
      id: `cust-${Date.now()}`,
      totalPurchases: 0
    };
    setCustomers(prev => [newCust, ...prev]);
    syncManager.syncCustomer(activeStore.id, newCust);
    addAuditLog('Customer Profile Created', `Added ${newCust.name} (${newCust.phone})`);
    return newCust;
  };

  const receiveCreditPayment = (customerId: string, amount: number) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === customerId) {
        const newBal = Math.max(0, c.creditBalance - amount);
        const updatedCust = { ...c, creditBalance: newBal };
        syncManager.syncCustomer(activeStore.id, updatedCust);
        return updatedCust;
      }
      return c;
    }));

    addAuditLog('Credit Payment Received', `Received ₹${amount} credit payment for Customer ID ${customerId}`);
    addNotification({
      title: 'Credit Payment Cleared',
      message: `₹${amount} credit payment recorded. Balance updated.`,
      category: 'payment',
      linkModule: 'retailer'
    });
  };

  const batchAssignInvoiceTemplate = (customerIds: string[], templateId: string) => {
    const targetTpl = invoiceTemplates.find(t => t.id === templateId);
    setCustomers(prev => prev.map(c => {
      if (customerIds.includes(c.id)) {
        const updated = {
          ...c,
          assignedTemplateId: templateId,
          segment: targetTpl ? targetTpl.targetSegment : c.segment
        };
        syncManager.syncCustomer(activeStore.id, updated);
        return updated;
      }
      return c;
    }));

    addNotification({
      title: 'Batch Invoice Template Assigned',
      message: `Assigned template "${targetTpl?.name || templateId}" to ${customerIds.length} customer(s).`,
      category: 'system',
      linkModule: 'retailer'
    });

    addAuditLog('Batch Template Assignment', `Assigned template ${targetTpl?.name || templateId} to ${customerIds.length} customers`);
  };

  const updateCustomerSegment = (customerId: string, segment: string) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === customerId) {
        const updated = { ...c, segment };
        syncManager.syncCustomer(activeStore.id, updated);
        return updated;
      }
      return c;
    }));
    addAuditLog('Customer Segment Updated', `Updated segment to ${segment} for customer ID ${customerId}`);
  };

  const updateCustomer = (id: string, updates: Partial<CustomerProfile>) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === id) {
        const updated = { ...c, ...updates };
        syncManager.syncCustomer(activeStore.id, updated);
        return updated;
      }
      return c;
    }));
    addAuditLog('Customer Profile Updated', `Updated customer ID ${id}`);
  };

  const deleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
    syncManager.deleteCustomer(activeStore.id, id);
    addAuditLog('Customer Profile Deleted', `Deleted customer ID ${id}`);
  };

  // Employee Management
  const addEmployee = (empData: Omit<Employee, 'id'>) => {
    const newEmp: Employee = {
      ...empData,
      id: `emp-${Date.now()}`
    };
    setEmployees(prev => [...prev, newEmp]);
    syncManager.syncEmployee(activeStore.id, newEmp);
    addAuditLog('Employee Added', `Added ${newEmp.name} as ${newEmp.role}`);
  };

  const updateEmployee = (id: string, updates: Partial<Employee>) => {
    setEmployees(prev => prev.map(e => {
      if (e.id === id) {
        const updated = { ...e, ...updates };
        syncManager.syncEmployee(activeStore.id, updated);
        return updated;
      }
      return e;
    }));
    addAuditLog('Employee Updated', `Updated staff ID ${id}`);
  };

  const deleteEmployee = (id: string) => {
    setEmployees(prev => prev.filter(e => e.id !== id));
    syncManager.deleteEmployee(activeStore.id, id);
    addAuditLog('Employee Removed', `Removed employee ID ${id}`, 'warning');
    addNotification({
      title: 'Staff Access Revoked',
      message: `Employee ID ${id} removed from branch roster.`,
      category: 'security',
      linkModule: 'admin'
    });
  };

  const batchUpdateEmployees = (ids: string[], updates: Partial<Employee>, actionDescription?: string) => {
    setEmployees(prev => prev.map(e => {
      if (ids.includes(e.id)) {
        const updated = { ...e, ...updates };
        syncManager.syncEmployee(activeStore.id, updated);
        return updated;
      }
      return e;
    }));
    const desc = actionDescription || `Updated ${ids.length} staff records`;
    addAuditLog('Batch Staff Update', desc);
    addNotification({
      title: 'Batch Staff Updated',
      message: `${ids.length} staff member accounts were successfully updated.`,
      category: 'security',
      linkModule: 'admin'
    });
  };

  const batchDeleteEmployees = (ids: string[]) => {
    setEmployees(prev => prev.filter(e => !ids.includes(e.id)));
    ids.forEach(id => syncManager.deleteEmployee(activeStore.id, id));
    addAuditLog('Batch Staff Removed', `Removed ${ids.length} employees from roster`, 'warning');
    addNotification({
      title: 'Batch Staff Accounts Removed',
      message: `${ids.length} employee profiles were revoked and removed.`,
      category: 'security',
      linkModule: 'admin'
    });
  };

  // Wholesaler Management (B2B Directory & Onboarding)
  const addWholesaler = (wholesalerData: Omit<Wholesaler, 'id'>): Wholesaler => {
    const newWs: Wholesaler = {
      ...wholesalerData,
      id: `ws-${Date.now()}`
    };
    const updated = [...wholesalers, newWs];
    setWholesalers(updated);
    localStorage.setItem('ellix_wholesalers', JSON.stringify(updated));
    syncManager.syncWholesaler(activeStore.id, newWs);
    addAuditLog('Wholesaler Partner Onboarded', `Added B2B Supplier: ${newWs.name} (${newWs.gstin})`);
    addNotification({
      title: 'Wholesale Partner Registered',
      message: `${newWs.name} onboarded to verified distributor hub.`,
      category: 'system',
      linkModule: 'admin'
    });
    return newWs;
  };

  const updateWholesaler = (id: string, updates: Partial<Wholesaler>) => {
    const updated = wholesalers.map(w => {
      if (w.id === id) {
        const u = { ...w, ...updates };
        syncManager.syncWholesaler(activeStore.id, u);
        return u;
      }
      return w;
    });
    setWholesalers(updated);
    localStorage.setItem('ellix_wholesalers', JSON.stringify(updated));
    addAuditLog('Wholesaler Profile Updated', `Updated supplier ID ${id}`);
  };

  const deleteWholesaler = (id: string) => {
    const updated = wholesalers.filter(w => w.id !== id);
    setWholesalers(updated);
    localStorage.setItem('ellix_wholesalers', JSON.stringify(updated));
    syncManager.deleteWholesaler(activeStore.id, id);
    addAuditLog('Wholesaler Agreement Terminated', `Removed supplier partner ID ${id}`, 'warning');
  };

  // Wholesaler Connections
  const toggleConnectionStatus = (connectionId: string, status: RetailerWholesalerConnection['status']) => {
    setConnections(prev => prev.map(conn => {
      if (conn.id === connectionId) {
        return { ...conn, status };
      }
      return conn;
    }));
    addAuditLog('Connection Permission Changed', `Wholesaler Connection ${connectionId} set to ${status}`);
  };

  // Store Management (Franchise & Multi-Outlet)
  const addStore = (storeData: Omit<Store, 'id' | 'rating' | 'reviewCount'>) => {
    const newStore: Store = {
      ...storeData,
      id: `store-${Date.now()}`,
      rating: 4.8,
      reviewCount: 0
    };
    const updated = [...stores, newStore];
    setStores(updated);
    localStorage.setItem('ellix_stores', JSON.stringify(updated));
    syncManager.syncStore(newStore);
    addAuditLog('Store Outlet Provisioned', `Added new branch: ${newStore.name} (${newStore.city})`);
    addNotification({
      title: 'New Store Branch Registered',
      message: `Successfully provisioned ${newStore.name} under enterprise tenant license.`,
      category: 'system',
      linkModule: 'admin'
    });
  };

  const updateStore = (id: string, updates: Partial<Store>) => {
    const updated = stores.map(st => {
      if (st.id === id) {
        const u = { ...st, ...updates };
        syncManager.syncStore(u);
        return u;
      }
      return st;
    });
    setStores(updated);
    localStorage.setItem('ellix_stores', JSON.stringify(updated));
    if (activeStore.id === id) {
      setActiveStore(prev => ({ ...prev, ...updates }));
    }
    addAuditLog('Store Outlet Updated', `Updated branch details for ID ${id}`);
  };

  const deleteStore = (id: string) => {
    if (stores.length <= 1) return;
    const updated = stores.filter(st => st.id !== id);
    setStores(updated);
    localStorage.setItem('ellix_stores', JSON.stringify(updated));
    if (activeStore.id === id) {
      setActiveStore(updated[0]);
    }
    addAuditLog('Store Outlet Removed', `Decommissioned outlet ID ${id}`);
  };

  // Subscription Plan Updates
  const updateSubscription = (updates: Partial<SubscriptionPlan>) => {
    setSubscription(prev => {
      const next = { ...prev, ...updates };
      localStorage.setItem('ellix_subscription', JSON.stringify(next));
      return next;
    });
    addAuditLog('SaaS Subscription Modified', `Plan updated to ${updates.name || subscription.name}`);
    addNotification({
      title: 'Subscription Tier Updated',
      message: `Platform license updated to ${updates.name || subscription.name}.`,
      category: 'system',
      linkModule: 'admin'
    });
  };

  const clearAuditLogs = () => {
    setAuditLogs([]);
    localStorage.removeItem('ellix_audit_logs');
    addNotification({
      title: 'Audit Logs Archived',
      message: 'System audit logs cleared and archived.',
      category: 'system',
      linkModule: 'admin'
    });
  };

  const resetToDefaultData = () => {
    localStorage.clear();
    setStores(mockStores);
    setActiveStore(mockStores[0]);
    setProducts(mockProducts);
    setWholesalers(mockWholesalers);
    setConnections(mockConnections);
    setCustomers(mockCustomers);
    setInvoices(mockInvoices);
    setRestockOrders(mockRestockOrders);
    setCustomerOrders(mockCustomerOrders);
    setEmployees(mockEmployees);
    setNotifications(mockNotifications);
    setAuditLogs(mockAuditLogs);
    setInvoiceTemplates(mockInvoiceTemplates);
    addAuditLog('Database Reset', 'Restored all collections to default factory fixtures', 'warning');
  };

  const restoreDatabaseFromJSON = (snapshot: any): { success: boolean; message: string } => {
    try {
      if (!snapshot || typeof snapshot !== 'object') {
        return { success: false, message: 'Invalid JSON snapshot payload' };
      }

      if (Array.isArray(snapshot.stores) && snapshot.stores.length > 0) {
        setStores(snapshot.stores);
        setActiveStore(snapshot.stores[0]);
        localStorage.setItem('ellix_stores', JSON.stringify(snapshot.stores));
      }
      if (Array.isArray(snapshot.products)) {
        setProducts(snapshot.products);
        localStorage.setItem('ellix_products', JSON.stringify(snapshot.products));
      }
      if (Array.isArray(snapshot.wholesalers)) {
        setWholesalers(snapshot.wholesalers);
        localStorage.setItem('ellix_wholesalers', JSON.stringify(snapshot.wholesalers));
      }
      if (Array.isArray(snapshot.customers)) {
        setCustomers(snapshot.customers);
        localStorage.setItem('ellix_customers', JSON.stringify(snapshot.customers));
      }
      if (Array.isArray(snapshot.invoices)) {
        setInvoices(snapshot.invoices);
        localStorage.setItem('ellix_invoices', JSON.stringify(snapshot.invoices));
      }
      if (Array.isArray(snapshot.restockOrders)) {
        setRestockOrders(snapshot.restockOrders);
        localStorage.setItem('ellix_restock_orders', JSON.stringify(snapshot.restockOrders));
      }
      if (Array.isArray(snapshot.employees)) {
        setEmployees(snapshot.employees);
        localStorage.setItem('ellix_employees', JSON.stringify(snapshot.employees));
      }
      if (Array.isArray(snapshot.invoiceTemplates)) {
        setInvoiceTemplates(snapshot.invoiceTemplates);
        localStorage.setItem('ellix_invoice_templates', JSON.stringify(snapshot.invoiceTemplates));
      }
      if (Array.isArray(snapshot.auditLogs)) {
        setAuditLogs(snapshot.auditLogs);
        localStorage.setItem('ellix_audit_logs', JSON.stringify(snapshot.auditLogs));
      }

      addAuditLog('Database Restored', 'Restored database snapshot from imported JSON file', 'success');
      addNotification({
        title: 'Database Restored Successfully',
        message: 'System records updated from JSON backup snapshot.',
        category: 'system',
        linkModule: 'admin'
      });

      return { success: true, message: 'Database successfully restored from JSON backup.' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Failed to restore database from snapshot' };
    }
  };

  return (
    <StoreContext.Provider
      value={{
        activeModule,
        setActiveModule,
        activeRole,
        setActiveRole,
        currentUser,
        activeStore,
        setActiveStore,
        stores,
        products,
        wholesalers,
        wholesalerProducts,
        connections,
        customers,
        invoices,
        restockOrders,
        customerOrders,
        employees,
        notifications,
        auditLogs,
        subscription,
        invoiceTemplates,
        unreadCount,
        theme,
        setTheme,
        toggleTheme,
        isSettingsModalOpen,
        setIsSettingsModalOpen,
        isNotificationModalOpen,
        setIsNotificationModalOpen,
        cloudSyncState,
        saveFeedback,
        forceCloudSync,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductSharing,
        createInvoice,
        deleteInvoice,
        addInvoiceTemplate,
        updateInvoiceTemplate,
        deleteInvoiceTemplate,
        setDefaultInvoiceTemplate,
        sendRestockRequest,
        updateRestockOrder,
        acceptQuotationAndGeneratePO,
        createCustomerOrder,
        updateCustomerOrderStatus,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        receiveCreditPayment,
        batchAssignInvoiceTemplate,
        updateCustomerSegment,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        batchUpdateEmployees,
        batchDeleteEmployees,
        addWholesaler,
        updateWholesaler,
        deleteWholesaler,
        addStore,
        updateStore,
        deleteStore,
        updateSubscription,
        clearAuditLogs,
        toggleConnectionStatus,
        markNotificationRead,
        clearAllNotifications,
        addAuditLog,
        resetToDefaultData,
        restoreDatabaseFromJSON
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return ctx;
};
