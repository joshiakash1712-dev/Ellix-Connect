import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  writeBatch,
  Unsubscribe
} from 'firebase/firestore';
import { db } from './firebase';
import {
  Product,
  CustomerProfile,
  POSInvoice,
  RestockOrder,
  CustomerOrder,
  AuditLog,
  Wholesaler,
  Employee,
  Store,
  OfflineSyncItem,
  CloudSyncState,
  SaveFeedback
} from '../types';
import firebaseConfig from '../../firebase-applet-config.json';

const OFFLINE_QUEUE_KEY = 'ellix_offline_sync_queue';

export function getOfflineQueue(): OfflineSyncItem[] {
  try {
    const raw = localStorage.getItem(OFFLINE_QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to read offline sync queue:', e);
    return [];
  }
}

export function saveOfflineQueue(queue: OfflineSyncItem[]): void {
  try {
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
  } catch (e) {
    console.error('Failed to save offline sync queue:', e);
  }
}

export function queueOfflineAction(item: Omit<OfflineSyncItem, 'id' | 'timestamp'>): void {
  const queue = getOfflineQueue();
  queue.push({
    ...item,
    id: `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    timestamp: new Date().toISOString()
  });
  saveOfflineQueue(queue);
}

// Data Sanitization helpers to prevent undefined fields in Firestore
function sanitizeData<T extends Record<string, any>>(data: T): Record<string, any> {
  const sanitized: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      if (typeof value === 'number') {
        sanitized[key] = isNaN(value) ? 0 : value;
      } else if (value && typeof value === 'object' && !Array.isArray(value)) {
        sanitized[key] = sanitizeData(value);
      } else {
        sanitized[key] = value;
      }
    }
  }
  return sanitized;
}

// --------------------------------------------------------------------------
// Real-Time Store Sync Service
// --------------------------------------------------------------------------

export interface StoreSyncListeners {
  onProductsUpdate?: (products: Product[]) => void;
  onCustomersUpdate?: (customers: CustomerProfile[]) => void;
  onInvoicesUpdate?: (invoices: POSInvoice[]) => void;
  onRestockOrdersUpdate?: (orders: RestockOrder[]) => void;
  onCustomerOrdersUpdate?: (orders: CustomerOrder[]) => void;
  onAuditLogsUpdate?: (logs: AuditLog[]) => void;
  onWholesalersUpdate?: (wholesalers: Wholesaler[]) => void;
  onEmployeesUpdate?: (employees: Employee[]) => void;
  onSyncStateChange?: (state: Partial<CloudSyncState>) => void;
  onSaveFeedback?: (feedback: SaveFeedback) => void;
}

export class FirestoreSyncManager {
  private activeStoreId: string = 'store_main_1';
  private unsubs: Unsubscribe[] = [];
  private isOnline: boolean = navigator.onLine;
  private currentListeners: StoreSyncListeners | null = null;
  private feedbackTimer: any = null;

  constructor() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.notifyFeedback('saved', 'Connection restored. Synchronized with cloud.');
      this.flushQueue();
    });
    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.notifyFeedback('error', 'Offline mode. Changes queued locally.');
    });
  }

  public getDatabaseId(): string {
    return (firebaseConfig as { firestoreDatabaseId?: string }).firestoreDatabaseId || 'default';
  }

  public notifyFeedback(status: SaveFeedback['status'], message: string): void {
    if (!this.currentListeners?.onSaveFeedback) return;
    this.currentListeners.onSaveFeedback({
      status,
      message,
      timestamp: Date.now()
    });

    if (this.feedbackTimer) {
      clearTimeout(this.feedbackTimer);
      this.feedbackTimer = null;
    }

    if (status === 'saved') {
      this.feedbackTimer = setTimeout(() => {
        this.currentListeners?.onSaveFeedback?.({
          status: 'idle',
          message: '',
          timestamp: Date.now()
        });
      }, 1200);
    } else if (status === 'error') {
      this.feedbackTimer = setTimeout(() => {
        this.currentListeners?.onSaveFeedback?.({
          status: 'idle',
          message: '',
          timestamp: Date.now()
        });
      }, 3500);
    }
  }

  // Subscribe to all subcollections for the active store
  public subscribeToStore(
    storeId: string,
    callbacks: StoreSyncListeners,
    initialFallbacks?: {
      products?: Product[];
      customers?: CustomerProfile[];
      invoices?: POSInvoice[];
      restockOrders?: RestockOrder[];
      customerOrders?: CustomerOrder[];
      auditLogs?: AuditLog[];
      wholesalers?: Wholesaler[];
      employees?: Employee[];
    }
  ): () => void {
    this.unsubscribeAll();
    this.activeStoreId = storeId;
    this.currentListeners = callbacks;

    callbacks.onSyncStateChange?.({
      status: 'syncing',
      databaseId: this.getDatabaseId(),
      pendingCount: getOfflineQueue().length
    });

    const counts = {
      products: 0,
      customers: 0,
      invoices: 0,
      restockOrders: 0,
      customerOrders: 0,
      wholesalers: 0,
      employees: 0
    };

    const notifySynced = () => {
      callbacks.onSyncStateChange?.({
        status: 'synced',
        lastSyncedAt: new Date().toISOString(),
        lastError: null,
        syncedCounts: { ...counts }
      });
    };

    try {
      // 1. Products Collection (Real-Time Live Listener)
      const productsRef = collection(db, 'stores', storeId, 'products');
      const unsubProducts = onSnapshot(
        productsRef,
        (snapshot) => {
          counts.products = snapshot.size;
          if (snapshot.empty && initialFallbacks?.products && initialFallbacks.products.length > 0) {
            this.seedProducts(storeId, initialFallbacks.products);
          } else {
            const list = snapshot.docs.map(doc => doc.data() as Product);
            callbacks.onProductsUpdate?.(list);
          }
          notifySynced();
        },
        (error) => {
          console.warn('[FirestoreSync] Products snapshot warning:', error.message);
          callbacks.onSyncStateChange?.({
            status: 'offline',
            lastError: error.message
          });
        }
      );
      this.unsubs.push(unsubProducts);

      // 2. Customers Collection (Real-Time Live Listener)
      const customersRef = collection(db, 'stores', storeId, 'customers');
      const unsubCustomers = onSnapshot(
        customersRef,
        (snapshot) => {
          counts.customers = snapshot.size;
          if (snapshot.empty && initialFallbacks?.customers && initialFallbacks.customers.length > 0) {
            this.seedCustomers(storeId, initialFallbacks.customers);
          } else {
            const list = snapshot.docs.map(doc => doc.data() as CustomerProfile);
            callbacks.onCustomersUpdate?.(list);
          }
          notifySynced();
        },
        (error) => console.warn('[FirestoreSync] Customers snapshot warning:', error.message)
      );
      this.unsubs.push(unsubCustomers);

      // 3. Invoices Collection (Real-Time Live Listener)
      const invoicesRef = collection(db, 'stores', storeId, 'invoices');
      const unsubInvoices = onSnapshot(
        invoicesRef,
        (snapshot) => {
          counts.invoices = snapshot.size;
          if (snapshot.empty && initialFallbacks?.invoices && initialFallbacks.invoices.length > 0) {
            this.seedInvoices(storeId, initialFallbacks.invoices);
          } else {
            const list = snapshot.docs.map(doc => doc.data() as POSInvoice);
            callbacks.onInvoicesUpdate?.(list);
          }
          notifySynced();
        },
        (error) => console.warn('[FirestoreSync] Invoices snapshot warning:', error.message)
      );
      this.unsubs.push(unsubInvoices);

      // 4. Restock Orders Collection (Real-Time Live Listener)
      const restockRef = collection(db, 'stores', storeId, 'restockOrders');
      const unsubRestock = onSnapshot(
        restockRef,
        (snapshot) => {
          counts.restockOrders = snapshot.size;
          if (snapshot.empty && initialFallbacks?.restockOrders && initialFallbacks.restockOrders.length > 0) {
            this.seedRestockOrders(storeId, initialFallbacks.restockOrders);
          } else {
            const list = snapshot.docs.map(doc => doc.data() as RestockOrder);
            callbacks.onRestockOrdersUpdate?.(list);
          }
          notifySynced();
        },
        (error) => console.warn('[FirestoreSync] Restock orders snapshot warning:', error.message)
      );
      this.unsubs.push(unsubRestock);

      // 5. Customer Orders Collection (Real-Time Live Listener)
      const customerOrdersRef = collection(db, 'stores', storeId, 'customerOrders');
      const unsubCustomerOrders = onSnapshot(
        customerOrdersRef,
        (snapshot) => {
          counts.customerOrders = snapshot.size;
          if (snapshot.empty && initialFallbacks?.customerOrders && initialFallbacks.customerOrders.length > 0) {
            this.seedCustomerOrders(storeId, initialFallbacks.customerOrders);
          } else {
            const list = snapshot.docs.map(doc => doc.data() as CustomerOrder);
            callbacks.onCustomerOrdersUpdate?.(list);
          }
          notifySynced();
        },
        (error) => console.warn('[FirestoreSync] Customer orders snapshot warning:', error.message)
      );
      this.unsubs.push(unsubCustomerOrders);

      // 6. Audit Logs Collection (Real-Time Live Listener)
      const auditRef = collection(db, 'stores', storeId, 'auditLogs');
      const unsubAudit = onSnapshot(
        auditRef,
        (snapshot) => {
          if (snapshot.empty && initialFallbacks?.auditLogs && initialFallbacks.auditLogs.length > 0) {
            this.seedAuditLogs(storeId, initialFallbacks.auditLogs);
          } else {
            const list = snapshot.docs.map(doc => doc.data() as AuditLog);
            callbacks.onAuditLogsUpdate?.(list);
          }
        },
        (error) => console.warn('[FirestoreSync] Audit logs snapshot warning:', error.message)
      );
      this.unsubs.push(unsubAudit);

      // 7. Wholesalers Collection (Real-Time Live Listener)
      const wholesalersRef = collection(db, 'stores', storeId, 'wholesalers');
      const unsubWholesalers = onSnapshot(
        wholesalersRef,
        (snapshot) => {
          counts.wholesalers = snapshot.size;
          if (snapshot.empty && initialFallbacks?.wholesalers && initialFallbacks.wholesalers.length > 0) {
            this.seedWholesalers(storeId, initialFallbacks.wholesalers);
          } else {
            const list = snapshot.docs.map(doc => doc.data() as Wholesaler);
            callbacks.onWholesalersUpdate?.(list);
          }
          notifySynced();
        },
        (error) => console.warn('[FirestoreSync] Wholesalers snapshot warning:', error.message)
      );
      this.unsubs.push(unsubWholesalers);

      // 8. Employees Collection (Real-Time Live Listener)
      const employeesRef = collection(db, 'stores', storeId, 'employees');
      const unsubEmployees = onSnapshot(
        employeesRef,
        (snapshot) => {
          counts.employees = snapshot.size;
          if (snapshot.empty && initialFallbacks?.employees && initialFallbacks.employees.length > 0) {
            this.seedEmployees(storeId, initialFallbacks.employees);
          } else {
            const list = snapshot.docs.map(doc => doc.data() as Employee);
            callbacks.onEmployeesUpdate?.(list);
          }
          notifySynced();
        },
        (error) => console.warn('[FirestoreSync] Employees snapshot warning:', error.message)
      );
      this.unsubs.push(unsubEmployees);

      // Flush any queued offline modifications
      this.flushQueue();

    } catch (err: any) {
      console.warn('[FirestoreSync] Subscription catch:', err.message);
      callbacks.onSyncStateChange?.({
        status: 'offline',
        lastError: err.message
      });
    }

    return () => this.unsubscribeAll();
  }

  public unsubscribeAll(): void {
    this.unsubs.forEach(unsub => {
      try {
        unsub();
      } catch {}
    });
    this.unsubs = [];
    this.currentListeners = null;
  }

  // --------------------------------------------------------------------------
  // Seeders (Populates remote collection if empty so initial data is active)
  // --------------------------------------------------------------------------
  public async seedProducts(storeId: string, items: Product[]): Promise<void> {
    try {
      const batch = writeBatch(db);
      for (const item of items) {
        const ref = doc(db, 'stores', storeId, 'products', item.id);
        batch.set(ref, sanitizeData({ ...item, storeId }), { merge: true });
      }
      await batch.commit();
      console.log(`[FirestoreSync] Seeded ${items.length} products to store ${storeId}`);
    } catch (e) {
      console.warn('[FirestoreSync] Seeding products failed or postponed:', e);
    }
  }

  public async seedCustomers(storeId: string, items: CustomerProfile[]): Promise<void> {
    try {
      const batch = writeBatch(db);
      for (const item of items) {
        const ref = doc(db, 'stores', storeId, 'customers', item.id);
        batch.set(ref, sanitizeData({ ...item, storeId }), { merge: true });
      }
      await batch.commit();
    } catch (e) {
      console.warn('[FirestoreSync] Seeding customers postponed:', e);
    }
  }

  public async seedInvoices(storeId: string, items: POSInvoice[]): Promise<void> {
    try {
      const batch = writeBatch(db);
      for (const item of items) {
        const ref = doc(db, 'stores', storeId, 'invoices', item.id);
        batch.set(ref, sanitizeData({ ...item, totalAmount: item.grandTotal, storeId }), { merge: true });
      }
      await batch.commit();
    } catch (e) {
      console.warn('[FirestoreSync] Seeding invoices postponed:', e);
    }
  }

  public async seedRestockOrders(storeId: string, items: RestockOrder[]): Promise<void> {
    try {
      const batch = writeBatch(db);
      for (const item of items) {
        const ref = doc(db, 'stores', storeId, 'restockOrders', item.id);
        batch.set(ref, sanitizeData({
          ...item,
          orderNumber: item.id,
          quantity: item.suggestedQty || item.quotedQty || 1,
          storeId
        }), { merge: true });
      }
      await batch.commit();
    } catch (e) {
      console.warn('[FirestoreSync] Seeding restock orders postponed:', e);
    }
  }

  public async seedCustomerOrders(storeId: string, items: CustomerOrder[]): Promise<void> {
    try {
      const batch = writeBatch(db);
      for (const item of items) {
        const ref = doc(db, 'stores', storeId, 'customerOrders', item.id);
        batch.set(ref, sanitizeData({ ...item, storeId }), { merge: true });
      }
      await batch.commit();
    } catch (e) {
      console.warn('[FirestoreSync] Seeding customer orders postponed:', e);
    }
  }

  public async seedAuditLogs(storeId: string, items: AuditLog[]): Promise<void> {
    try {
      const batch = writeBatch(db);
      for (const item of items) {
        const ref = doc(db, 'stores', storeId, 'auditLogs', item.id);
        batch.set(ref, sanitizeData({ ...item, storeId }), { merge: true });
      }
      await batch.commit();
    } catch (e) {
      console.warn('[FirestoreSync] Seeding audit logs postponed:', e);
    }
  }

  public async seedWholesalers(storeId: string, items: Wholesaler[]): Promise<void> {
    try {
      const batch = writeBatch(db);
      for (const item of items) {
        const ref = doc(db, 'stores', storeId, 'wholesalers', item.id);
        batch.set(ref, sanitizeData({ ...item, storeId }), { merge: true });
      }
      await batch.commit();
    } catch (e) {
      console.warn('[FirestoreSync] Seeding wholesalers postponed:', e);
    }
  }

  public async seedEmployees(storeId: string, items: Employee[]): Promise<void> {
    try {
      const batch = writeBatch(db);
      for (const item of items) {
        const ref = doc(db, 'stores', storeId, 'employees', item.id);
        batch.set(ref, sanitizeData({ ...item, storeId }), { merge: true });
      }
      await batch.commit();
    } catch (e) {
      console.warn('[FirestoreSync] Seeding employees postponed:', e);
    }
  }

  // --------------------------------------------------------------------------
  // Document Level Mutators (Saves directly to Firestore with Offline Fallback)
  // --------------------------------------------------------------------------

  // Product mutations
  public async syncProduct(storeId: string, product: Product): Promise<void> {
    this.notifyFeedback('saving', 'Saving product changes...');
    const sanitized = sanitizeData({ ...product, storeId, updatedAt: new Date().toISOString() });
    try {
      const docRef = doc(db, 'stores', storeId, 'products', product.id);
      await setDoc(docRef, sanitized, { merge: true });
      this.notifyFeedback('saved', 'Product saved');
    } catch (err) {
      console.warn('[FirestoreSync] Network write failed, queuing product offline:', err);
      queueOfflineAction({
        collection: 'products',
        action: 'update',
        docId: product.id,
        data: sanitized
      });
      this.notifyFeedback('error', 'Saved offline. Will sync when connected.');
    }
  }

  public async deleteProduct(storeId: string, productId: string): Promise<void> {
    this.notifyFeedback('saving', 'Removing product...');
    try {
      const docRef = doc(db, 'stores', storeId, 'products', productId);
      await deleteDoc(docRef);
      this.notifyFeedback('saved', 'Product removed');
    } catch (err) {
      queueOfflineAction({
        collection: 'products',
        action: 'delete',
        docId: productId
      });
      this.notifyFeedback('error', 'Removed locally. Will sync when connected.');
    }
  }

  // Customer mutations
  public async syncCustomer(storeId: string, customer: CustomerProfile): Promise<void> {
    this.notifyFeedback('saving', 'Saving customer details...');
    const sanitized = sanitizeData({ ...customer, storeId, updatedAt: new Date().toISOString() });
    try {
      const docRef = doc(db, 'stores', storeId, 'customers', customer.id);
      await setDoc(docRef, sanitized, { merge: true });
      this.notifyFeedback('saved', 'Customer details saved');
    } catch (err) {
      queueOfflineAction({
        collection: 'customers',
        action: 'update',
        docId: customer.id,
        data: sanitized
      });
      this.notifyFeedback('error', 'Saved offline. Will sync when connected.');
    }
  }

  public async deleteCustomer(storeId: string, customerId: string): Promise<void> {
    this.notifyFeedback('saving', 'Removing customer...');
    try {
      const docRef = doc(db, 'stores', storeId, 'customers', customerId);
      await deleteDoc(docRef);
      this.notifyFeedback('saved', 'Customer removed');
    } catch (err) {
      queueOfflineAction({
        collection: 'customers',
        action: 'delete',
        docId: customerId
      });
      this.notifyFeedback('error', 'Removed locally. Will sync when connected.');
    }
  }

  // POS Invoice & Transactional atomic sales
  public async syncInvoice(storeId: string, invoice: POSInvoice): Promise<void> {
    this.notifyFeedback('saving', 'Recording invoice...');
    const sanitized = sanitizeData({
      ...invoice,
      totalAmount: invoice.grandTotal,
      storeId,
      updatedAt: new Date().toISOString()
    });
    try {
      const docRef = doc(db, 'stores', storeId, 'invoices', invoice.id);
      await setDoc(docRef, sanitized, { merge: true });
      this.notifyFeedback('saved', 'Invoice saved');
    } catch (err) {
      queueOfflineAction({
        collection: 'invoices',
        action: 'create',
        docId: invoice.id,
        data: sanitized
      });
      this.notifyFeedback('error', 'Saved offline. Will sync when connected.');
    }
  }

  public async deleteInvoice(storeId: string, invoiceId: string): Promise<void> {
    this.notifyFeedback('saving', 'Deleting invoice...');
    try {
      const docRef = doc(db, 'stores', storeId, 'invoices', invoiceId);
      await deleteDoc(docRef);
      this.notifyFeedback('saved', 'Invoice deleted');
    } catch (err) {
      queueOfflineAction({
        collection: 'invoices',
        action: 'delete',
        docId: invoiceId
      });
      this.notifyFeedback('error', 'Deleted locally. Will sync when connected.');
    }
  }

  // Atomic POS checkout write: updates invoice, product stocks, customer loyalty, and audit log together
  public async syncPOSSaleAtomic(
    storeId: string,
    invoice: POSInvoice,
    updatedProducts: Product[],
    updatedCustomer?: CustomerProfile,
    auditLog?: AuditLog
  ): Promise<void> {
    this.notifyFeedback('saving', 'Processing transaction...');
    try {
      const batch = writeBatch(db);

      // 1. Invoice
      const invRef = doc(db, 'stores', storeId, 'invoices', invoice.id);
      batch.set(invRef, sanitizeData({
        ...invoice,
        totalAmount: invoice.grandTotal,
        storeId,
        updatedAt: new Date().toISOString()
      }), { merge: true });

      // 2. Affected products stock deduction
      for (const p of updatedProducts) {
        const pRef = doc(db, 'stores', storeId, 'products', p.id);
        batch.set(pRef, sanitizeData({ ...p, storeId, updatedAt: new Date().toISOString() }), { merge: true });
      }

      // 3. Customer profile if linked
      if (updatedCustomer) {
        const cRef = doc(db, 'stores', storeId, 'customers', updatedCustomer.id);
        batch.set(cRef, sanitizeData({ ...updatedCustomer, storeId, updatedAt: new Date().toISOString() }), { merge: true });
      }

      // 4. Audit Log
      if (auditLog) {
        const lRef = doc(db, 'stores', storeId, 'auditLogs', auditLog.id);
        batch.set(lRef, sanitizeData({ ...auditLog, storeId }), { merge: true });
      }

      await batch.commit();
      this.notifyFeedback('saved', 'Transaction saved');
    } catch (err) {
      console.warn('[FirestoreSync] POS sale atomic write failed, queuing items offline:', err);
      // Fallback: queue individual operations into offline queue
      queueOfflineAction({
        collection: 'invoices',
        action: 'create',
        docId: invoice.id,
        data: sanitizeData({ ...invoice, totalAmount: invoice.grandTotal, storeId, updatedAt: new Date().toISOString() })
      });
      for (const p of updatedProducts) {
        queueOfflineAction({
          collection: 'products',
          action: 'update',
          docId: p.id,
          data: sanitizeData({ ...p, storeId, updatedAt: new Date().toISOString() })
        });
      }
      if (updatedCustomer) {
        queueOfflineAction({
          collection: 'customers',
          action: 'update',
          docId: updatedCustomer.id,
          data: sanitizeData({ ...updatedCustomer, storeId, updatedAt: new Date().toISOString() })
        });
      }
      this.notifyFeedback('error', 'Transaction saved offline. Will sync when connected.');
    }
  }

  // Restock orders
  public async syncRestockOrder(storeId: string, order: RestockOrder): Promise<void> {
    this.notifyFeedback('saving', 'Saving restock order...');
    const sanitized = sanitizeData({
      ...order,
      orderNumber: order.id,
      quantity: order.suggestedQty || order.quotedQty || 1,
      storeId,
      updatedAt: new Date().toISOString()
    });
    try {
      const docRef = doc(db, 'stores', storeId, 'restockOrders', order.id);
      await setDoc(docRef, sanitized, { merge: true });
      this.notifyFeedback('saved', 'Restock order saved');
    } catch (err) {
      queueOfflineAction({
        collection: 'restockOrders',
        action: 'update',
        docId: order.id,
        data: sanitized
      });
      this.notifyFeedback('error', 'Saved offline. Will sync when connected.');
    }
  }

  // Customer orders
  public async syncCustomerOrder(storeId: string, order: CustomerOrder): Promise<void> {
    this.notifyFeedback('saving', 'Saving order status...');
    const sanitized = sanitizeData({ ...order, storeId, updatedAt: new Date().toISOString() });
    try {
      const docRef = doc(db, 'stores', storeId, 'customerOrders', order.id);
      await setDoc(docRef, sanitized, { merge: true });
      this.notifyFeedback('saved', 'Order updated');
    } catch (err) {
      queueOfflineAction({
        collection: 'customerOrders',
        action: 'update',
        docId: order.id,
        data: sanitized
      });
      this.notifyFeedback('error', 'Saved offline. Will sync when connected.');
    }
  }

  // Audit logs
  public async syncAuditLog(storeId: string, log: AuditLog): Promise<void> {
    const sanitized = sanitizeData({ ...log, storeId });
    try {
      const docRef = doc(db, 'stores', storeId, 'auditLogs', log.id);
      await setDoc(docRef, sanitized, { merge: true });
    } catch (err) {
      queueOfflineAction({
        collection: 'auditLogs',
        action: 'create',
        docId: log.id,
        data: sanitized
      });
    }
  }

  // Wholesalers / Suppliers
  public async syncWholesaler(storeId: string, wholesaler: Wholesaler): Promise<void> {
    this.notifyFeedback('saving', 'Saving supplier details...');
    const sanitized = sanitizeData({ ...wholesaler, storeId, updatedAt: new Date().toISOString() });
    try {
      const docRef = doc(db, 'stores', storeId, 'wholesalers', wholesaler.id);
      await setDoc(docRef, sanitized, { merge: true });
      this.notifyFeedback('saved', 'Supplier saved');
    } catch (err) {
      queueOfflineAction({
        collection: 'wholesalers',
        action: 'update',
        docId: wholesaler.id,
        data: sanitized
      });
      this.notifyFeedback('error', 'Saved offline. Will sync when connected.');
    }
  }

  public async deleteWholesaler(storeId: string, wholesalerId: string): Promise<void> {
    this.notifyFeedback('saving', 'Removing supplier...');
    try {
      const docRef = doc(db, 'stores', storeId, 'wholesalers', wholesalerId);
      await deleteDoc(docRef);
      this.notifyFeedback('saved', 'Supplier removed');
    } catch (err) {
      queueOfflineAction({
        collection: 'wholesalers',
        action: 'delete',
        docId: wholesalerId
      });
      this.notifyFeedback('error', 'Removed locally. Will sync when connected.');
    }
  }

  // Employees
  public async syncEmployee(storeId: string, employee: Employee): Promise<void> {
    this.notifyFeedback('saving', 'Saving staff member...');
    const sanitized = sanitizeData({ ...employee, storeId, updatedAt: new Date().toISOString() });
    try {
      const docRef = doc(db, 'stores', storeId, 'employees', employee.id);
      await setDoc(docRef, sanitized, { merge: true });
      this.notifyFeedback('saved', 'Staff updated');
    } catch (err) {
      queueOfflineAction({
        collection: 'employees',
        action: 'update',
        docId: employee.id,
        data: sanitized
      });
      this.notifyFeedback('error', 'Saved offline. Will sync when connected.');
    }
  }

  public async deleteEmployee(storeId: string, employeeId: string): Promise<void> {
    this.notifyFeedback('saving', 'Removing staff member...');
    try {
      const docRef = doc(db, 'stores', storeId, 'employees', employeeId);
      await deleteDoc(docRef);
      this.notifyFeedback('saved', 'Staff member removed');
    } catch (err) {
      queueOfflineAction({
        collection: 'employees',
        action: 'delete',
        docId: employeeId
      });
      this.notifyFeedback('error', 'Removed locally. Will sync when connected.');
    }
  }

  // Store Configuration
  public async syncStore(store: Store): Promise<void> {
    this.notifyFeedback('saving', 'Saving store configuration...');
    const sanitized = sanitizeData({ ...store, updatedAt: new Date().toISOString() });
    try {
      const docRef = doc(db, 'stores', store.id);
      await setDoc(docRef, sanitized, { merge: true });
      this.notifyFeedback('saved', 'Store configuration saved');
    } catch (err) {
      queueOfflineAction({
        collection: 'stores',
        action: 'update',
        docId: store.id,
        data: sanitized
      });
      this.notifyFeedback('error', 'Saved offline. Will sync when connected.');
    }
  }

  // Flush queued actions to Firestore when back online
  public async flushQueue(): Promise<{ processed: number; remaining: number }> {
    const queue = getOfflineQueue();
    if (queue.length === 0) return { processed: 0, remaining: 0 };

    console.log(`[FirestoreSync] Flushing ${queue.length} pending offline items...`);
    const remaining: OfflineSyncItem[] = [];
    let processed = 0;

    for (const item of queue) {
      try {
        let docRef;
        if (item.collection === 'stores') {
          docRef = doc(db, 'stores', item.docId);
        } else {
          docRef = doc(db, 'stores', this.activeStoreId, item.collection, item.docId);
        }

        if (item.action === 'delete') {
          await deleteDoc(docRef);
        } else {
          await setDoc(docRef, item.data, { merge: true });
        }
        processed++;
      } catch (err) {
        remaining.push(item);
      }
    }

    saveOfflineQueue(remaining);
    return { processed, remaining: remaining.length };
  }
}

export const syncManager = new FirestoreSyncManager();
