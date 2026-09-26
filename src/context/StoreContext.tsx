import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ActiveModule,
  UserRole,
  User,
  Store,
  Product,
  Supplier,
  RestockLog,
  BusinessApplication,
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
  mockSuppliers,
  mockRestockLogs,
  mockBusinessApplications,
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
import { doc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { db as firestoreDb } from '../lib/firebase';

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
  suppliers: Supplier[];
  restockLogs: RestockLog[];
  businessApplications: BusinessApplication[];
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
  isDataLoading: boolean;
  setIsDataLoading: React.Dispatch<React.SetStateAction<boolean>>;

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
  addSupplier: (supplier: Omit<Supplier, 'id' | 'createdAt'>) => Supplier;
  updateSupplier: (id: string, updates: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;
  addRestockLog: (log: Omit<RestockLog, 'id' | 'date'>) => void;
  addBusinessApplication: (app: Omit<BusinessApplication, 'id' | 'appliedAt' | 'status'>) => BusinessApplication;
  approveBusinessApplication: (id: string, notes?: string) => void;
  rejectBusinessApplication: (id: string, notes?: string) => void;
  cancelSubscriptionAndDeleteData: (confirmationStoreName: string) => Promise<boolean>;
  paySubscriptionBill: () => void;
  renewSubscription: () => Promise<void>;
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
  const isFirestoreAvailable = Boolean(firestoreDb);
  // Load from local storage or fallback to mock data
  const [activeModule, setActiveModule] = useState<ActiveModule>('retailer');
  const [activeRoleState, setActiveRoleState] = useState<UserRole>('client');

  const [stores, setStores] = useState<Store[]>(() => {
    const saved = localStorage.getItem('ellix_stores');
    return saved ? JSON.parse(saved) : mockStores;
  });
  const [activeStore, setActiveStore] = useState<Store>(stores[0] || mockStores[0]);
  const hydratedStoreIdRef = React.useRef<string>((stores[0] || mockStores[0]).id);

  const loadStoreScopedCache = <T,>(baseKey: string, storeId: string, fallback: T[]): T[] => {
    try {
      const scoped = localStorage.getItem(`${baseKey}_${storeId}`);
      if (scoped) return JSON.parse(scoped);
    } catch {
      // ignore parse error
    }
    return fallback.filter((item: any) => !item?.storeId || item.storeId === storeId);
  };

  const [products, setProducts] = useState<Product[]>(() =>
    loadStoreScopedCache('ellix_products', activeStore.id, mockProducts)
  );

  const [wholesalers, setWholesalers] = useState<Wholesaler[]>(() =>
    loadStoreScopedCache('ellix_wholesalers', activeStore.id, mockWholesalers)
  );
  const [wholesalerProducts] = useState<WholesalerProduct[]>(mockWholesalerProducts);

  const [connections, setConnections] = useState<RetailerWholesalerConnection[]>(() => {
    const saved = localStorage.getItem(`ellix_connections_${activeStore.id}`);
    return saved ? JSON.parse(saved) : mockConnections;
  });

  const [customers, setCustomers] = useState<CustomerProfile[]>(() =>
    loadStoreScopedCache('ellix_customers', activeStore.id, mockCustomers)
  );

  const [invoices, setInvoices] = useState<POSInvoice[]>(() =>
    loadStoreScopedCache('ellix_invoices', activeStore.id, mockInvoices)
  );

  const [restockOrders, setRestockOrders] = useState<RestockOrder[]>(() =>
    loadStoreScopedCache('ellix_restock_orders', activeStore.id, mockRestockOrders)
  );

  const [customerOrders, setCustomerOrders] = useState<CustomerOrder[]>(() =>
    loadStoreScopedCache('ellix_customer_orders', activeStore.id, mockCustomerOrders)
  );

  const [employees, setEmployees] = useState<Employee[]>(() =>
    loadStoreScopedCache('ellix_employees', activeStore.id, mockEmployees)
  );

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem(`ellix_notifications_${activeStore.id}`);
    return saved ? JSON.parse(saved) : mockNotifications;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() =>
    loadStoreScopedCache('ellix_audit_logs', activeStore.id, mockAuditLogs)
  );

  const [invoiceTemplates, setInvoiceTemplates] = useState<InvoiceTemplate[]>(() => {
    const saved = localStorage.getItem(`ellix_invoice_templates_${activeStore.id}`);
    return saved ? JSON.parse(saved) : mockInvoiceTemplates;
  });

  const [suppliers, setSuppliers] = useState<Supplier[]>(() =>
    loadStoreScopedCache('ellix_suppliers', activeStore.id, mockSuppliers)
  );

  const [restockLogs, setRestockLogs] = useState<RestockLog[]>(() =>
    loadStoreScopedCache('ellix_restock_logs', activeStore.id, mockRestockLogs)
  );

  const [businessApplications, setBusinessApplications] = useState<BusinessApplication[]>(() => {
    const saved = localStorage.getItem('ellix_business_applications');
    return saved ? JSON.parse(saved) : mockBusinessApplications;
  });

  const activeClientId = activeStore.clientId || 'client-001';
  const [subscription, setSubscription] = useState<SubscriptionPlan>(() => {
    const saved = localStorage.getItem(`ellix_subscription_${activeClientId}`);
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

  // Data fetching / hydration state for smooth perceived performance & skeleton loaders
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);

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

  // Sync store-scoped state to local storage only when hydratedStoreIdRef matches activeStore.id
  useEffect(() => {
    if (hydratedStoreIdRef.current !== activeStore.id) return;
    localStorage.setItem(`ellix_products_${activeStore.id}`, JSON.stringify(products));
  }, [products, activeStore.id]);

  useEffect(() => {
    if (hydratedStoreIdRef.current !== activeStore.id) return;
    localStorage.setItem(`ellix_connections_${activeStore.id}`, JSON.stringify(connections));
  }, [connections, activeStore.id]);

  useEffect(() => {
    if (hydratedStoreIdRef.current !== activeStore.id) return;
    localStorage.setItem(`ellix_customers_${activeStore.id}`, JSON.stringify(customers));
  }, [customers, activeStore.id]);

  useEffect(() => {
    if (hydratedStoreIdRef.current !== activeStore.id) return;
    localStorage.setItem(`ellix_invoices_${activeStore.id}`, JSON.stringify(invoices));
  }, [invoices, activeStore.id]);

  useEffect(() => {
    if (hydratedStoreIdRef.current !== activeStore.id) return;
    localStorage.setItem(`ellix_restock_orders_${activeStore.id}`, JSON.stringify(restockOrders));
  }, [restockOrders, activeStore.id]);

  useEffect(() => {
    if (hydratedStoreIdRef.current !== activeStore.id) return;
    localStorage.setItem(`ellix_customer_orders_${activeStore.id}`, JSON.stringify(customerOrders));
  }, [customerOrders, activeStore.id]);

  useEffect(() => {
    if (hydratedStoreIdRef.current !== activeStore.id) return;
    localStorage.setItem(`ellix_employees_${activeStore.id}`, JSON.stringify(employees));
  }, [employees, activeStore.id]);

  useEffect(() => {
    if (hydratedStoreIdRef.current !== activeStore.id) return;
    localStorage.setItem(`ellix_notifications_${activeStore.id}`, JSON.stringify(notifications));
  }, [notifications, activeStore.id]);

  useEffect(() => {
    if (hydratedStoreIdRef.current !== activeStore.id) return;
    localStorage.setItem(`ellix_audit_logs_${activeStore.id}`, JSON.stringify(auditLogs));
  }, [auditLogs, activeStore.id]);

  useEffect(() => {
    if (hydratedStoreIdRef.current !== activeStore.id) return;
    localStorage.setItem(`ellix_wholesalers_${activeStore.id}`, JSON.stringify(wholesalers));
  }, [wholesalers, activeStore.id]);

  useEffect(() => {
    if (hydratedStoreIdRef.current !== activeStore.id) return;
    localStorage.setItem(`ellix_invoice_templates_${activeStore.id}`, JSON.stringify(invoiceTemplates));
  }, [invoiceTemplates, activeStore.id]);

  useEffect(() => {
    if (hydratedStoreIdRef.current !== activeStore.id) return;
    localStorage.setItem(`ellix_suppliers_${activeStore.id}`, JSON.stringify(suppliers));
  }, [suppliers, activeStore.id]);

  useEffect(() => {
    if (hydratedStoreIdRef.current !== activeStore.id) return;
    localStorage.setItem(`ellix_restock_logs_${activeStore.id}`, JSON.stringify(restockLogs));
  }, [restockLogs, activeStore.id]);

  useEffect(() => {
    localStorage.setItem('ellix_business_applications', JSON.stringify(businessApplications));
  }, [businessApplications]);

  useEffect(() => {
    localStorage.setItem(`ellix_subscription_${activeClientId}`, JSON.stringify(subscription));
  }, [subscription, activeClientId]);

  const { currentUser: authUser, userProfile } = useAuth();

  // Map userProfile.role to canonical UserRole
  const mapProfileRoleToUserRole = (pRole: string): UserRole => {
    if (pRole === 'super_admin') return 'super_admin';
    if (pRole === 'ellix_admin' || pRole === 'admin') return 'ellix_admin';
    if (pRole === 'crew' || pRole === 'employee' || pRole === 'cashier') return 'crew';
    if (pRole === 'wholesaler' || pRole === 'wholesaler_admin') return 'wholesaler_admin';
    return 'client';
  };

  // Authoritative activeRole: In production or for authenticated non-super-admin users,
  // activeRole is strictly bound to the authenticated user's profile role.
  const activeRole: UserRole = (authUser && userProfile?.role && (!(import.meta as any).env?.DEV || userProfile.role !== 'super_admin'))
    ? mapProfileRoleToUserRole(userProfile.role)
    : activeRoleState;

  const setActiveRole = (requestedRole: UserRole) => {
    // Disallow manual role switching in production or for non-super-admin authenticated users
    if (!(import.meta as any).env?.DEV) {
      if (userProfile?.role) {
        setActiveRoleState(mapProfileRoleToUserRole(userProfile.role));
      }
      return;
    }
    if (authUser && userProfile?.role && userProfile.role !== 'super_admin') {
      setActiveRoleState(mapProfileRoleToUserRole(userProfile.role));
      return;
    }
    setActiveRoleState(requestedRole);
  };

  // Synchronize activeRole with authenticated userProfile role
  useEffect(() => {
    if (userProfile?.role) {
      const pRole = userProfile.role;
      if (pRole === 'super_admin') {
        setActiveRoleState('super_admin');
        setActiveModule('admin');
      } else if (pRole === 'ellix_admin' || pRole === 'admin') {
        setActiveRoleState('ellix_admin');
        setActiveModule('admin');
      } else if (pRole === 'crew' || pRole === 'employee') {
        setActiveRoleState('crew');
        setActiveModule('retailer');
      } else if (pRole === 'client' || (pRole as string) === 'retailer' || (pRole as string) === 'owner') {
        setActiveRoleState('client');
        setActiveModule('retailer');
      } else if ((pRole as string) === 'wholesaler' || (pRole as string) === 'wholesaler_admin') {
        setActiveRoleState('wholesaler_admin');
        setActiveModule('wholesaler');
      }
    }
  }, [userProfile?.role]);

  const currentUser: User = {
    id: authUser?.uid || (activeRole === 'crew' ? 'emp-3' : 'usr-current'),
    firebaseUid: authUser?.uid,
    name: userProfile?.displayName || authUser?.displayName || (
      activeRole === 'super_admin' ? 'Akash Joshi (Super Admin)' :
      activeRole === 'ellix_admin' ? 'Siddharth Admin (Ellix Connect)' :
      activeRole === 'crew' ? 'Rahul Sharma' :
      activeRole === 'wholesaler_admin' ? 'Metro Wholesaler Admin' :
      'Vikram Malhotra'
    ),
    email: userProfile?.email || authUser?.email || (
      activeRole === 'super_admin' ? 'superadmin@ellixconnect.com' :
      activeRole === 'ellix_admin' ? 'admin@ellixconnect.com' :
      activeRole === 'crew' ? 'crew@ellixconnect.com' :
      activeRole === 'wholesaler_admin' ? 'wholesaler@ellixconnect.com' :
      'client@ellixconnect.com'
    ),
    phone: userProfile?.phoneNumber || authUser?.phoneNumber || '+91 98765 43210',
    role: activeRole,
    storeId: activeStore.id,
    clientId: userProfile?.clientId || 'client-001',
    assignedStoreIds: userProfile?.assignedStoreIds || (activeRole === 'crew' ? ['store-1', 'store-2'] : ['store-1', 'store-2', 'store-3']),
    wholesalerId: 'ws-101',
    avatar: authUser?.photoURL || userProfile?.photoURL,
    permissions: activeRole === 'crew' ? ['pos_billing', 'inventory_add_restock'] : ['all'],
    emailVerified: userProfile?.emailVerified || authUser?.emailVerified || false,
    phoneVerified: userProfile?.phoneVerified || Boolean(authUser?.phoneNumber),
    linkedProviders: userProfile?.linkedProviders || authUser?.providerData?.map(p => p.providerId) || [],
    passwordSynchronized: userProfile?.passwordSynchronized || false,
    isRealAuth: Boolean(authUser)
  };

  const unreadCount = notifications.filter(n => {
    if (n.read) return false;
    if (n.targetRole && n.targetRole !== 'all') {
      if (activeRole === 'crew' && n.targetRole !== 'crew') return false;
      if (activeRole === 'client' && (n.targetRole === 'ellix_admin' || n.targetRole === 'super_admin')) return false;
    }
    return true;
  }).length;

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
    // 1. Multi-store state isolation: Hydrate strictly store-scoped local cache for activeStore.id upon store switch
    setIsDataLoading(true);
    setProducts(loadStoreScopedCache('ellix_products', activeStore.id, mockProducts));
    setCustomers(loadStoreScopedCache('ellix_customers', activeStore.id, mockCustomers));
    setInvoices(loadStoreScopedCache('ellix_invoices', activeStore.id, mockInvoices));
    setRestockOrders(loadStoreScopedCache('ellix_restock_orders', activeStore.id, mockRestockOrders));
    setCustomerOrders(loadStoreScopedCache('ellix_customer_orders', activeStore.id, mockCustomerOrders));
    setSuppliers(loadStoreScopedCache('ellix_suppliers', activeStore.id, mockSuppliers));
    setRestockLogs(loadStoreScopedCache('ellix_restock_logs', activeStore.id, mockRestockLogs));
    setEmployees(loadStoreScopedCache('ellix_employees', activeStore.id, mockEmployees));
    setAuditLogs(loadStoreScopedCache('ellix_audit_logs', activeStore.id, mockAuditLogs));
    setWholesalers(loadStoreScopedCache('ellix_wholesalers', activeStore.id, mockWholesalers));
    hydratedStoreIdRef.current = activeStore.id;

    const unsub = syncManager.subscribeToStore(
      activeStore.id,
      {
        onInitialDataLoaded: () => {
          setIsDataLoading(false);
        },
        onProductsUpdate: (cloudProducts) => {
          setProducts(cloudProducts || []);
        },
        onCustomersUpdate: (cloudCustomers) => {
          setCustomers(cloudCustomers || []);
        },
        onInvoicesUpdate: (cloudInvoices) => {
          setInvoices(cloudInvoices || []);
        },
        onRestockOrdersUpdate: (cloudOrders) => {
          setRestockOrders(cloudOrders || []);
        },
        onCustomerOrdersUpdate: (cloudCustomerOrders) => {
          setCustomerOrders(cloudCustomerOrders || []);
        },
        onSuppliersUpdate: (cloudSuppliers) => {
          setSuppliers(cloudSuppliers || []);
        },
        onRestockLogsUpdate: (cloudRestockLogs) => {
          setRestockLogs(cloudRestockLogs || []);
        },
        onAuditLogsUpdate: (cloudLogs) => {
          setAuditLogs(cloudLogs || []);
        },
        onWholesalersUpdate: (cloudWholesalers) => {
          setWholesalers(cloudWholesalers || []);
        },
        onEmployeesUpdate: (cloudEmployees) => {
          setEmployees(cloudEmployees || []);
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
        userUid: userProfile?.uid || currentUser.id,
        userRole: userProfile?.role || currentUser.role
      }
    );

    return () => unsub();
  }, [activeStore.id, userProfile?.uid, userProfile?.role]);

  // Real-Time Client Subscription State Sync (Firestore Authoritative)
  useEffect(() => {
    const clientId = activeStore.clientId || 'client-001';
    if (!isFirestoreAvailable || !firestoreDb) return;

    try {
      const subDocRef = doc(firestoreDb, 'clients', clientId, 'subscription', 'current');
      const unsubSub = onSnapshot(
        subDocRef,
        (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            const now = Date.now();
            let status = data.status || 'active';
            const renewalStr = data.renewalDate || data.renewal_date;

            // Authoritative state transitions: Active, Grace Period, Blocked
            if (renewalStr && status !== 'cancelled') {
              const renewalTime = new Date(renewalStr).getTime();
              const gracePeriodEnd = renewalTime + 7 * 86400000; // 7 days grace period
              if (now > renewalTime) {
                if (now <= gracePeriodEnd) {
                  status = 'grace_period';
                } else {
                  status = 'blocked';
                }
              }
            }

            setSubscription(prev => ({
              ...prev,
              name: data.plan || data.name || prev.name,
              status,
              renewalDate: renewalStr || prev.renewalDate,
              priceMonthly: data.priceMonthly || data.amount || prev.priceMonthly,
              lastPaymentDate: data.lastPaymentDate || prev.lastPaymentDate
            }));
          }
        },
        (err) => console.warn('[StoreContext] Subscription sync warning:', err.message)
      );

      return () => unsubSub();
    } catch (e) {
      console.warn('[StoreContext] Failed to setup subscription sync listener:', e);
    }
  }, [activeStore.clientId, isFirestoreAvailable]);

  const forceCloudSync = async () => {
    setIsDataLoading(true);
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
    } finally {
      setTimeout(() => {
        setIsDataLoading(false);
      }, 350);
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
      invoiceNumber,
      storeId: invoiceData.storeId || activeStore.id,
      clientId: invoiceData.clientId || activeStore.clientId || 'client-001',
      createdBy: currentUser.name,
      createdById: currentUser.id,
      cashierName: currentUser.name,
      cashierId: currentUser.id,
      paymentStatus: 'paid'
    };

    // Deduct inventory stock automatically and check low-stock thresholds
    const updatedProductsList: Product[] = [];
    const lowStockAlerts: { product: Product; newStock: number; isCritical: boolean }[] = [];

    setProducts(prev => prev.map(p => {
      const soldItem = newInvoice.items.find(i => i.productId === p.id);
      if (soldItem) {
        const newStock = Math.max(0, p.stock - soldItem.quantity);
        const updatedProd = { ...p, stock: newStock };
        updatedProductsList.push(updatedProd);

        // Low stock rule: Warning level <= minThreshold; Critical level <= 3 units
        if (newStock <= p.minThreshold) {
          const isCritical = newStock <= 3;
          lowStockAlerts.push({ product: p, newStock, isCritical });
        }
        return updatedProd;
      }
      return p;
    }));

    // Low stock alert: visible to all, but push notification is dispatched to Client / Owner only
    if (lowStockAlerts.length > 0) {
      lowStockAlerts.forEach(alert => {
        addNotification({
          title: alert.isCritical ? `🚨 CRITICAL Low Stock: ${alert.product.name}` : `⚠️ Low Stock Warning: ${alert.product.name}`,
          message: `Stock level dropped to ${alert.newStock} ${alert.product.unit || 'units'} in ${activeStore.name}. Min threshold is ${alert.product.minThreshold}. Please initiate manual restock.`,
          category: 'low_stock',
          linkModule: 'retailer',
          targetRole: 'client' // Client/Owner push alert
        });
      });
    }

    // Update Customer loyalty & total purchases if customer linked
    let updatedCustObj: CustomerProfile | undefined = undefined;
    if (newInvoice.customerPhone) {
      setCustomers(prev => prev.map(c => {
        if (c.phone === newInvoice.customerPhone) {
          const updatedCust = {
            ...c,
            totalPurchases: c.totalPurchases + newInvoice.grandTotal,
            loyaltyPoints: Math.max(0, c.loyaltyPoints - (newInvoice.loyaltyPointsRedeemed || 0) + (newInvoice.loyaltyPointsEarned || 0))
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
      details: `Invoice ${invoiceNumber} created for ${newInvoice.customerName} (₹${newInvoice.grandTotal}) at ${activeStore.name}`,
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
    localStorage.setItem(`ellix_wholesalers_${activeStore.id}`, JSON.stringify(updated));
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
    localStorage.setItem(`ellix_wholesalers_${activeStore.id}`, JSON.stringify(updated));
    addAuditLog('Wholesaler Profile Updated', `Updated supplier ID ${id}`);
  };

  const deleteWholesaler = (id: string) => {
    const updated = wholesalers.filter(w => w.id !== id);
    setWholesalers(updated);
    localStorage.setItem(`ellix_wholesalers_${activeStore.id}`, JSON.stringify(updated));
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

  // Supplier Management
  const addSupplier = (supplierData: Omit<Supplier, 'id' | 'createdAt'>): Supplier => {
    const newSup: Supplier = {
      ...supplierData,
      id: `sup-${Date.now()}`,
      storeId: supplierData.storeId || activeStore.id,
      createdAt: new Date().toISOString().slice(0, 10)
    };
    setSuppliers(prev => [newSup, ...prev]);
    syncManager.syncSupplier(activeStore.id, newSup);
    addAuditLog('Supplier Added', `Added supplier ${newSup.name} for ${activeStore.name}`);
    return newSup;
  };

  const updateSupplier = (id: string, updates: Partial<Supplier>) => {
    setSuppliers(prev => {
      const updatedList = prev.map(s => s.id === id ? { ...s, ...updates } : s);
      const updatedItem = updatedList.find(s => s.id === id);
      if (updatedItem) {
        syncManager.syncSupplier(activeStore.id, updatedItem);
      }
      return updatedList;
    });
    addAuditLog('Supplier Updated', `Updated supplier ID ${id}`);
  };

  const deleteSupplier = (id: string) => {
    setSuppliers(prev => prev.filter(s => s.id !== id));
    syncManager.deleteSupplier(activeStore.id, id);
    addAuditLog('Supplier Deleted', `Deleted supplier ID ${id}`, 'warning');
  };

  // Manual Restock Workflow & Logging
  const addRestockLog = (logData: Omit<RestockLog, 'id' | 'date'>) => {
    const newLog: RestockLog = {
      ...logData,
      id: `rst-log-${Date.now()}`,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      storeId: logData.storeId || activeStore.id,
      crewId: logData.crewId || logData.addedById || '',
      crewName: logData.crewName || logData.addedBy || '',
      quantity: logData.quantity || logData.quantityAdded || 0
    };
    setRestockLogs(prev => [newLog, ...prev]);
    syncManager.syncRestockLog(activeStore.id, newLog);

    // Update product stock by quantityAdded
    setProducts(prev => prev.map(p => {
      if (p.id === logData.productId) {
        const addedQty = logData.quantityAdded || logData.quantity || 0;
        const updated = {
          ...p,
          stock: p.stock + addedQty,
          supplierId: logData.supplierId || p.supplierId,
          supplierName: logData.supplierName || p.supplierName,
          lastRestockedAt: new Date().toISOString(),
          lastRestockedBy: logData.crewName || logData.addedBy,
          lastRestockedQty: addedQty
        };
        syncManager.syncProduct(activeStore.id, updated);
        return updated;
      }
      return p;
    }));

    addAuditLog(
      'Stock Restocked',
      `Restocked +${logData.quantityAdded || logData.quantity} units of ${logData.productName} by ${logData.addedBy || logData.crewName} (Supplier: ${logData.supplierName || 'Direct'})`
    );

    addNotification({
      title: 'Inventory Restocked',
      message: `${logData.quantityAdded || logData.quantity} units added to ${logData.productName}. New total: ${logData.newStock}.`,
      category: 'restock',
      linkModule: 'retailer'
    });
  };

  // Business Applications Workflow
  const addBusinessApplication = (appData: Omit<BusinessApplication, 'id' | 'appliedAt' | 'status'>): BusinessApplication => {
    const newApp: BusinessApplication = {
      ...appData,
      id: `app-${Date.now()}`,
      appliedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'pending_review',
      assignedAdminId: 'admin-01',
      assignedAdminName: 'Siddharth Admin'
    };
    setBusinessApplications(prev => [newApp, ...prev]);
    addAuditLog('New Client Application', `Application submitted by ${newApp.businessName} (${newApp.ownerName})`);
    addNotification({
      title: 'New Client Application',
      message: `${newApp.businessName} has applied for Ellix Connect partnership. Review required.`,
      category: 'system',
      linkModule: 'admin',
      targetRole: 'ellix_admin'
    });
    return newApp;
  };

  const approveBusinessApplication = async (id: string, notes?: string) => {
    const targetApp = businessApplications.find(a => a.id === id);
    if (!targetApp) return;

    // Idempotency: prevent double provisioning
    const existingClientId = targetApp.provisionedClientId;
    const existingStoreId = targetApp.provisionedStoreId;

    const clientId = existingClientId || `client-${id.replace(/[^a-zA-Z0-9]/g, '').slice(0, 8) || Math.random().toString(36).substring(2, 8)}`;
    const storeId = existingStoreId || `store-${id.replace(/[^a-zA-Z0-9]/g, '').slice(0, 8) || Math.random().toString(36).substring(2, 8)}`;
    const renewalDate = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];

    // 1. Provision New Store
    const newStore: Store = {
      id: storeId,
      clientId,
      name: targetApp.businessName,
      ownerName: targetApp.ownerName || 'Business Owner',
      address: targetApp.address || `${targetApp.city || 'Central'}, India`,
      phone: targetApp.phone,
      email: targetApp.email,
      ownerEmail: targetApp.email,
      gstin: targetApp.gstin || '27AAAAA0000A1Z5',
      city: targetApp.city || 'Mumbai',
      ownerUid: targetApp.ownerUid || `user-${clientId}`,
      rating: 5.0,
      reviewCount: 0,
      timings: '9:00 AM - 10:00 PM',
      image: '',
      latitude: 19.0760,
      longitude: 72.8777,
      isOnline: true
    };

    setStores(prev => {
      if (prev.some(s => s.id === storeId)) return prev;
      const updated = [...prev, newStore];
      localStorage.setItem('ellix_stores', JSON.stringify(updated));
      return updated;
    });

    // 2. Update Application Status
    setBusinessApplications(prev => prev.map(app => {
      if (app.id === id) {
        return {
          ...app,
          status: 'approved',
          provisionedClientId: clientId,
          provisionedStoreId: storeId,
          reviewedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
          reviewedBy: currentUser.name,
          notes: notes || app.notes
        };
      }
      return app;
    }));

    // 3. Persist to Firestore if available
    if (isFirestoreAvailable && firestoreDb) {
      try {
        await setDoc(doc(firestoreDb, 'stores', storeId), {
          id: storeId,
          clientId,
          name: newStore.name,
          address: newStore.address,
          phone: newStore.phone,
          gstin: newStore.gstin,
          city: newStore.city,
          ownerUid: newStore.ownerUid,
          ownerEmail: newStore.ownerEmail,
          createdAt: new Date().toISOString()
        }, { merge: true });

        await setDoc(doc(firestoreDb, 'clients', clientId, 'subscription', 'current'), {
          clientId,
          status: 'active',
          plan: 'growth',
          billingPeriod: 'monthly',
          priceMonthly: 1499,
          currency: 'INR',
          startedAt: new Date().toISOString(),
          renewalDate,
          updatedAt: new Date().toISOString()
        }, { merge: true });

        const initialPayId = `pay-setup-${Date.now()}`;
        await setDoc(doc(firestoreDb, 'clients', clientId, 'subscriptionPayments', initialPayId), {
          id: initialPayId,
          clientId,
          amount: 1499,
          currency: 'INR',
          status: 'paid',
          method: 'admin_provisioned',
          date: new Date().toISOString(),
          referenceNumber: `PROV-${storeId.toUpperCase()}`
        }, { merge: true });

        await setDoc(doc(firestoreDb, 'businessApplications', id), {
          status: 'approved',
          provisionedClientId: clientId,
          provisionedStoreId: storeId,
          reviewedAt: new Date().toISOString(),
          reviewedBy: currentUser.name,
          reviewNotes: notes || 'Approved & Provisioned by Admin'
        }, { merge: true });
      } catch (err) {
        console.warn('[StoreContext] Firestore provisioning warning:', err);
      }
    }

    addAuditLog('Client Application Approved & Provisioned', `Provisioned tenant ${clientId} with store ${newStore.name} (${storeId})`);
    addNotification({
      title: 'Client Approved & Store Provisioned',
      message: `Store ${newStore.name} has been provisioned under Client ID ${clientId}. Active subscription initialized.`,
      category: 'system',
      linkModule: 'admin'
    });
  };

  const rejectBusinessApplication = (id: string, notes?: string) => {
    setBusinessApplications(prev => prev.map(app => {
      if (app.id === id) {
        return {
          ...app,
          status: 'rejected',
          reviewedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
          reviewedBy: currentUser.name,
          notes: notes || app.notes
        };
      }
      return app;
    }));
    addAuditLog('Client Application Rejected', `Rejected business application ID ${id}`, 'warning');
  };

  // Subscription Billing: Server-Authoritative Gateway Integration & Secure Purge
  const renewSubscription = async (): Promise<void> => {
    const clientId = activeStore.clientId || 'client-001';
    const storeId = activeStore.id;

    let token = '';
    if (authUser) {
      try {
        token = await authUser.getIdToken();
      } catch (e) {
        console.warn('Could not retrieve user ID token:', e);
      }
    }

    const response = await fetch('/api/subscription/create-checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({
        clientId,
        storeId,
        planId: subscription.name || 'growth',
        billingCycle: 'monthly'
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to initiate checkout with payment gateway');
    }

    if (data.liveGatewayActive && data.orderId) {
      // Razorpay live checkout flow
      return new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
          const options = {
            key: data.keyId,
            amount: data.amount,
            currency: data.currency || 'INR',
            name: 'Ellix Connect Retail OS',
            description: `Subscription Renewal - ${activeStore.name}`,
            order_id: data.orderId,
            handler: async function (razorpayResponse: any) {
              try {
                const verifyRes = await fetch('/api/subscription/verify-payment', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                  },
                  body: JSON.stringify({
                    razorpay_order_id: razorpayResponse.razorpay_order_id,
                    razorpay_payment_id: razorpayResponse.razorpay_payment_id,
                    razorpay_signature: razorpayResponse.razorpay_signature,
                    clientId
                  })
                });
                const verifyData = await verifyRes.json();
                if (!verifyRes.ok) {
                  throw new Error(verifyData.error || 'Payment signature verification failed');
                }
                addNotification({
                  title: 'Subscription Renewed',
                  message: `Payment ${razorpayResponse.razorpay_payment_id} verified. Access extended until ${verifyData.renewalDate}.`,
                  category: 'payment',
                  targetRole: 'client'
                });
                resolve();
              } catch (err) {
                reject(err);
              }
            },
            modal: {
              ondismiss: function () {
                reject(new Error('Checkout window closed without completing payment.'));
              }
            },
            prefill: {
              name: currentUser.name,
              email: currentUser.email,
              contact: currentUser.phone || ''
            },
            theme: {
              color: '#10B981'
            }
          };
          const rzp = new (window as any).Razorpay(options);
          rzp.open();
        };
        script.onerror = () => reject(new Error('Failed to load Razorpay payment SDK'));
        document.body.appendChild(script);
      });
    } else {
      // Explicitly reject self-asserted renewal when gateway is not active
      const notActiveMsg = 'LIVE PAYMENT GATEWAY: NOT ACTIVE — CREDENTIALS NOT CONFIGURED';
      addNotification({
        title: 'Payment Gateway Inactive',
        message: `${notActiveMsg}. Browser cannot self-declare payment renewal.`,
        category: 'payment',
        targetRole: 'client'
      });
      throw new Error(notActiveMsg);
    }
  };

  const paySubscriptionBill = () => {
    renewSubscription().catch(err => {
      console.warn('Subscription payment bill notice:', err.message);
    });
  };

  const cancelSubscriptionAndDeleteData = async (confirmationStoreName: string): Promise<boolean> => {
    if (confirmationStoreName.trim().toLowerCase() !== activeStore.name.trim().toLowerCase() && confirmationStoreName.trim() !== 'DELETE') {
      return false;
    }

    const clientId = activeStore.clientId || 'client-001';
    const storeId = activeStore.id;

    let token = '';
    if (authUser) {
      try {
        token = await authUser.getIdToken();
      } catch (e) {
        console.warn('Could not retrieve user ID token:', e);
      }
    }

    // Call trusted server-side tenant purge endpoint
    try {
      const response = await fetch('/api/admin/tenant/purge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          clientId,
          confirmName: confirmationStoreName
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Server tenant purge failed:', errorData);
        return false;
      }
    } catch (err) {
      console.error('Error connecting to tenant purge API:', err);
      return false;
    }

    // Only clear client state AFTER verified server purge
    const remainingStores = stores.filter(s => s.id !== storeId);
    setStores(remainingStores.length > 0 ? remainingStores : mockStores);
    if (remainingStores.length > 0) {
      setActiveStore(remainingStores[0]);
    }
    setProducts([]);
    setInvoices([]);
    setCustomers([]);
    setRestockLogs([]);
    setRestockOrders([]);
    setSubscription(prev => ({ ...prev, status: 'cancelled' }));

    localStorage.removeItem(`ellix_products_${storeId}`);
    localStorage.removeItem(`ellix_invoices_${storeId}`);
    localStorage.removeItem(`ellix_customers_${storeId}`);
    localStorage.removeItem(`ellix_suppliers_${storeId}`);
    localStorage.removeItem(`ellix_restock_orders_${storeId}`);
    localStorage.removeItem(`ellix_restock_logs_${storeId}`);
    localStorage.removeItem(`ellix_employees_${storeId}`);
    localStorage.removeItem(`ellix_audit_logs_${storeId}`);
    localStorage.removeItem(`ellix_wholesalers_${storeId}`);

    addAuditLog('Subscription Cancelled & Tenant Purged', `Server purged tenant store collections and marked subscription cancelled for ${activeStore.name}`, 'warning');
    return true;
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
      localStorage.setItem(`ellix_subscription_${activeClientId}`, JSON.stringify(next));
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
    localStorage.removeItem(`ellix_audit_logs_${activeStore.id}`);
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

      const targetStoreId = (Array.isArray(snapshot.stores) && snapshot.stores[0]?.id) || activeStore.id;

      if (Array.isArray(snapshot.stores) && snapshot.stores.length > 0) {
        setStores(snapshot.stores);
        setActiveStore(snapshot.stores[0]);
        localStorage.setItem('ellix_stores', JSON.stringify(snapshot.stores));
      }
      if (Array.isArray(snapshot.products)) {
        setProducts(snapshot.products);
        localStorage.setItem(`ellix_products_${targetStoreId}`, JSON.stringify(snapshot.products));
      }
      if (Array.isArray(snapshot.wholesalers)) {
        setWholesalers(snapshot.wholesalers);
        localStorage.setItem(`ellix_wholesalers_${targetStoreId}`, JSON.stringify(snapshot.wholesalers));
      }
      if (Array.isArray(snapshot.customers)) {
        setCustomers(snapshot.customers);
        localStorage.setItem(`ellix_customers_${targetStoreId}`, JSON.stringify(snapshot.customers));
      }
      if (Array.isArray(snapshot.invoices)) {
        setInvoices(snapshot.invoices);
        localStorage.setItem(`ellix_invoices_${targetStoreId}`, JSON.stringify(snapshot.invoices));
      }
      if (Array.isArray(snapshot.restockOrders)) {
        setRestockOrders(snapshot.restockOrders);
        localStorage.setItem(`ellix_restock_orders_${targetStoreId}`, JSON.stringify(snapshot.restockOrders));
      }
      if (Array.isArray(snapshot.employees)) {
        setEmployees(snapshot.employees);
        localStorage.setItem(`ellix_employees_${targetStoreId}`, JSON.stringify(snapshot.employees));
      }
      if (Array.isArray(snapshot.invoiceTemplates)) {
        setInvoiceTemplates(snapshot.invoiceTemplates);
        localStorage.setItem(`ellix_invoice_templates_${targetStoreId}`, JSON.stringify(snapshot.invoiceTemplates));
      }
      if (Array.isArray(snapshot.auditLogs)) {
        setAuditLogs(snapshot.auditLogs);
        localStorage.setItem(`ellix_audit_logs_${targetStoreId}`, JSON.stringify(snapshot.auditLogs));
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
        suppliers,
        restockLogs,
        businessApplications,
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
        isDataLoading,
        setIsDataLoading,
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
        addSupplier,
        updateSupplier,
        deleteSupplier,
        addRestockLog,
        addBusinessApplication,
        approveBusinessApplication,
        rejectBusinessApplication,
        cancelSubscriptionAndDeleteData,
        paySubscriptionBill,
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
