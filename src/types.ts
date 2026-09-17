export type ActiveModule = 'retailer' | 'wholesaler' | 'admin';

export type UserRole = 'owner' | 'manager' | 'inventory_staff' | 'wholesaler_admin' | 'platform_admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  storeId?: string;
  wholesalerId?: string;
  avatar?: string;
  permissions: string[];
  emailVerified?: boolean;
  phoneVerified?: boolean;
  linkedProviders?: string[];
  passwordSynchronized?: boolean;
  isRealAuth?: boolean;
  firebaseUid?: string;
}

export interface Store {
  id: string;
  name: string;
  ownerName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  gstin: string;
  rating: number;
  reviewCount: number;
  timings: string;
  image: string;
  latitude: number;
  longitude: number;
  isOnline: boolean;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  unit: string; // e.g., 'pcs', 'kg', 'ltr', 'pack', 'box'
  purchasePrice: number;
  sellingPrice: number;
  mrp: number;
  stock: number;
  minThreshold: number;
  barcode: string;
  qrCode: string;
  expiryDate?: string;
  batchNumber?: string;
  warehouseLocation?: string;
  sharedWithWholesalers: boolean;
  image?: string;
  description?: string;
  taxRate: number; // percentage, e.g. 18, 12, 5
  storeId: string;
}

export interface SupplierPerformanceMetrics {
  avgLeadTimeDays: number;
  fulfillmentSuccessRate: number; // e.g. 98.4%
  onTimeDispatchRate: number; // e.g. 96.8%
  accuracyRate: number; // e.g. 99.2%
  totalOrdersFulfilled: number;
  qualityRating: number;
  tierStatus: 'Platinum' | 'Gold' | 'Silver' | 'Standard';
  leadTimeCategoryBreakdown?: { category: string; avgLeadTimeDays: number; fulfillmentRate: number }[];
}

export interface Wholesaler {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  gstin: string;
  address: string;
  rating: number;
  categories: string[];
  minimumOrderValue: number;
  minOrderValue?: number;
  performance?: SupplierPerformanceMetrics;
  city?: string;
  category?: string;
  deliveryDays?: number;
  isVerified?: boolean;
}

export interface WholesalerProduct {
  id: string;
  wholesalerId: string;
  name: string;
  category: string;
  brand: string;
  unit: string;
  wholesalePrice: number;
  mrp: number;
  stockAvailable: number;
  moq: number; // minimum order quantity
  tierPrices?: { minQty: number; price: number }[];
  image?: string;
}

export type RetailerWholesalerStatus = 'pending' | 'connected' | 'rejected' | 'revoked';

export interface RetailerWholesalerConnection {
  id: string;
  retailerStoreId: string;
  retailerName: string;
  wholesalerId: string;
  wholesalerName: string;
  status: RetailerWholesalerStatus;
  sharedProductIds: string[];
  connectedSince?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  discountPercentage: number;
  discountFlat: number;
}

export type PaymentMethod = 'cash' | 'card' | 'upi' | 'split';

export interface SplitPaymentDetails {
  cashAmount: number;
  cardAmount: number;
  upiAmount: number;
}

export interface CustomerProfile {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  creditBalance: number;
  loyaltyPoints: number;
  phoneVerified: boolean;
  totalPurchases: number;
  savedAddresses?: string[];
  segment?: 'VIP / Corporate' | 'Wholesale Buyers' | 'Regular Retail' | 'B2B Clients' | string;
  assignedTemplateId?: string;
}

export interface POSInvoice {
  id: string;
  invoiceNumber: string;
  storeId: string;
  storeName: string;
  storeGSTIN: string;
  storeAddress: string;
  customerName: string;
  customerPhone: string;
  date: string;
  isGSTInvoice: boolean;
  templateId?: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    discount: number;
    taxRate: number;
    taxAmount: number;
    total: number;
  }[];
  subtotal: number;
  discountTotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  grandTotal: number;
  paymentMethod: PaymentMethod;
  splitDetails?: SplitPaymentDetails;
  upiTxnRef?: string;
  loyaltyPointsEarned: number;
  loyaltyPointsRedeemed: number;
}

export interface CurrencyInfo {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  country: string;
  decimals: number;
  defaultTaxRate?: number;
  taxLabel?: string;
}

export interface InternationalTradeSettings {
  primaryCurrency: string;
  enableDualCurrency: boolean;
  secondaryCurrency?: string;
  fxSpreadPercentage?: number;
  showExchangeRateOnBill: boolean;
  showSwiftIban: boolean;
  swiftCode?: string;
  ibanNumber?: string;
  bankName?: string;
  beneficiaryName?: string;
  incoterms?: 'EXW' | 'FOB' | 'CIF' | 'CIP' | 'DAP' | 'DDP' | string;
  portOfLoadingOrDischarge?: string;
  countryOfOrigin?: string;
  customsTariffHSN?: string;
  vatTaxRegistrationNumber?: string;
}

export interface InvoiceTemplateBranding {
  logoUrl?: string;
  storeDisplayName?: string;
  headerTagline?: string;
  primaryColor: string;
  accentColor: string;
  footerNote: string;
  termsAndConditions: string;
}

export interface InvoiceTemplateVariableFields {
  showGSTIN: boolean;
  showCustomerPhone: boolean;
  showLoyaltyPoints: boolean;
  showUPIRef: boolean;
  showBarcodeQR: boolean;
  showItemTaxBreakdown: boolean;
  showItemDiscount: boolean;
  showPaymentSplitDetails: boolean;
  showInternationalTradeDetails?: boolean;
  showDualCurrencySummary?: boolean;
  customHeaderFieldLabel?: string;
  customHeaderFieldValue?: string;
}

export interface InvoiceTemplateColumnSettings {
  showSNo: boolean;
  showItemName: boolean;
  showItemDesc?: boolean;
  showHSN: boolean;
  showBatchNo?: boolean;
  showExpDate?: boolean;
  showMfgDate?: boolean;
  showQuantity: boolean;
  showMRP?: boolean;
  showUnitPrice: boolean;
  showDiscount: boolean;
  showTax: boolean;
  showAmount: boolean;
}

export interface InvoiceTemplateAdditionalInfo {
  challanNo?: string;
  poNo?: string;
  ewayBillNo?: string;
  vehicleNo?: string;
  dueDate?: string;
  panNo?: string;
  bankName?: string;
  accountNo?: string;
  ifscCode?: string;
  accountHolder?: string;
  upiId?: string;
  showUPIQR?: boolean;
  showBankDetails?: boolean;
  showTerms?: boolean;
  showSignatureBlock?: boolean;
  showSavingsHighlight?: boolean;
  showAmountInWords?: boolean;
  showDecorativeBorder?: boolean;
  documentType?: 'TAX INVOICE' | 'BILL OF SUPPLY' | 'EXPORT INVOICE' | 'RETAIL BILL' | string;
  recipientType?: 'ORIGINAL FOR RECIPIENT' | 'DUPLICATE FOR TRANSPORTER' | 'TRIPLICATE FOR SUPPLIER' | string;
  previousBalance?: number;
  receivedAmount?: number;
}

export interface InvoiceTemplate {
  id: string;
  name: string;
  targetSegment: 'VIP / Corporate' | 'Wholesale Buyers' | 'Regular Retail' | 'B2B Clients' | 'All Segments';
  paperSize: 'a4' | 'thermal' | 'a5' | 'a5_landscape' | 'thermal_2inch' | 'thermal_3inch';
  templateStyle?: 'a4_luxury_gold' | 'a4_modern_custom' | 'a5_compact_box' | 'a5_hardware_transport' | 'thermal_2inch' | 'thermal_3inch' | 'standard';
  isDefault: boolean;
  branding: InvoiceTemplateBranding;
  variableFields: InvoiceTemplateVariableFields;
  columnSettings?: InvoiceTemplateColumnSettings;
  additionalInfo?: InvoiceTemplateAdditionalInfo;
  internationalSettings?: InternationalTradeSettings;
  createdAt: string;
}

export type RestockStatus = 'suggested' | 'quotation_sent' | 'po_created' | 'dispatched' | 'delivered' | 'rejected';

export interface RestockOrder {
  id: string;
  retailerStoreId: string;
  retailerName: string;
  wholesalerId: string;
  wholesalerName: string;
  productId: string;
  productName: string;
  suggestedQty: number;
  quotedQty?: number;
  quotedUnitPrice?: number;
  totalQuotedAmount?: number;
  status: RestockStatus;
  createdAt: string;
  deliveryDate?: string;
  trackingNumber?: string;
  notes?: string;
}

export type CustomerOrderStatus = 'placed' | 'confirmed' | 'ready_for_pickup' | 'out_for_delivery' | 'completed' | 'cancelled';

export interface CustomerOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  storeId: string;
  storeName: string;
  orderType: 'pickup' | 'delivery';
  deliveryAddress?: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    image?: string;
  }[];
  totalAmount: number;
  paymentStatus: 'paid_online' | 'pay_at_store' | 'cod';
  paymentMethod?: string;
  orderStatus: CustomerOrderStatus;
  createdAt: string;
  pickupQrCode: string;
}

export interface Employee {
  id: string;
  storeId: string;
  name: string;
  role: 'owner' | 'manager' | 'inventory_staff' | 'cashier' | string;
  email: string;
  phone: string;
  permissions: {
    inventoryEdit: boolean;
    reports: boolean;
    employeeManagement: boolean;
    restockOrders: boolean;
  };
  status: 'active' | 'inactive';
  pin?: string;
  shift?: string;
  active?: boolean;
  totalSalesHandled?: number;
  twoFactorEnabled?: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  category: 'low_stock' | 'restock' | 'customer_order' | 'payment' | 'security' | 'system';
  timestamp: string;
  read: boolean;
  linkModule?: ActiveModule;
}

export interface AuditLog {
  id: string;
  user: string;
  role: string;
  action: string;
  details: string;
  timestamp: string;
  ipAddress: string;
  status: 'success' | 'warning' | 'error';
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  tier?: 'starter' | 'growth' | 'enterprise' | string;
  priceMonthly: number;
  priceYearly: number;
  modulesIncluded: string[];
  activeStoresCount: number;
  maxStores?: number;
  maxProducts?: number;
  status: 'active' | 'trial' | 'expired';
  renewalDate: string;
}

export interface SaveFeedback {
  status: 'idle' | 'saving' | 'saved' | 'error';
  message: string;
  timestamp: number;
}

export interface CloudSyncState {
  status: 'synced' | 'syncing' | 'offline' | 'error' | 'pending';
  lastSyncedAt: string | null;
  pendingCount: number;
  lastError: string | null;
  databaseId: string;
  syncedCounts: {
    products: number;
    customers: number;
    invoices: number;
    restockOrders: number;
    customerOrders: number;
    wholesalers?: number;
    employees?: number;
  };
}

export interface OfflineSyncItem {
  id: string;
  collection: 'products' | 'customers' | 'invoices' | 'restockOrders' | 'customerOrders' | 'auditLogs' | 'wholesalers' | 'employees' | 'stores';
  action: 'create' | 'update' | 'delete';
  docId: string;
  data?: any;
  timestamp: string;
}

