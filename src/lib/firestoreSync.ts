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
  SaveFeedback,
  normalizeCanonicalRole
} from '../types';
import firebaseConfig from '../../firebase-applet-config.json';
import {
  mockProducts,
  mockCustomers,
  mockInvoices,
  mockRestockOrders,
  mockCustomerOrders,
  mockEmployees,
  mockAuditLogs,
  mockWholesalers,
  mockWholesalerProducts,
  mockSuppliers,
  mockRestockLogs,
  mockConnections,
  mockNotifications,
  mockBusinessApplications
} from '../data/mockData';

const OFFLINE_QUEUE_KEY = 'ellix_offline_sync_queue';
const INVOICE_COUNTER_STORAGE_PREFIX = 'ellix_invoice_counter_';

export const MOCK_FIXTURE_IDS = new Set<string>([
  ...mockProducts.map(item => item.id),
  ...mockCustomers.map(item => item.id),
  ...mockInvoices.map(item => item.id),
  ...mockRestockOrders.map(item => item.id),
  ...mockCustomerOrders.map(item => item.id),
  ...mockEmployees.map(item => item.id),
  ...mockAuditLogs.map(item => item.id),
  ...mockWholesalers.map(item => item.id),
  ...mockWholesalerProducts.map(item => item.id),
  ...mockSuppliers.map(item => item.id),
  ...mockRestockLogs.map(item => item.id),
  ...mockConnections.map(item => item.id),
  ...mockNotifications.map(item => item.id),
  ...mockBusinessApplications.map(item => item.id)
]);

export function isMockFixtureId(id: unknown): boolean {
  return typeof id === 'string' && MOCK_FIXTURE_IDS.has(id);
}

export function stripMockFixtures<T>(items: T[]): T[] {
  if (!Array.isArray(items)) return [];
  return items.filter((item: any) => !isMockFixtureId(item?.id));
}

export interface StoreInvoiceCounterState {
  storeId: string;
  lastSequence: number;
  baselineSequence: number;
  issuedNumbers: Record<string, string>; // invoiceNumber -> invoiceId
  issuedByInvoiceId: Record<
    string,
    { invoiceNumber: string; sequence: number; updatedAt: string }
  >;
  updatedAt: string;
}

const inMemoryStoreCounters = new Map<string, StoreInvoiceCounterState>();

export function getInvoiceDateKey(dateStr?: string): string {
  if (typeof dateStr === 'string') {
    const digits = dateStr.slice(0, 10).replace(/-/g, '');
    if (/^\d{8}$/.test(digits)) {
      return digits;
    }
  }
  return new Date().toISOString().slice(0, 10).replace(/-/g, '');
}

export function formatStoreInvoiceNumber(dateKey: string, sequence: number): string {
  const safeSeq = Math.max(1, Math.floor(Number(sequence) || 1));
  const cleanDate = /^\d{8}$/.test(dateKey)
    ? dateKey
    : new Date().toISOString().slice(0, 10).replace(/-/g, '');
  return `INV-${cleanDate}-${safeSeq.toString().padStart(2, '0')}`;
}

export function parseInvoiceSequenceNumber(invoiceNumber?: string | null): number {
  if (!invoiceNumber || typeof invoiceNumber !== 'string') return 0;
  const match = invoiceNumber.trim().match(/^INV-(?:\d{8}|\d{4}-\d{4})-(\d+)$/i);
  if (!match) return 0;
  const parsed = parseInt(match[1], 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function pruneCounterMaps(state: StoreInvoiceCounterState, maxEntries = 500): void {
  const idEntries = Object.entries(state.issuedByInvoiceId);
  if (idEntries.length <= maxEntries) return;
  idEntries.sort((a, b) => a[1].sequence - b[1].sequence);
  const toRemove = idEntries.slice(0, idEntries.length - maxEntries);
  for (const [invId, info] of toRemove) {
    delete state.issuedByInvoiceId[invId];
    if (state.issuedNumbers[info.invoiceNumber] === invId) {
      delete state.issuedNumbers[info.invoiceNumber];
    }
  }
}

export function getStoreInvoiceCounterState(storeId: string): StoreInvoiceCounterState {
  const cleanStoreId = storeId || 'store-1';
  const existingMem = inMemoryStoreCounters.get(cleanStoreId);
  let storedState: Partial<StoreInvoiceCounterState> | null = null;
  try {
    const raw = localStorage.getItem(`${INVOICE_COUNTER_STORAGE_PREFIX}${cleanStoreId}`);
    if (raw) {
      storedState = JSON.parse(raw);
    }
  } catch {
    // ignore storage read errors
  }

  const nowIso = new Date().toISOString();
  const mergedIssuedNumbers: Record<string, string> = {
    ...(storedState?.issuedNumbers || {}),
    ...(existingMem?.issuedNumbers || {})
  };
  const mergedIssuedByInvoiceId: Record<
    string,
    { invoiceNumber: string; sequence: number; updatedAt: string }
  > = {
    ...(storedState?.issuedByInvoiceId || {}),
    ...(existingMem?.issuedByInvoiceId || {})
  };

  let maxSeq = Math.max(
    0,
    Number(storedState?.lastSequence || 0),
    Number(existingMem?.lastSequence || 0),
    Number(storedState?.baselineSequence || 0),
    Number(existingMem?.baselineSequence || 0)
  );
  for (const info of Object.values(mergedIssuedByInvoiceId)) {
    if (Number.isFinite(info.sequence) && info.sequence > maxSeq) {
      maxSeq = info.sequence;
    }
  }

  const state: StoreInvoiceCounterState = {
    storeId: cleanStoreId,
    lastSequence: maxSeq,
    baselineSequence: Math.max(
      0,
      Number(storedState?.baselineSequence || 0),
      Number(existingMem?.baselineSequence || 0)
    ),
    issuedNumbers: mergedIssuedNumbers,
    issuedByInvoiceId: mergedIssuedByInvoiceId,
    updatedAt: nowIso
  };
  inMemoryStoreCounters.set(cleanStoreId, state);
  return state;
}

export function saveStoreInvoiceCounterState(
  storeId: string,
  state: StoreInvoiceCounterState
): void {
  const cleanStoreId = storeId || 'store-1';
  pruneCounterMaps(state);
  inMemoryStoreCounters.set(cleanStoreId, state);
  try {
    localStorage.setItem(
      `${INVOICE_COUNTER_STORAGE_PREFIX}${cleanStoreId}`,
      JSON.stringify(state)
    );
  } catch {
    // ignore storage quota errors
  }
}

export function reconcileStoreInvoiceCounter(
  storeId: string,
  existingInvoices?: Array<{ id?: string; invoiceNumber?: string; storeId?: string }>,
  remoteCounter?: Partial<StoreInvoiceCounterState>
): StoreInvoiceCounterState {
  const cleanStoreId = storeId || 'store-1';
  const state = getStoreInvoiceCounterState(cleanStoreId);
  const nowIso = new Date().toISOString();

  if (remoteCounter) {
    if (
      typeof remoteCounter.lastSequence === 'number' &&
      remoteCounter.lastSequence > state.lastSequence
    ) {
      state.lastSequence = remoteCounter.lastSequence;
    }
    if (
      typeof remoteCounter.baselineSequence === 'number' &&
      remoteCounter.baselineSequence > state.baselineSequence
    ) {
      state.baselineSequence = remoteCounter.baselineSequence;
    }
    if (remoteCounter.issuedNumbers && typeof remoteCounter.issuedNumbers === 'object') {
      state.issuedNumbers = {
        ...state.issuedNumbers,
        ...remoteCounter.issuedNumbers
      };
    }
    if (remoteCounter.issuedByInvoiceId && typeof remoteCounter.issuedByInvoiceId === 'object') {
      state.issuedByInvoiceId = {
        ...state.issuedByInvoiceId,
        ...remoteCounter.issuedByInvoiceId
      };
      for (const info of Object.values(remoteCounter.issuedByInvoiceId)) {
        if (info && Number.isFinite(info.sequence)) {
          if (info.sequence > state.lastSequence) state.lastSequence = info.sequence;
          if (info.sequence > state.baselineSequence) state.baselineSequence = info.sequence;
        }
      }
    }
  }

  const allSources: Array<{
    id?: string;
    invoiceNumber?: string;
    storeId?: string;
    isOfflineQueued?: boolean;
  }> = [];
  if (Array.isArray(existingInvoices)) {
    allSources.push(...existingInvoices);
  }

  // Also include any store-scoped cached invoices in localStorage
  try {
    const rawCached = localStorage.getItem(`ellix_invoices_${cleanStoreId}`);
    if (rawCached) {
      const parsed = JSON.parse(rawCached);
      if (Array.isArray(parsed)) {
        allSources.push(...parsed);
      }
    }
  } catch {
    // ignore
  }

  // Also include any pending offline queue invoices for this store
  const queue = getOfflineQueue();
  for (const item of queue) {
    if (
      item.collection === 'invoices' &&
      item.action !== 'delete' &&
      item.data &&
      (!item.data.storeId || item.data.storeId === cleanStoreId)
    ) {
      allSources.push({
        id: item.docId || item.data.id,
        invoiceNumber: item.data.invoiceNumber,
        storeId: item.data.storeId || cleanStoreId,
        isOfflineQueued: true
      });
    }
  }

  let scopedCount = 0;
  let committedCount = 0;
  const seenIds = new Set<string>();
  for (const inv of allSources) {
    if (!inv || (inv.storeId && inv.storeId !== cleanStoreId)) continue;
    if (inv.id && !seenIds.has(inv.id)) {
      seenIds.add(inv.id);
      scopedCount += 1;
      if (!inv.isOfflineQueued) {
        committedCount += 1;
      }
    }
    const seq = parseInvoiceSequenceNumber(inv.invoiceNumber);
    if (seq > state.lastSequence) {
      state.lastSequence = seq;
    }
    if (!inv.isOfflineQueued && seq > state.baselineSequence) {
      state.baselineSequence = seq;
    }
    if (inv.invoiceNumber && inv.id) {
      if (!state.issuedNumbers[inv.invoiceNumber]) {
        state.issuedNumbers[inv.invoiceNumber] = inv.id;
      }
      if (!state.issuedByInvoiceId[inv.id]) {
        state.issuedByInvoiceId[inv.id] = {
          invoiceNumber: inv.invoiceNumber,
          sequence: seq > 0 ? seq : scopedCount,
          updatedAt: nowIso
        };
      }
    }
  }

  if (scopedCount > state.lastSequence) {
    state.lastSequence = scopedCount;
  }
  if (committedCount > state.baselineSequence) {
    state.baselineSequence = committedCount;
  }

  state.updatedAt = nowIso;
  saveStoreInvoiceCounterState(cleanStoreId, state);
  return state;
}

export function reserveStoreInvoiceNumber(
  storeId: string,
  invoiceId: string,
  dateStr?: string,
  existingInvoices?: Array<{ id?: string; invoiceNumber?: string; storeId?: string }>
): string {
  const cleanStoreId = storeId || 'store-1';
  const state = reconcileStoreInvoiceCounter(cleanStoreId, existingInvoices);
  const nowIso = new Date().toISOString();

  // Idempotent return if this exact invoiceId already has a reserved/issued number
  const existingForId = state.issuedByInvoiceId[invoiceId];
  if (existingForId && existingForId.invoiceNumber) {
    state.issuedNumbers[existingForId.invoiceNumber] = invoiceId;
    saveStoreInvoiceCounterState(cleanStoreId, state);
    return existingForId.invoiceNumber;
  }

  const dateKey = getInvoiceDateKey(dateStr);
  let nextSeq = state.lastSequence + 1;
  let candidate = formatStoreInvoiceNumber(dateKey, nextSeq);

  while (state.issuedNumbers[candidate] && state.issuedNumbers[candidate] !== invoiceId) {
    nextSeq += 1;
    candidate = formatStoreInvoiceNumber(dateKey, nextSeq);
  }

  state.lastSequence = nextSeq;
  state.issuedNumbers[candidate] = invoiceId;
  state.issuedByInvoiceId[invoiceId] = {
    invoiceNumber: candidate,
    sequence: nextSeq,
    updatedAt: nowIso
  };
  state.updatedAt = nowIso;
  saveStoreInvoiceCounterState(cleanStoreId, state);
  return candidate;
}

export function commitStoreInvoiceNumber(
  storeId: string,
  invoiceId: string,
  invoiceNumber: string
): void {
  const cleanStoreId = storeId || 'store-1';
  const state = getStoreInvoiceCounterState(cleanStoreId);
  const nowIso = new Date().toISOString();
  const seq = parseInvoiceSequenceNumber(invoiceNumber);

  // Remove any previous tentative number registered to this invoiceId if reassigned
  const previous = state.issuedByInvoiceId[invoiceId];
  if (previous && previous.invoiceNumber !== invoiceNumber) {
    if (state.issuedNumbers[previous.invoiceNumber] === invoiceId) {
      delete state.issuedNumbers[previous.invoiceNumber];
    }
  }

  const effectiveSeq = seq > 0 ? seq : Math.max(1, state.lastSequence);
  if (effectiveSeq > state.lastSequence) {
    state.lastSequence = effectiveSeq;
  }
  if (effectiveSeq > state.baselineSequence) {
    state.baselineSequence = effectiveSeq;
  }
  state.issuedNumbers[invoiceNumber] = invoiceId;
  state.issuedByInvoiceId[invoiceId] = {
    invoiceNumber,
    sequence: effectiveSeq,
    updatedAt: nowIso
  };
  state.updatedAt = nowIso;
  saveStoreInvoiceCounterState(cleanStoreId, state);
}

export function releaseStoreInvoiceNumberReservation(
  storeId: string,
  invoiceId: string
): void {
  const cleanStoreId = storeId || 'store-1';
  const state = getStoreInvoiceCounterState(cleanStoreId);
  const existing = state.issuedByInvoiceId[invoiceId];
  if (!existing) return;

  delete state.issuedByInvoiceId[invoiceId];
  if (state.issuedNumbers[existing.invoiceNumber] === invoiceId) {
    delete state.issuedNumbers[existing.invoiceNumber];
  }

  let maxRemainingSeq = state.baselineSequence;
  for (const info of Object.values(state.issuedByInvoiceId)) {
    if (Number.isFinite(info.sequence) && info.sequence > maxRemainingSeq) {
      maxRemainingSeq = info.sequence;
    }
  }
  state.lastSequence = maxRemainingSeq;
  state.updatedAt = new Date().toISOString();
  saveStoreInvoiceCounterState(cleanStoreId, state);
}

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
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item: any) => !isMockFixtureId(item?.docId));
  } catch (e) {
    console.error('Failed to read offline sync queue:', e);
    return [];
  }
}

export function saveOfflineQueue(queue: OfflineSyncItem[]): void {
  try {
    const cleanQueue = Array.isArray(queue)
      ? queue.filter(item => !isMockFixtureId(item?.docId))
      : [];
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(cleanQueue));
  } catch (e) {
    console.error('Failed to save offline sync queue:', e);
  }
}

export function queueOfflineAction(item: Omit<OfflineSyncItem, 'id' | 'timestamp'>): void {
  if (isMockFixtureId(item.docId)) {
    return;
  }
  const queue = getOfflineQueue();
  const targetStoreId = item.data?.storeId || '';

  // Ensure invoice numbers in the offline queue are unique per store and idempotent per invoice docId
  if (item.collection === 'invoices' && item.action !== 'delete' && item.data) {
    const storeIdForInv = item.data.storeId || 'store-1';
    const invId = item.docId || item.data.id;
    const conflictingInQueue = queue.some(
      q =>
        q.collection === 'invoices' &&
        q.action !== 'delete' &&
        q.docId !== invId &&
        (q.data?.storeId || 'store-1') === storeIdForInv &&
        q.data?.invoiceNumber &&
        q.data.invoiceNumber === item.data.invoiceNumber
    );
    if (!item.data.invoiceNumber || conflictingInQueue) {
      if (conflictingInQueue) {
        releaseStoreInvoiceNumberReservation(storeIdForInv, invId);
      }
      const assigned = reserveStoreInvoiceNumber(storeIdForInv, invId, item.data.date);
      item.data = {
        ...item.data,
        invoiceNumber: assigned
      };
    } else {
      const state = getStoreInvoiceCounterState(storeIdForInv);
      const seq = parseInvoiceSequenceNumber(item.data.invoiceNumber);
      if (seq > state.lastSequence) {
        state.lastSequence = seq;
      }
      state.issuedNumbers[item.data.invoiceNumber] = invId;
      state.issuedByInvoiceId[invId] = {
        invoiceNumber: item.data.invoiceNumber,
        sequence: seq > 0 ? seq : Math.max(1, state.lastSequence),
        updatedAt: new Date().toISOString()
      };
      saveStoreInvoiceCounterState(storeIdForInv, state);
    }
  }

  // Deduplicate existing queued action for the same collection + docId + storeId
  const existingIdx = queue.findIndex(
    q =>
      q.collection === item.collection &&
      q.docId === item.docId &&
      (q.data?.storeId || '') === targetStoreId
  );

  if (existingIdx >= 0) {
    if (item.action === 'delete' && queue[existingIdx].action === 'create') {
      queue.splice(existingIdx, 1);
    } else {
      const preservedInvoiceNumber =
        item.collection === 'invoices' && queue[existingIdx].data?.invoiceNumber
          ? queue[existingIdx].data.invoiceNumber
          : item.data?.invoiceNumber;
      queue[existingIdx] = {
        ...queue[existingIdx],
        action: item.action,
        data:
          item.collection === 'invoices' && item.data && preservedInvoiceNumber
            ? { ...item.data, invoiceNumber: preservedInvoiceNumber }
            : item.data,
        timestamp: new Date().toISOString()
      };
    }
    saveOfflineQueue(queue);
    return;
  }

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
      const canonicalRole = normalizeCanonicalRole(authOptions?.userRole ?? 'client');
      if (canonicalRole === 'unauthorized') {
        clearTimeout(safetyTimer);
        callbacks.onProductsUpdate?.([]);
        callbacks.onCustomersUpdate?.([]);
        callbacks.onInvoicesUpdate?.([]);
        callbacks.onRestockOrdersUpdate?.([]);
        callbacks.onCustomerOrdersUpdate?.([]);
        callbacks.onAuditLogsUpdate?.([]);
        callbacks.onWholesalersUpdate?.([]);
        callbacks.onEmployeesUpdate?.([]);
        callbacks.onSuppliersUpdate?.([]);
        callbacks.onRestockLogsUpdate?.([]);
        callbacks.onInitialDataLoaded?.();
        return () => {};
      }

      const isCrewRole = canonicalRole === 'crew';
      const isWholesalerRole = canonicalRole === 'wholesaler_admin';
      const canManageStoreRole =
        canonicalRole === 'super_admin' ||
        canonicalRole === 'ellix_admin' ||
        canonicalRole === 'client';

      // 1. Products Collection (Wholesaler queries only sharedWithWholesalers == true)
      const productsQuery = isWholesalerRole
        ? query(collection(db, 'stores', storeId, 'products'), where('sharedWithWholesalers', '==', true))
        : collection(db, 'stores', storeId, 'products');
      const unsubProducts = onSnapshot(
        productsQuery,
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

      // 2. Customers Collection (Client/Admin only — Crew & Wholesaler cannot list customer directory)
      if (canManageStoreRole) {
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
      } else {
        callbacks.onCustomersUpdate?.([]);
        checkInitialLoad('customers');
      }

      // 3. Invoices Collection (Enforce Crew Privacy: Crew queries only their own cashierId; Wholesaler has no access)
      if (canManageStoreRole || (isCrewRole && authOptions?.userUid)) {
        const invoicesQuery = (isCrewRole && authOptions?.userUid)
          ? query(collection(db, 'stores', storeId, 'invoices'), where('cashierId', '==', authOptions.userUid))
          : collection(db, 'stores', storeId, 'invoices');

        const unsubInvoices = onSnapshot(
          invoicesQuery,
          (snapshot) => {
            counts.invoices = snapshot.size;
            const list = snapshot.docs.map(doc => doc.data() as POSInvoice);
            reconcileStoreInvoiceCounter(storeId, list);
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

        // 3b. Store Invoice Sequence Counter (Authoritative multi-terminal sync)
        const invoiceCounterRef = doc(db, 'stores', storeId, 'counters', 'invoiceSequence');
        const unsubInvoiceCounter = onSnapshot(
          invoiceCounterRef,
          (snap) => {
            if (snap.exists()) {
              reconcileStoreInvoiceCounter(
                storeId,
                undefined,
                snap.data() as Partial<StoreInvoiceCounterState>
              );
            }
          },
          (error) => {
            console.warn('[FirestoreSync] Invoice counter snapshot warning:', error.message);
          }
        );
        this.unsubs.push(unsubInvoiceCounter);
      } else {
        callbacks.onInvoicesUpdate?.([]);
        checkInitialLoad('invoices');
      }

      // 4. Restock Orders Collection (Client/Admin or Wholesaler; Crew cannot list B2B POs)
      if (canManageStoreRole || isWholesalerRole) {
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
      } else {
        callbacks.onRestockOrdersUpdate?.([]);
      }

      // 5. Customer Orders Collection (Client/Admin only)
      if (canManageStoreRole) {
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
      } else {
        callbacks.onCustomerOrdersUpdate?.([]);
      }

      // 6. Audit Logs Collection (Client/Admin only)
      if (canManageStoreRole) {
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
      } else {
        callbacks.onAuditLogsUpdate?.([]);
      }

      // 7. Wholesalers Collection (Client/Admin only)
      if (canManageStoreRole) {
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
      } else {
        callbacks.onWholesalersUpdate?.([]);
      }

      // 8. Employees Collection (Client/Admin only)
      if (canManageStoreRole) {
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
      } else {
        callbacks.onEmployeesUpdate?.([]);
      }

      // 9. Suppliers Collection (Store-level vendor profiles: Client/Admin & Crew for restock dropdown)
      if (canManageStoreRole || isCrewRole) {
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
      } else {
        callbacks.onSuppliersUpdate?.([]);
        checkInitialLoad('suppliers');
      }

      // 10. Restock Logs Collection (Audited restock transactions: Client/Admin & Crew)
      if (canManageStoreRole || isCrewRole) {
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
      } else {
        callbacks.onRestockLogsUpdate?.([]);
      }

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
  // Seeders (Never writes static mockData fixtures to production Firestore)
  // --------------------------------------------------------------------------
  public async seedProducts(storeId: string, items: Product[]): Promise<void> {
    try {
      const realItems = stripMockFixtures(items);
      if (realItems.length === 0) return;
      const batch = writeBatch(db);
      for (const item of realItems) {
        const ref = doc(db, 'stores', storeId, 'products', item.id);
        batch.set(ref, sanitizeData({ ...item, storeId }), { merge: true });
      }
      await batch.commit();
      console.log(`[FirestoreSync] Seeded ${realItems.length} products to store ${storeId}`);
    } catch (e) {
      console.warn('[FirestoreSync] Seeding products failed or postponed:', e);
    }
  }

  public async seedCustomers(storeId: string, items: CustomerProfile[]): Promise<void> {
    try {
      const realItems = stripMockFixtures(items);
      if (realItems.length === 0) return;
      const batch = writeBatch(db);
      for (const item of realItems) {
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
      const realItems = stripMockFixtures(items);
      if (realItems.length === 0) return;
      reconcileStoreInvoiceCounter(storeId, realItems);
      const batch = writeBatch(db);
      for (const item of realItems) {
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
      const realItems = stripMockFixtures(items);
      if (realItems.length === 0) return;
      const batch = writeBatch(db);
      for (const item of realItems) {
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
      const realItems = stripMockFixtures(items);
      if (realItems.length === 0) return;
      const batch = writeBatch(db);
      for (const item of realItems) {
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
      const realItems = stripMockFixtures(items);
      if (realItems.length === 0) return;
      const batch = writeBatch(db);
      for (const item of realItems) {
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
      const realItems = stripMockFixtures(items);
      if (realItems.length === 0) return;
      const batch = writeBatch(db);
      for (const item of realItems) {
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
      const realItems = stripMockFixtures(items);
      if (realItems.length === 0) return;
      const batch = writeBatch(db);
      for (const item of realItems) {
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

  private storeTxQueues: Map<string, Promise<any>> = new Map();

  public reconcileStoreInvoiceCounter(
    storeId: string,
    existingInvoices?: Array<{ id?: string; invoiceNumber?: string; storeId?: string }>
  ): StoreInvoiceCounterState {
    return reconcileStoreInvoiceCounter(storeId, existingInvoices);
  }

  public reserveStoreInvoiceNumber(
    storeId: string,
    invoiceId: string,
    dateStr?: string,
    existingInvoices?: Array<{ id?: string; invoiceNumber?: string; storeId?: string }>
  ): string {
    return reserveStoreInvoiceNumber(storeId, invoiceId, dateStr, existingInvoices);
  }

  public releaseStoreInvoiceNumberReservation(storeId: string, invoiceId: string): void {
    releaseStoreInvoiceNumberReservation(storeId, invoiceId);
  }

  private runStoreSerialized<T>(storeId: string, task: () => Promise<T>): Promise<T> {
    const cleanStoreId = storeId || 'store-1';
    const prev = this.storeTxQueues.get(cleanStoreId) || Promise.resolve();
    const next = prev.catch(() => {}).then(() => task());
    this.storeTxQueues.set(
      cleanStoreId,
      next.catch(() => {})
    );
    return next;
  }

  private async runFirestoreTransactionWithRetry<T>(
    storeId: string,
    updateFunction: (transaction: any) => Promise<T>,
    maxAttempts = 5
  ): Promise<T> {
    return this.runStoreSerialized(storeId, async () => {
      let attempt = 0;
      while (true) {
        attempt += 1;
        try {
          return await runTransaction(db, updateFunction);
        } catch (err: any) {
          if (isInsufficientStockError(err)) {
            throw err;
          }
          const isRetryableContention =
            err?.code === 'aborted' ||
            err?.code === 'failed-precondition' ||
            (typeof err?.message === 'string' &&
              (err.message.includes('aborted') || err.message.includes('contention')));
          if (!isRetryableContention || attempt >= maxAttempts) {
            throw err;
          }
          const backoffMs = 20 * attempt + Math.floor(Math.random() * 40);
          await new Promise(resolve => setTimeout(resolve, backoffMs));
        }
      }
    });
  }

  private resolveAuthoritativeInvoiceNumberInTx(
    storeId: string,
    invoice: POSInvoice,
    counterSnap: any,
    invSnap: any,
    nowIso: string
  ): {
    authoritativeInvoiceNumber: string;
    counterPayload: Record<string, any>;
    alreadyCommitted: boolean;
    existingInvoiceData?: POSInvoice;
  } {
    const cleanStoreId = storeId || 'store-1';
    const localState = getStoreInvoiceCounterState(cleanStoreId);
    const remoteCounter =
      counterSnap && typeof counterSnap.exists === 'function' && counterSnap.exists()
        ? (counterSnap.data() as Partial<StoreInvoiceCounterState>)
        : undefined;

    const remoteIssuedNumbers: Record<string, string> = {
      ...(remoteCounter?.issuedNumbers || {})
    };
    const remoteIssuedByInvoiceId: Record<
      string,
      { invoiceNumber: string; sequence: number; updatedAt: string }
    > = {
      ...(remoteCounter?.issuedByInvoiceId || {})
    };

    // 1. If invoice document already exists in Firestore, preserve its committed invoiceNumber (idempotent retry)
    if (invSnap && typeof invSnap.exists === 'function' && invSnap.exists()) {
      const existingData = invSnap.data() as POSInvoice;
      const committedNumber =
        existingData?.invoiceNumber ||
        remoteIssuedByInvoiceId[invoice.id]?.invoiceNumber ||
        invoice.invoiceNumber ||
        formatStoreInvoiceNumber(getInvoiceDateKey(invoice.date), 1);
      const committedSeq = Math.max(
        1,
        parseInvoiceSequenceNumber(committedNumber),
        Number(remoteCounter?.lastSequence || 0)
      );
      remoteIssuedNumbers[committedNumber] = invoice.id;
      remoteIssuedByInvoiceId[invoice.id] = {
        invoiceNumber: committedNumber,
        sequence: committedSeq,
        updatedAt: nowIso
      };
      return {
        authoritativeInvoiceNumber: committedNumber,
        counterPayload: sanitizeData({
          storeId: cleanStoreId,
          lastSequence: committedSeq,
          baselineSequence: Math.max(
            Number(remoteCounter?.baselineSequence || 0),
            localState.baselineSequence,
            committedSeq
          ),
          issuedNumbers: remoteIssuedNumbers,
          issuedByInvoiceId: remoteIssuedByInvoiceId,
          updatedAt: nowIso
        }),
        alreadyCommitted: true,
        existingInvoiceData: existingData
      };
    }

    // 2. If counter doc already has an allocation for this exact invoice.id, reuse it idempotently
    const existingRemoteAlloc = remoteIssuedByInvoiceId[invoice.id];
    if (existingRemoteAlloc && existingRemoteAlloc.invoiceNumber) {
      const committedNumber = existingRemoteAlloc.invoiceNumber;
      const committedSeq = Math.max(
        1,
        existingRemoteAlloc.sequence || parseInvoiceSequenceNumber(committedNumber),
        Number(remoteCounter?.lastSequence || 0)
      );
      remoteIssuedNumbers[committedNumber] = invoice.id;
      return {
        authoritativeInvoiceNumber: committedNumber,
        counterPayload: sanitizeData({
          storeId: cleanStoreId,
          lastSequence: committedSeq,
          baselineSequence: Math.max(
            Number(remoteCounter?.baselineSequence || 0),
            localState.baselineSequence,
            committedSeq
          ),
          issuedNumbers: remoteIssuedNumbers,
          issuedByInvoiceId: remoteIssuedByInvoiceId,
          updatedAt: nowIso
        }),
        alreadyCommitted: false
      };
    }

    // 3. Gather all numbers and sequences already claimed by OTHER invoices (remote + local)
    const knownNumbersExcludingSelf = new Set<string>();
    for (const [num, ownerId] of Object.entries(remoteIssuedNumbers)) {
      if (ownerId && ownerId !== invoice.id) {
        knownNumbersExcludingSelf.add(num);
      }
    }
    for (const [num, ownerId] of Object.entries(localState.issuedNumbers)) {
      if (ownerId && ownerId !== invoice.id) {
        knownNumbersExcludingSelf.add(num);
      }
    }

    let maxSeqExcludingSelf = Math.max(
      0,
      Number(remoteCounter?.lastSequence || 0),
      Number(remoteCounter?.baselineSequence || 0),
      localState.baselineSequence
    );
    for (const [invId, info] of Object.entries(remoteIssuedByInvoiceId)) {
      if (invId !== invoice.id && Number.isFinite(info.sequence) && info.sequence > maxSeqExcludingSelf) {
        maxSeqExcludingSelf = info.sequence;
      }
    }
    for (const [invId, info] of Object.entries(localState.issuedByInvoiceId)) {
      if (invId !== invoice.id && Number.isFinite(info.sequence) && info.sequence > maxSeqExcludingSelf) {
        maxSeqExcludingSelf = info.sequence;
      }
    }

    const dateKey = getInvoiceDateKey(invoice.date);
    const requestedNumber = (invoice.invoiceNumber || '').trim();
    const requestedSeq = parseInvoiceSequenceNumber(requestedNumber);

    let nextSeq = maxSeqExcludingSelf + 1;
    if (
      requestedSeq > maxSeqExcludingSelf &&
      requestedNumber &&
      !knownNumbersExcludingSelf.has(requestedNumber)
    ) {
      nextSeq = requestedSeq;
    }

    let candidateNumber = formatStoreInvoiceNumber(dateKey, nextSeq);
    while (knownNumbersExcludingSelf.has(candidateNumber)) {
      nextSeq += 1;
      candidateNumber = formatStoreInvoiceNumber(dateKey, nextSeq);
    }

    remoteIssuedNumbers[candidateNumber] = invoice.id;
    remoteIssuedByInvoiceId[invoice.id] = {
      invoiceNumber: candidateNumber,
      sequence: nextSeq,
      updatedAt: nowIso
    };

    const tempStateForPrune: StoreInvoiceCounterState = {
      storeId: cleanStoreId,
      lastSequence: nextSeq,
      baselineSequence: Math.max(
        Number(remoteCounter?.baselineSequence || 0),
        localState.baselineSequence,
        nextSeq
      ),
      issuedNumbers: remoteIssuedNumbers,
      issuedByInvoiceId: remoteIssuedByInvoiceId,
      updatedAt: nowIso
    };
    pruneCounterMaps(tempStateForPrune);

    return {
      authoritativeInvoiceNumber: candidateNumber,
      counterPayload: sanitizeData(tempStateForPrune),
      alreadyCommitted: false
    };
  }

  private async commitInvoiceAtomic(storeId: string, invoice: POSInvoice): Promise<string> {
    const cleanStoreId = storeId || invoice.storeId || 'store-1';
    if (!invoice.invoiceNumber) {
      invoice.invoiceNumber = reserveStoreInvoiceNumber(cleanStoreId, invoice.id, invoice.date);
    }

    const committedNumber = await this.runFirestoreTransactionWithRetry(
      cleanStoreId,
      async (transaction) => {
        const nowIso = new Date().toISOString();
        const counterRef = doc(db, 'stores', cleanStoreId, 'counters', 'invoiceSequence');
        const invRef = doc(db, 'stores', cleanStoreId, 'invoices', invoice.id);

        const [counterSnap, invSnap] = await Promise.all([
          transaction.get(counterRef),
          transaction.get(invRef)
        ]);

        const {
          authoritativeInvoiceNumber,
          counterPayload,
          alreadyCommitted
        } = this.resolveAuthoritativeInvoiceNumberInTx(
          cleanStoreId,
          invoice,
          counterSnap,
          invSnap,
          nowIso
        );

        transaction.set(counterRef, counterPayload, { merge: true });

        if (!alreadyCommitted) {
          transaction.set(
            invRef,
            sanitizeData({
              ...invoice,
              invoiceNumber: authoritativeInvoiceNumber,
              totalAmount: invoice.grandTotal,
              storeId: cleanStoreId,
              updatedAt: nowIso
            }),
            { merge: true }
          );
        }

        return authoritativeInvoiceNumber;
      }
    );

    invoice.invoiceNumber = committedNumber;
    commitStoreInvoiceNumber(cleanStoreId, invoice.id, committedNumber);
    return committedNumber;
  }

  // POS Invoice & Transactional atomic sales
  public async syncInvoice(storeId: string, invoice: POSInvoice): Promise<void> {
    this.notifyFeedback('saving', 'Recording invoice...');
    const cleanStoreId = storeId || invoice.storeId || 'store-1';
    if (!invoice.invoiceNumber) {
      invoice.invoiceNumber = reserveStoreInvoiceNumber(cleanStoreId, invoice.id, invoice.date);
    }
    try {
      await this.commitInvoiceAtomic(cleanStoreId, invoice);
      this.notifyFeedback('saved', 'Invoice saved');
    } catch (err) {
      const sanitized = sanitizeData({
        ...invoice,
        totalAmount: invoice.grandTotal,
        storeId: cleanStoreId,
        updatedAt: new Date().toISOString()
      });
      queueOfflineAction({
        collection: 'invoices',
        action: 'create',
        docId: invoice.id,
        data: sanitized
      });
      if (sanitized.invoiceNumber) {
        invoice.invoiceNumber = sanitized.invoiceNumber;
      }
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

  private async executePOSSaleTransaction(
    cleanStoreId: string,
    invoice: POSInvoice,
    requestedByProduct: Map<string, { quantity: number; productName: string }>,
    updatedProductsMap: Map<string, Product>,
    updatedCustomer?: CustomerProfile,
    auditLog?: AuditLog,
    previousTentativeNumber?: string
  ): Promise<{
    products: Product[];
    customer?: CustomerProfile;
    auditLog: AuditLog;
    invoiceNumber: string;
    alreadyCommitted: boolean;
  }> {
    const effectiveAuditLog: AuditLog = auditLog || {
      id: `log-${invoice.id}`,
      user: invoice.cashierName || invoice.createdBy || 'POS Cashier',
      role: 'client',
      action: 'POS Invoice Created',
      details: `Invoice ${invoice.invoiceNumber} created for ${invoice.customerName || 'Walk-in Retail Customer'} (₹${invoice.grandTotal})`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      ipAddress: '127.0.0.1',
      status: 'success'
    };

    return this.runFirestoreTransactionWithRetry(
      cleanStoreId,
      async (transaction) => {
        const nowIso = new Date().toISOString();
        const productEntries = Array.from(requestedByProduct.entries());

        // Phase 1: Read counter document, invoice document, all product documents, and customer document before any writes
        const counterRef = doc(db, 'stores', cleanStoreId, 'counters', 'invoiceSequence');
        const invRef = doc(db, 'stores', cleanStoreId, 'invoices', invoice.id);
        const productRefs = productEntries.map(([productId]) =>
          doc(db, 'stores', cleanStoreId, 'products', productId)
        );
        const customerRef = updatedCustomer?.id
          ? doc(db, 'stores', cleanStoreId, 'customers', updatedCustomer.id)
          : null;

        const [counterSnap, invSnap, productSnaps, customerSnap] = await Promise.all([
          transaction.get(counterRef),
          transaction.get(invRef),
          Promise.all(productRefs.map(ref => transaction.get(ref))),
          customerRef ? transaction.get(customerRef) : Promise.resolve(null)
        ]);

        // Phase 2: Idempotency check — if this exact invoice.id was already committed in Firestore, return existing state without re-deducting stock, re-updating customer, or re-incrementing counter
        if (invSnap && typeof invSnap.exists === 'function' && invSnap.exists()) {
          const {
            authoritativeInvoiceNumber,
            counterPayload
          } = this.resolveAuthoritativeInvoiceNumberInTx(
            cleanStoreId,
            invoice,
            counterSnap,
            invSnap,
            nowIso
          );
          const remoteCounterData =
            counterSnap && typeof counterSnap.exists === 'function' && counterSnap.exists()
              ? (counterSnap.data() as Partial<StoreInvoiceCounterState>)
              : undefined;
          if (!remoteCounterData?.issuedByInvoiceId?.[invoice.id]) {
            transaction.set(counterRef, counterPayload, { merge: true });
          }

          const existingProducts: Product[] = [];
          for (let i = 0; i < productEntries.length; i++) {
            const [productId] = productEntries[i];
            const pSnap = productSnaps[i];
            const fallbackProd = updatedProductsMap.get(productId);
            if (pSnap.exists()) {
              existingProducts.push({
                ...(fallbackProd || (pSnap.data() as Product)),
                ...(pSnap.data() as Product),
                id: productId
              });
            } else if (fallbackProd) {
              existingProducts.push(fallbackProd);
            }
          }

          const existingCustomer =
            customerSnap && typeof customerSnap.exists === 'function' && customerSnap.exists()
              ? ({
                  ...(updatedCustomer || {}),
                  ...(customerSnap.data() as CustomerProfile),
                  id: updatedCustomer?.id || (customerSnap.data() as CustomerProfile).id
                } as CustomerProfile)
              : updatedCustomer;

          const updatedDetails =
            previousTentativeNumber &&
            previousTentativeNumber !== authoritativeInvoiceNumber &&
            effectiveAuditLog.details.includes(previousTentativeNumber)
              ? effectiveAuditLog.details.replace(previousTentativeNumber, authoritativeInvoiceNumber)
              : effectiveAuditLog.details;

          return {
            products: existingProducts,
            customer: existingCustomer,
            auditLog: {
              ...effectiveAuditLog,
              details: updatedDetails
            },
            invoiceNumber: authoritativeInvoiceNumber,
            alreadyCommitted: true
          };
        }

        // Phase 3: Validate stock against authoritative Firestore documents before allocating/writing
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

        // Phase 4: Resolve authoritative unique invoiceNumber from Firestore counter state
        const {
          authoritativeInvoiceNumber,
          counterPayload
        } = this.resolveAuthoritativeInvoiceNumberInTx(
          cleanStoreId,
          invoice,
          counterSnap,
          invSnap,
          nowIso
        );

        // Prepare authoritative customer payload if linked
        let committedCustomer: CustomerProfile | undefined = undefined;
        let committedCustomerStoreId = cleanStoreId;
        if (updatedCustomer && customerRef) {
          if (customerSnap && typeof customerSnap.exists === 'function' && customerSnap.exists()) {
            const remoteCust = customerSnap.data() as CustomerProfile & { storeId?: string };
            const remotePurchases = Number(remoteCust.totalPurchases ?? 0);
            const remoteLoyalty = Number(remoteCust.loyaltyPoints ?? 0);
            const remoteCredit = Number(remoteCust.creditBalance ?? 0);
            const redeemed = Number(invoice.loyaltyPointsRedeemed ?? 0);
            const earned = Number(invoice.loyaltyPointsEarned ?? 0);
            const creditDelta = invoice.paymentMethod === 'credit' ? Number(invoice.grandTotal ?? 0) : 0;

            committedCustomerStoreId = remoteCust.storeId || cleanStoreId;
            committedCustomer = {
              ...updatedCustomer,
              ...remoteCust,
              id: updatedCustomer.id,
              name: remoteCust.name || updatedCustomer.name || invoice.customerName || 'Walk-in Customer',
              phone: remoteCust.phone || updatedCustomer.phone || invoice.customerPhone || '+91 00000 00000',
              totalPurchases: Number((remotePurchases + Number(invoice.grandTotal ?? 0)).toFixed(2)),
              loyaltyPoints: Math.max(0, remoteLoyalty - redeemed + earned),
              creditBalance: Number((remoteCredit + creditDelta).toFixed(2))
            };
          } else {
            committedCustomer = {
              ...updatedCustomer,
              id: updatedCustomer.id,
              name: updatedCustomer.name || invoice.customerName || 'Walk-in Customer',
              phone: updatedCustomer.phone || invoice.customerPhone || '+91 00000 00000'
            };
          }
        }

        // Prepare authoritative audit log payload with final invoiceNumber
        const updatedAuditDetails =
          previousTentativeNumber &&
          previousTentativeNumber !== authoritativeInvoiceNumber &&
          effectiveAuditLog.details.includes(previousTentativeNumber)
            ? effectiveAuditLog.details.replace(previousTentativeNumber, authoritativeInvoiceNumber)
            : effectiveAuditLog.details.includes(authoritativeInvoiceNumber)
            ? effectiveAuditLog.details
            : `Invoice ${authoritativeInvoiceNumber} — ${effectiveAuditLog.details}`;

        const committedAuditLog: AuditLog = {
          ...effectiveAuditLog,
          id: effectiveAuditLog.id || `log-${invoice.id}`,
          action: effectiveAuditLog.action || 'POS Invoice Created',
          timestamp: effectiveAuditLog.timestamp || nowIso.replace('T', ' ').slice(0, 19),
          details: updatedAuditDetails
        };

        // Phase 5: Perform all 5 POS sale writes atomically inside the single transaction
        // 1. Update store invoice sequence counter
        transaction.set(counterRef, counterPayload, { merge: true });

        // 2. Affected products stock deduction
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
                storeId: cleanStoreId,
                updatedAt: nowIso
              }),
              { merge: true }
            );
          }
        }

        // 3. Invoice with authoritative unique invoiceNumber
        transaction.set(
          invRef,
          sanitizeData({
            ...invoice,
            invoiceNumber: authoritativeInvoiceNumber,
            totalAmount: invoice.grandTotal,
            storeId: cleanStoreId,
            updatedAt: nowIso
          }),
          { merge: true }
        );

        // 4. Customer profile if linked (Use minimal field update when doc exists so Crew POS sales satisfy strict affectedKeys rule)
        if (committedCustomer && customerRef) {
          const customerExistsInCloud = Boolean(
            customerSnap && typeof customerSnap.exists === 'function' && customerSnap.exists()
          );
          if (customerExistsInCloud) {
            transaction.update(
              customerRef,
              sanitizeData({
                totalPurchases: committedCustomer.totalPurchases,
                loyaltyPoints: committedCustomer.loyaltyPoints,
                creditBalance: committedCustomer.creditBalance,
                updatedAt: nowIso
              })
            );
          } else {
            transaction.set(
              customerRef,
              sanitizeData({
                ...committedCustomer,
                storeId: committedCustomerStoreId,
                updatedAt: nowIso
              }),
              { merge: true }
            );
          }
        }

        // 5. Audit Log (always committed atomically with the sale)
        const lRef = doc(db, 'stores', cleanStoreId, 'auditLogs', committedAuditLog.id);
        transaction.set(
          lRef,
          sanitizeData({
            ...committedAuditLog,
            storeId: cleanStoreId
          })
        );

        return {
          products: nextProductsToCommit.map(item => item.mergedProduct),
          customer: committedCustomer,
          auditLog: committedAuditLog,
          invoiceNumber: authoritativeInvoiceNumber,
          alreadyCommitted: false
        };
      }
    );
  }

  // Atomic POS checkout write: validates stock, guarantees store-scoped invoiceNumber uniqueness, and updates invoice, product stocks, customer loyalty, and audit log together via Firestore transaction
  public async syncPOSSaleAtomic(
    storeId: string,
    invoice: POSInvoice,
    updatedProducts: Product[],
    updatedCustomer?: CustomerProfile,
    auditLog?: AuditLog
  ): Promise<Product[]> {
    this.notifyFeedback('saving', 'Processing transaction...');
    const cleanStoreId = storeId || invoice.storeId || 'store-1';

    // 1. Aggregate requested quantities per productId from invoice items
    const requestedByProduct = new Map<string, { quantity: number; productName: string }>();
    for (const item of invoice.items || []) {
      const qty = Number(item.quantity);
      if (!Number.isFinite(qty) || qty <= 0) {
        releaseStoreInvoiceNumberReservation(cleanStoreId, invoice.id);
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
        releaseStoreInvoiceNumberReservation(cleanStoreId, invoice.id);
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

    // Ensure invoice has a local tentative reservation before entering transaction
    const previousTentativeNumber = invoice.invoiceNumber;
    if (!invoice.invoiceNumber) {
      invoice.invoiceNumber = reserveStoreInvoiceNumber(cleanStoreId, invoice.id, invoice.date);
    }

    const effectiveAuditLog: AuditLog = auditLog || {
      id: `log-${invoice.id}`,
      user: invoice.cashierName || invoice.createdBy || 'POS Cashier',
      role: 'client',
      action: 'POS Invoice Created',
      details: `Invoice ${invoice.invoiceNumber} created for ${invoice.customerName || 'Walk-in Retail Customer'} (₹${invoice.grandTotal})`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      ipAddress: '127.0.0.1',
      status: 'success'
    };

    try {
      const txResult = await this.executePOSSaleTransaction(
        cleanStoreId,
        invoice,
        requestedByProduct,
        updatedProductsMap,
        updatedCustomer,
        effectiveAuditLog,
        previousTentativeNumber
      );

      // Commit authoritative invoiceNumber, customer state, and auditLog back to caller objects and local counter state
      if (txResult.invoiceNumber) {
        invoice.invoiceNumber = txResult.invoiceNumber;
        commitStoreInvoiceNumber(cleanStoreId, invoice.id, txResult.invoiceNumber);
      }
      if (updatedCustomer && txResult.customer) {
        Object.assign(updatedCustomer, txResult.customer);
      }
      if (auditLog && txResult.auditLog) {
        Object.assign(auditLog, txResult.auditLog);
      }

      this.notifyFeedback('saved', 'Transaction saved');
      return txResult.products;
    } catch (err: any) {
      // Never queue insufficient-stock or validation rejections into the offline queue; release reserved invoice number
      if (isInsufficientStockError(err)) {
        releaseStoreInvoiceNumberReservation(cleanStoreId, invoice.id);
        this.notifyFeedback('error', err.message);
        throw err;
      }

      const isOfflineError =
        !this.isOnline ||
        (typeof navigator !== 'undefined' && !navigator.onLine) ||
        err?.code === 'unavailable';

      if (!isOfflineError) {
        releaseStoreInvoiceNumberReservation(cleanStoreId, invoice.id);
        this.notifyFeedback('error', err?.message || 'Transaction failed.');
        throw err;
      }

      console.warn('[FirestoreSync] POS sale atomic write failed while offline, queuing atomic bundle:', err);
      const nowIso = new Date().toISOString();
      // Ensure unique offline invoice number in local store counter & offline queue
      const offlineInvoiceNumber = reserveStoreInvoiceNumber(
        cleanStoreId,
        invoice.id,
        invoice.date
      );
      if (
        effectiveAuditLog &&
        invoice.invoiceNumber &&
        invoice.invoiceNumber !== offlineInvoiceNumber &&
        effectiveAuditLog.details.includes(invoice.invoiceNumber)
      ) {
        effectiveAuditLog.details = effectiveAuditLog.details.replace(
          invoice.invoiceNumber,
          offlineInvoiceNumber
        );
      }
      invoice.invoiceNumber = offlineInvoiceNumber;
      if (auditLog) {
        Object.assign(auditLog, effectiveAuditLog);
      }

      // Queue POS sale with embedded atomic bundle so flushQueue commits all 5 entities in a single Firestore transaction upon reconnection
      queueOfflineAction({
        collection: 'invoices',
        action: 'create',
        docId: invoice.id,
        data: sanitizeData({
          ...invoice,
          invoiceNumber: offlineInvoiceNumber,
          totalAmount: invoice.grandTotal,
          storeId: cleanStoreId,
          updatedAt: nowIso,
          _posSaleBundle: {
            updatedProducts: updatedProducts.map(p => sanitizeData({ ...p, storeId: cleanStoreId })),
            updatedCustomer: updatedCustomer
              ? sanitizeData({ ...updatedCustomer, storeId: cleanStoreId })
              : undefined,
            auditLog: sanitizeData({ ...effectiveAuditLog, storeId: cleanStoreId })
          }
        })
      });
      for (const p of updatedProducts) {
        queueOfflineAction({
          collection: 'products',
          action: 'update',
          docId: p.id,
          data: sanitizeData({
            ...p,
            storeId: cleanStoreId,
            updatedAt: nowIso,
            _parentInvoiceId: invoice.id
          })
        });
      }
      if (updatedCustomer) {
        queueOfflineAction({
          collection: 'customers',
          action: 'update',
          docId: updatedCustomer.id,
          data: sanitizeData({
            ...updatedCustomer,
            storeId: cleanStoreId,
            updatedAt: nowIso,
            _parentInvoiceId: invoice.id
          })
        });
      }
      queueOfflineAction({
        collection: 'auditLogs',
        action: 'create',
        docId: effectiveAuditLog.id,
        data: sanitizeData({
          ...effectiveAuditLog,
          storeId: cleanStoreId,
          _parentInvoiceId: invoice.id
        })
      });
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
    const atomicallyHandledInvoiceIds = new Set<string>();
    const atomicallyFailedInvoiceIds = new Set<string>();

    for (const item of queue) {
      const parentInvoiceId = item.data?._parentInvoiceId;
      if (parentInvoiceId) {
        if (atomicallyHandledInvoiceIds.has(parentInvoiceId)) {
          processed++;
          continue;
        }
        if (atomicallyFailedInvoiceIds.has(parentInvoiceId)) {
          remaining.push(item);
          continue;
        }
      }

      try {
        const itemStoreId = item.data?.storeId || this.activeStoreId;
        if (item.collection === 'invoices' && item.action !== 'delete' && item.data) {
          const { _posSaleBundle, _parentInvoiceId: _ignoredParent, ...rawInvoiceData } = item.data;
          const invoicePayload: POSInvoice = {
            ...(rawInvoiceData as POSInvoice),
            id: item.docId || rawInvoiceData.id,
            storeId: itemStoreId
          };

          if (_posSaleBundle && typeof _posSaleBundle === 'object') {
            const reqMap = new Map<string, { quantity: number; productName: string }>();
            for (const line of invoicePayload.items || []) {
              const qty = Number(line.quantity);
              if (Number.isFinite(qty) && qty > 0) {
                const prev = reqMap.get(line.productId);
                reqMap.set(line.productId, {
                  quantity: (prev?.quantity || 0) + qty,
                  productName: line.productName || prev?.productName || line.productId
                });
              }
            }
            const prodList: Product[] = Array.isArray(_posSaleBundle.updatedProducts)
              ? _posSaleBundle.updatedProducts
              : [];
            const prodMap = new Map<string, Product>(prodList.map(p => [p.id, p]));
            const txRes = await this.executePOSSaleTransaction(
              itemStoreId,
              invoicePayload,
              reqMap,
              prodMap,
              _posSaleBundle.updatedCustomer as CustomerProfile | undefined,
              _posSaleBundle.auditLog as AuditLog | undefined,
              invoicePayload.invoiceNumber
            );
            commitStoreInvoiceNumber(itemStoreId, invoicePayload.id, txRes.invoiceNumber);
            atomicallyHandledInvoiceIds.add(invoicePayload.id);
            processed++;
            continue;
          }

          await this.commitInvoiceAtomic(itemStoreId, invoicePayload);
          processed++;
          continue;
        }

        let docRef;
        if (item.collection === 'stores') {
          docRef = doc(db, 'stores', item.docId);
        } else {
          docRef = doc(db, 'stores', itemStoreId, item.collection, item.docId);
        }

        if (item.action === 'delete') {
          await deleteDoc(docRef);
        } else {
          const { _parentInvoiceId: _pId, ...cleanPayload } = item.data || {};
          await setDoc(docRef, cleanPayload, { merge: true });
        }
        processed++;
      } catch (err) {
        if (item.collection === 'invoices' && item.data?._posSaleBundle) {
          const failedInvId = item.docId || item.data?.id;
          if (failedInvId) {
            atomicallyFailedInvoiceIds.add(failedInvId);
          }
          // Do not keep permanently rejected insufficient-stock sales in the queue
          if (isInsufficientStockError(err)) {
            if (failedInvId) {
              releaseStoreInvoiceNumberReservation(
                item.data?.storeId || this.activeStoreId,
                failedInvId
              );
              atomicallyHandledInvoiceIds.add(failedInvId);
              atomicallyFailedInvoiceIds.delete(failedInvId);
            }
            continue;
          }
        }
        remaining.push(item);
      }
    }

    saveOfflineQueue(remaining);
    return { processed, remaining: remaining.length };
  }
}

export const syncManager = new FirestoreSyncManager();
