import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  writeBatch,
  runTransaction,
  query,
  where,
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
  Supplier,
  RestockLog,
  OfflineSyncItem,
  CloudSyncState,
  SaveFeedback
} from '../types';
import firebaseConfig from '../../firebase-applet-config.json';

const OFFLINE_QUEUE_KEY = 'ellix_offline_sync_queue';

export class InsufficientStockError extends Error {
  public readonly code = 'INSUFFICIENT_STOCK';
  public readonly productId?: string;
  public readonly availableStock?: number;
  public readonly requestedQuantity?: number;

  constructor(
    message: string,
    details?: { productId?: string; availableStock?: number; requestedQuantity?: number }
  ) {
    super(message);
    this.name = 'InsufficientStockError';
    this.productId = details?.productId;
    this.availableStock = details?.availableStock;
    this.requestedQuantity = details?.requestedQuantity;
  }
}

export function isInsufficientStockError(err: unknown): err is InsufficientStockError {
  return (
    err instanceof InsufficientStockError ||
    (typeof err === 'object' &&
      err !== null &&
      ((err as any).name === 'InsufficientStockError' || (err as any).code === 'INSUFFICIENT_STOCK'))
  );
}

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
  onSuppliersUpdate?: (suppliers: Supplier[]) => void;
  onRestockLogsUpdate?: (logs: RestockLog[]) => void;
  onSyncStateChange?: (state: Partial<CloudSyncState>) => void;
  onSaveFeedback?: (feedback: SaveFeedback) => void;
  onInitialDataLoaded?: () => void;
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
    authOptions?: {
      userUid?: string;
      userRole?: string;
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
      employees: 0,
      suppliers: 0,
      restockLogs: 0
    };

    const initialReady = new Set<string>();
    let hasNotifiedInitialLoad = false;
    const checkInitialLoad = (name: string) => {
      initialReady.add(name);
      if (!hasNotifiedInitialLoad && initialReady.has('products') && initialReady.has('customers') && initialReady.has('invoices') && initialReady.has('suppliers')) {
        hasNotifiedInitialLoad = true;
        callbacks.onInitialDataLoaded?.();
      }
    };

    const safetyTimer = setTimeout(() => {
      if (!hasNotifiedInitialLoad) {
        hasNotifiedInitialLoad = true;
        callbacks.onInitialDataLoaded?.();
      }
    }, 1500);

    const notifySynced = () => {
      callbacks.onSyncStateChange?.({
        status: 'synced',
        lastSyncedAt: new Date().toISOString(),
        lastError: null,
        syncedCounts: { ...counts }
      });
    };

    try {
      // 1. Products Collection (Strictly Store-Isolated - No cross-store seeding)
      const productsRef = collection(db, 'stores', storeId, 'products');
      const unsubProducts = onSnapshot(
        productsRef,
        (snapshot) => {
          counts.products = snapshot.size;
          const list = snapshot.docs.map(doc => doc.data() as Product);
          callbacks.onProductsUpdate?.(list);
          notifySynced();
          checkInitialLoad('products');
        },
        (error) => {
          console.warn('[FirestoreSync] Products snapshot warning:', error.message);
          callbacks.onSyncStateChange?.({
            status: 'offline',
            lastError: error.message
          });
          checkInitialLoad('products');
        }
      );
      this.unsubs.push(unsubProducts);

      // 2. Customers Collection
      const customersRef = collection(db, 'stores', storeId, 'customers');
      const unsubCustomers = onSnapshot(
        customersRef,
        (snapshot) => {
          counts.customers = snapshot.size;
          const list = snapshot.docs.map(doc => doc.data() as CustomerProfile);
          callbacks.onCustomersUpdate?.(list);
          notifySynced();
          checkInitialLoad('customers');
        },
        (error) => {
          console.warn('[FirestoreSync] Customers snapshot warning:', error.message);
          checkInitialLoad('customers');
        }
      );
      this.unsubs.push(unsubCustomers);

      // 3. Invoices Collection (Enforce Crew Privacy: Crew queries only their own cashierId)
      const isCrewRole = authOptions?.userRole === 'crew' || authOptions?.userRole === 'cashier' || authOptions?.userRole === 'employee';
      const invoicesQuery = (isCrewRole && authOptions?.userUid)
        ? query(collection(db, 'stores', storeId, 'invoices'), where('cashierId', '==', authOptions.userUid))
        : collection(db, 'stores', storeId, 'invoices');

      const unsubInvoices = onSnapshot(
        invoicesQuery,
        (snapshot) => {
          counts.invoices = snapshot.size;
          const list = snapshot.docs.map(doc => doc.data() as POSInvoice);
          callbacks.onInvoicesUpdate?.(list);
          notifySynced();
          checkInitialLoad('invoices');
        },
        (error) => {
          console.warn('[FirestoreSync] Invoices snapshot warning:', error.message);
          checkInitialLoad('invoices');
        }
      );
      this.unsubs.push(unsubInvoices);

      // 4. Restock Orders Collection
      const restockRef = collection(db, 'stores', storeId, 'restockOrders');
      const unsubRestock = onSnapshot(
        restockRef,
        (snapshot) => {
          counts.restockOrders = snapshot.size;
          const list = snapshot.docs.map(doc => doc.data() as RestockOrder);
          callbacks.onRestockOrdersUpdate?.(list);
          notifySynced();
        },
        (error) => console.warn('[FirestoreSync] Restock orders snapshot warning:', error.message)
      );
      this.unsubs.push(unsubRestock);

      // 5. Customer Orders Collection
      const customerOrdersRef = collection(db, 'stores', storeId, 'customerOrders');
      const unsubCustomerOrders = onSnapshot(
        customerOrdersRef,
        (snapshot) => {
          counts.customerOrders = snapshot.size;
          const list = snapshot.docs.map(doc => doc.data() as CustomerOrder);
          callbacks.onCustomerOrdersUpdate?.(list);
          notifySynced();
        },
        (error) => console.warn('[FirestoreSync] Customer orders snapshot warning:', error.message)
      );
      this.unsubs.push(unsubCustomerOrders);

      // 6. Audit Logs Collection
      const auditRef = collection(db, 'stores', storeId, 'auditLogs');
      const unsubAudit = onSnapshot(
        auditRef,
        (snapshot) => {
          const list = snapshot.docs.map(doc => doc.data() as AuditLog);
          callbacks.onAuditLogsUpdate?.(list);
        },
        (error) => console.warn('[FirestoreSync] Audit logs snapshot warning:', error.message)
      );
      this.unsubs.push(unsubAudit);

      // 7. Wholesalers Collection
      const wholesalersRef = collection(db, 'stores', storeId, 'wholesalers');
      const unsubWholesalers = onSnapshot(
        wholesalersRef,
        (snapshot) => {
          counts.wholesalers = snapshot.size;
          const list = snapshot.docs.map(doc => doc.data() as Wholesaler);
          callbacks.onWholesalersUpdate?.(list);
          notifySynced();
        },
        (error) => console.warn('[FirestoreSync] Wholesalers snapshot warning:', error.message)
      );
      this.unsubs.push(unsubWholesalers);

      // 8. Employees Collection (Client/Owner only)
      if (!isCrewRole) {
        const employeesRef = collection(db, 'stores', storeId, 'employees');
        const unsubEmployees = onSnapshot(
          employeesRef,
          (snapshot) => {
            counts.employees = snapshot.size;
            const list = snapshot.docs.map(doc => doc.data() as Employee);
            callbacks.onEmployeesUpdate?.(list);
            notifySynced();
          },
          (error) => console.warn('[FirestoreSync] Employees snapshot warning:', error.message)
        );
        this.unsubs.push(unsubEmployees);
      }

      // 9. Suppliers Collection (Store-level vendor profiles)
      const suppliersRef = collection(db, 'stores', storeId, 'suppliers');
      const unsubSuppliers = onSnapshot(
        suppliersRef,
        (snapshot) => {
          counts.suppliers = snapshot.size;
          const list = snapshot.docs.map(doc => doc.data() as Supplier);
          callbacks.onSuppliersUpdate?.(list);
          notifySynced();
          checkInitialLoad('suppliers');
        },
        (error) => {
          console.warn('[FirestoreSync] Suppliers snapshot warning:', error.message);
          checkInitialLoad('suppliers');
        }
      );
      this.unsubs.push(unsubSuppliers);

      // 10. Restock Logs Collection (Audited restock transactions)
      const restockLogsRef = collection(db, 'stores', storeId, 'restockLogs');
      const unsubRestockLogs = onSnapshot(
        restockLogsRef,
        (snapshot) => {
          counts.restockLogs = snapshot.size;
          const list = snapshot.docs.map(doc => doc.data() as RestockLog);
          callbacks.onRestockLogsUpdate?.(list);
          notifySynced();
        },
        (error) => console.warn('[FirestoreSync] RestockLogs snapshot warning:', error.message)
      );
      this.unsubs.push(unsubRestockLogs);

      // Flush any queued offline modifications
      this.flushQueue();

    } catch (err: any) {
      console.warn('[FirestoreSync] Subscription catch:', err.message);
      callbacks.onSyncStateChange?.({
        status: 'offline',
        lastError: err.message
      });
      callbacks.onInitialDataLoaded?.();
    }

    return () => {
      clearTimeout(safetyTimer);
      this.unsubscribeAll();
    };
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

  // Atomic POS checkout write: validates stock and updates invoice, product stocks, customer loyalty, and audit log together via Firestore transaction
  public async syncPOSSaleAtomic(
    storeId: string,
    invoice: POSInvoice,
    updatedProducts: Product[],
    updatedCustomer?: CustomerProfile,
    auditLog?: AuditLog
  ): Promise<Product[]> {
    this.notifyFeedback('saving', 'Processing transaction...');

    // 1. Aggregate requested quantities per productId from invoice items
    const requestedByProduct = new Map<string, { quantity: number; productName: string }>();
    for (const item of invoice.items || []) {
      const qty = Number(item.quantity);
      if (!Number.isFinite(qty) || qty <= 0) {
        const err = new InsufficientStockError(
          `Invalid sale quantity (${item.quantity}) for "${item.productName || item.productId}".`,
          { productId: item.productId, requestedQuantity: qty }
        );
        this.notifyFeedback('error', err.message);
        throw err;
      }
      const existing = requestedByProduct.get(item.productId);
      requestedByProduct.set(item.productId, {
        quantity: (existing?.quantity || 0) + qty,
        productName: item.productName || existing?.productName || item.productId
      });
    }

    const updatedProductsMap = new Map<string, Product>(
      (updatedProducts || []).map(p => [p.id, p])
    );

    // Ensure no caller-supplied product stock is negative
    for (const [productId, req] of requestedByProduct.entries()) {
      const localProd = updatedProductsMap.get(productId);
      if (localProd && Number(localProd.stock) < 0) {
        const err = new InsufficientStockError(
          `Insufficient stock for "${localProd.name || req.productName}".`,
          {
            productId,
            availableStock: Math.max(0, Number(localProd.stock) + req.quantity),
            requestedQuantity: req.quantity
          }
        );
        this.notifyFeedback('error', err.message);
        throw err;
      }
    }

    try {
      const committedProducts = await runTransaction(db, async (transaction) => {
        const nowIso = new Date().toISOString();
        const productEntries = Array.from(requestedByProduct.entries());

        // Phase 1: Read all product documents and customer document before any writes
        const productRefs = productEntries.map(([productId]) =>
          doc(db, 'stores', storeId, 'products', productId)
        );
        const productSnaps = await Promise.all(
          productRefs.map(ref => transaction.get(ref))
        );

        const customerRef = updatedCustomer
          ? doc(db, 'stores', storeId, 'customers', updatedCustomer.id)
          : null;
        const customerSnap = customerRef ? await transaction.get(customerRef) : null;

        // Phase 2: Validate stock against authoritative Firestore documents
        const nextProductsToCommit: {
          ref: ReturnType<typeof doc>;
          existsInCloud: boolean;
          nextStock: number;
          mergedProduct: Product;
        }[] = [];

        for (let i = 0; i < productEntries.length; i++) {
          const [productId, req] = productEntries[i];
          const pRef = productRefs[i];
          const pSnap = productSnaps[i];
          const fallbackProd = updatedProductsMap.get(productId);

          if (pSnap.exists()) {
            const remoteData = pSnap.data() as Product;
            const currentStock = Number(remoteData.stock ?? 0);
            if (!Number.isFinite(currentStock) || currentStock < req.quantity) {
              throw new InsufficientStockError(
                `Insufficient stock for "${remoteData.name || req.productName}": only ${Math.max(0, currentStock)} available, requested ${req.quantity}.`,
                {
                  productId,
                  availableStock: Math.max(0, currentStock),
                  requestedQuantity: req.quantity
                }
              );
            }
            const nextStock = currentStock - req.quantity;
            nextProductsToCommit.push({
              ref: pRef,
              existsInCloud: true,
              nextStock,
              mergedProduct: {
                ...(fallbackProd || remoteData),
                ...remoteData,
                id: productId,
                stock: nextStock
              }
            });
          } else if (fallbackProd && Number.isFinite(Number(fallbackProd.stock)) && Number(fallbackProd.stock) >= 0) {
            const nextStock = Number(fallbackProd.stock);
            nextProductsToCommit.push({
              ref: pRef,
              existsInCloud: false,
              nextStock,
              mergedProduct: {
                ...fallbackProd,
                id: productId,
                stock: nextStock
              }
            });
          } else {
            throw new InsufficientStockError(
              `Product "${req.productName}" is unavailable or out of stock.`,
              {
                productId,
                availableStock: 0,
                requestedQuantity: req.quantity
              }
            );
          }
        }

        // Phase 3: Perform all writes atomically inside the transaction
        // 1. Affected products stock deduction
        for (const item of nextProductsToCommit) {
          if (item.existsInCloud) {
            transaction.update(item.ref, {
              stock: item.nextStock,
              updatedAt: nowIso
            });
          } else {
            transaction.set(
              item.ref,
              sanitizeData({
                ...item.mergedProduct,
                stock: item.nextStock,
                storeId,
                updatedAt: nowIso
              }),
              { merge: true }
            );
          }
        }

        // 2. Invoice
        const invRef = doc(db, 'stores', storeId, 'invoices', invoice.id);
        transaction.set(
          invRef,
          sanitizeData({
            ...invoice,
            totalAmount: invoice.grandTotal,
            storeId,
            updatedAt: nowIso
          }),
          { merge: true }
        );

        // 3. Customer profile if linked
        if (updatedCustomer && customerRef) {
          if (customerSnap && customerSnap.exists()) {
            const remoteCust = customerSnap.data() as CustomerProfile;
            const remotePurchases = Number(remoteCust.totalPurchases ?? 0);
            const remoteLoyalty = Number(remoteCust.loyaltyPoints ?? 0);
            const remoteCredit = Number(remoteCust.creditBalance ?? 0);
            const redeemed = Number(invoice.loyaltyPointsRedeemed ?? 0);
            const earned = Number(invoice.loyaltyPointsEarned ?? 0);
            const creditDelta = invoice.paymentMethod === 'credit' ? Number(invoice.grandTotal ?? 0) : 0;

            transaction.set(
              customerRef,
              sanitizeData({
                ...updatedCustomer,
                ...remoteCust,
                totalPurchases: remotePurchases + Number(invoice.grandTotal ?? 0),
                loyaltyPoints: Math.max(0, remoteLoyalty - redeemed + earned),
                creditBalance: remoteCredit + creditDelta,
                storeId,
                updatedAt: nowIso
              }),
              { merge: true }
            );
          } else {
            transaction.set(
              customerRef,
              sanitizeData({ ...updatedCustomer, storeId, updatedAt: nowIso }),
              { merge: true }
            );
          }
        }

        // 4. Audit Log
        if (auditLog) {
          const lRef = doc(db, 'stores', storeId, 'auditLogs', auditLog.id);
          transaction.set(lRef, sanitizeData({ ...auditLog, storeId }), { merge: true });
        }

        return nextProductsToCommit.map(item => item.mergedProduct);
      });

      this.notifyFeedback('saved', 'Transaction saved');
      return committedProducts;
    } catch (err: any) {
      // Never queue insufficient-stock or validation rejections into the offline queue
      if (isInsufficientStockError(err)) {
        this.notifyFeedback('error', err.message);
        throw err;
      }

      const isOfflineError =
        !this.isOnline ||
        (typeof navigator !== 'undefined' && !navigator.onLine) ||
        err?.code === 'unavailable';

      if (!isOfflineError) {
        this.notifyFeedback('error', err?.message || 'Transaction failed.');
        throw err;
      }

      console.warn('[FirestoreSync] POS sale atomic write failed while offline, queuing items:', err);
      const nowIso = new Date().toISOString();
      // Fallback: queue individual operations into offline queue when genuinely offline
      queueOfflineAction({
        collection: 'invoices',
        action: 'create',
        docId: invoice.id,
        data: sanitizeData({ ...invoice, totalAmount: invoice.grandTotal, storeId, updatedAt: nowIso })
      });
      for (const p of updatedProducts) {
        queueOfflineAction({
          collection: 'products',
          action: 'update',
          docId: p.id,
          data: sanitizeData({ ...p, storeId, updatedAt: nowIso })
        });
      }
      if (updatedCustomer) {
        queueOfflineAction({
          collection: 'customers',
          action: 'update',
          docId: updatedCustomer.id,
          data: sanitizeData({ ...updatedCustomer, storeId, updatedAt: nowIso })
        });
      }
      this.notifyFeedback('error', 'Transaction saved offline. Will sync when connected.');
      return updatedProducts;
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

  // Suppliers Management (Client/Owner only writes; Crew can read)
  public async syncSupplier(storeId: string, supplier: Supplier): Promise<void> {
    this.notifyFeedback('saving', 'Saving supplier details...');
    const sanitized = sanitizeData({ ...supplier, storeId, updatedAt: new Date().toISOString() });
    try {
      const docRef = doc(db, 'stores', storeId, 'suppliers', supplier.id);
      await setDoc(docRef, sanitized, { merge: true });
      this.notifyFeedback('saved', 'Supplier saved');
    } catch (err) {
      this.notifyFeedback('error', 'Failed to save supplier to cloud.');
    }
  }

  public async deleteSupplier(storeId: string, supplierId: string): Promise<void> {
    this.notifyFeedback('saving', 'Removing supplier...');
    try {
      const docRef = doc(db, 'stores', storeId, 'suppliers', supplierId);
      await deleteDoc(docRef);
      this.notifyFeedback('saved', 'Supplier removed');
    } catch (err) {
      this.notifyFeedback('error', 'Failed to remove supplier from cloud.');
    }
  }

  // Restock Logs (Audited inventory restock transactions)
  public async syncRestockLog(storeId: string, log: RestockLog): Promise<void> {
    this.notifyFeedback('saving', 'Recording restock log...');
    const sanitized = sanitizeData({
      ...log,
      storeId,
      quantity: log.quantity || log.quantityAdded || 0,
      createdAt: log.createdAt || log.date || new Date().toISOString()
    });
    try {
      const docRef = doc(db, 'stores', storeId, 'restockLogs', log.id);
      await setDoc(docRef, sanitized, { merge: true });
      this.notifyFeedback('saved', 'Restock logged');
    } catch (err) {
      this.notifyFeedback('error', 'Failed to save restock log to cloud.');
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
