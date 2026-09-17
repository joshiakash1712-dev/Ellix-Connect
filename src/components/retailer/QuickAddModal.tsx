import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Plus,
  Package,
  ShoppingCart,
  DollarSign,
  Barcode,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Tag,
  Layers,
  Phone,
  User,
  CreditCard,
  Zap,
  ArrowRight
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product, PaymentMethod } from '../../types';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'product' | 'sale';
}

const CATEGORIES = [
  'Groceries & Staples',
  'Dairy & Eggs',
  'Beverages & Juices',
  'Snacks & Packaged Foods',
  'Personal Care & Hygiene',
  'Household & Cleaning',
  'Spices & Condiments',
  'Fresh Produce'
];

const UNITS = ['pcs', 'kg', 'g', 'ltr', 'ml', 'pack', 'box'];

export const QuickAddModal: React.FC<QuickAddModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'product'
}) => {
  const {
    activeStore,
    products,
    addProduct,
    createInvoice,
    customers,
    currentUser
  } = useStore();

  const [activeTab, setActiveTab] = useState<'product' | 'sale'>(defaultTab);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // ----------------------------------------------------
  // Product Form State
  // ----------------------------------------------------
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [brand, setBrand] = useState('Standard');
  const [unit, setUnit] = useState('pcs');
  const [sellingPrice, setSellingPrice] = useState<string>('99');
  const [mrp, setMrp] = useState<string>('120');
  const [purchasePrice, setPurchasePrice] = useState<string>('75');
  const [stock, setStock] = useState<string>('50');
  const [minThreshold, setMinThreshold] = useState<string>('10');
  const [barcode, setBarcode] = useState('');
  const [taxRate, setTaxRate] = useState<number>(5);

  // ----------------------------------------------------
  // Quick Sale Form State
  // ----------------------------------------------------
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [saleQuantity, setSaleQuantity] = useState<number>(1);
  const [saleUnitPrice, setSaleUnitPrice] = useState<string>(
    products[0] ? products[0].sellingPrice.toString() : '100'
  );
  const [customerName, setCustomerName] = useState('Walk-in Customer');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');

  // Sync default tab if prop changes
  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab);
      setSuccessMessage(null);
      // Auto-generate a dummy barcode if empty
      if (!barcode) {
        setBarcode(`890${Math.floor(100000000 + Math.random() * 900000000)}`);
      }
    }
  }, [isOpen, defaultTab]);

  // When selected product changes in Quick Sale tab, auto update unit price
  const handleProductChange = (prodId: string) => {
    setSelectedProductId(prodId);
    const prod = products.find(p => p.id === prodId);
    if (prod) {
      setSaleUnitPrice(prod.sellingPrice.toString());
      setSaleQuantity(1);
    }
  };

  // Lookup customer when phone number typed
  const handlePhoneChange = (phone: string) => {
    setCustomerPhone(phone);
    if (phone.length >= 10) {
      const match = customers.find(c => c.phone.includes(phone) || phone.includes(c.phone));
      if (match) {
        setCustomerName(match.name);
      }
    }
  };

  // Generate a random EAN-13 barcode
  const handleGenerateBarcode = () => {
    setBarcode(`890${Math.floor(100000000 + Math.random() * 900000000)}`);
  };

  // Handle Add Product Submit
  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim()) return;

    const numSelling = parseFloat(sellingPrice) || 0;
    const numMrp = parseFloat(mrp) || numSelling;
    const numPurchase = parseFloat(purchasePrice) || Math.round(numSelling * 0.75);
    const numStock = parseInt(stock, 10) || 0;
    const numThreshold = parseInt(minThreshold, 10) || 5;

    const newProduct: Omit<Product, 'id'> = {
      name: productName.trim(),
      category,
      brand: brand.trim() || 'Standard',
      unit,
      sellingPrice: numSelling,
      mrp: numMrp,
      purchasePrice: numPurchase,
      stock: numStock,
      minThreshold: numThreshold,
      barcode: barcode || `890${Date.now()}`,
      qrCode: `PROD-${Date.now()}`,
      sharedWithWholesalers: true,
      taxRate,
      storeId: activeStore.id,
      description: `${productName.trim()} (${unit}) - Inwarded via Quick Add`
    };

    addProduct(newProduct);
    setSuccessMessage(`Product "${productName}" successfully added with ${numStock} ${unit} in stock!`);

    // Reset fields for next fast entry
    setProductName('');
    setSellingPrice('99');
    setMrp('120');
    setStock('50');
    setBarcode(`890${Math.floor(100000000 + Math.random() * 900000000)}`);

    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  // Handle Quick Sale Submit
  const handleQuickSaleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const product = products.find(p => p.id === selectedProductId);
    if (!product) return;

    const qty = Math.max(1, saleQuantity);
    const price = parseFloat(saleUnitPrice) || product.sellingPrice;
    const subtotal = price * qty;
    const effectiveTaxRate = product.taxRate || 5;
    const taxAmount = Math.round((subtotal * effectiveTaxRate) / 100);
    const grandTotal = subtotal + taxAmount;
    const cgst = Math.round(taxAmount / 2);
    const sgst = taxAmount - cgst;

    const invoiceItem = {
      productId: product.id,
      productName: product.name,
      quantity: qty,
      unitPrice: price,
      discount: 0,
      taxRate: effectiveTaxRate,
      taxAmount,
      total: grandTotal
    };

    createInvoice({
      storeId: activeStore.id,
      storeName: activeStore.name,
      storeGSTIN: activeStore.gstin || '27AABCE1234F1Z5',
      storeAddress: activeStore.address || 'Retail Center',
      customerName: customerName.trim() || 'Walk-in Customer',
      customerPhone: customerPhone.trim() || 'N/A',
      date: new Date().toISOString(),
      isGSTInvoice: true,
      items: [invoiceItem],
      subtotal,
      discountTotal: 0,
      cgst,
      sgst,
      igst: 0,
      totalTax: taxAmount,
      roundOff: 0,
      grandTotal,
      paymentMethod,
      loyaltyPointsEarned: Math.floor(grandTotal / 100),
      loyaltyPointsRedeemed: 0,
      cashierName: currentUser.name || 'Store Cashier'
    });

    setSuccessMessage(`Sale of ₹${grandTotal.toLocaleString()} logged for ${product.name} (Qty: ${qty})!`);
    setSaleQuantity(1);

    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  const selectedProduct = products.find(p => p.id === selectedProductId);
  const currentSaleSubtotal = (parseFloat(saleUnitPrice) || 0) * saleQuantity;
  const currentSaleTax = Math.round((currentSaleSubtotal * (selectedProduct?.taxRate || 5)) / 100);
  const currentSaleGrandTotal = currentSaleSubtotal + currentSaleTax;

  if (!isOpen) return null;

  return (
    <div
      id="quick-add-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 animate-in fade-in duration-200"
    >
      <motion.div
        id="quick-add-modal-content"
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="w-full max-w-lg rounded-2xl glass-panel shadow-2xl overflow-hidden flex flex-col max-h-[92vh] relative"
      >
        {/* Subtle brand gradient backdrop BEHIND the glass modal */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-emerald-600/15 via-slate-900/60 to-teal-600/15 pointer-events-none" />

        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-500/20">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>Quick Action Terminal</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Rapid POS
                </span>
              </h2>
              <p className="text-xs text-slate-400">Add inventory SKU or record instant POS checkout</p>
            </div>
          </div>

          <button
            id="quick-add-close-btn"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="p-2.5 bg-slate-950 border-b border-slate-800">
          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
            <button
              id="tab-btn-quick-product"
              type="button"
              onClick={() => {
                setActiveTab('product');
                setSuccessMessage(null);
              }}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'product'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>+ Add New Product</span>
            </button>

            <button
              id="tab-btn-quick-sale"
              type="button"
              onClick={() => {
                setActiveTab('sale');
                setSuccessMessage(null);
              }}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'sale'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>⚡ Log Quick Sale</span>
            </button>
          </div>
        </div>

        {/* Success Alert Banner */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-3 bg-emerald-500/15 border-b border-emerald-500/30 flex items-center gap-2 text-xs font-bold text-emerald-400"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span className="truncate">{successMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
          {/* ---------------------------------------------------- */}
          {/* TAB 1: ADD PRODUCT                                   */}
          {/* ---------------------------------------------------- */}
          {activeTab === 'product' && (
            <form id="quick-add-product-form" onSubmit={handleAddProductSubmit} className="space-y-4">
              {/* Product Name */}
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1.5 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Product Name *</span>
                </label>
                <input
                  id="quick-product-name-input"
                  type="text"
                  required
                  autoFocus
                  value={productName}
                  onChange={e => setProductName(e.target.value)}
                  placeholder="e.g. Organic Almond Milk, Premium Atta 5kg"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              {/* Category & Brand */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1.5 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Category</span>
                  </label>
                  <select
                    id="quick-product-category-select"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-emerald-500"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1.5">Brand</label>
                  <input
                    id="quick-product-brand-input"
                    type="text"
                    value={brand}
                    onChange={e => setBrand(e.target.value)}
                    placeholder="e.g. Tata, Amul, Nestle"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Pricing Grid (Selling Price, MRP, Purchase Cost) */}
              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1.5 flex items-center gap-1">
                    <DollarSign className="w-3 h-3 text-emerald-400" />
                    <span>Selling (₹) *</span>
                  </label>
                  <input
                    id="quick-product-selling-input"
                    type="number"
                    min="0"
                    step="any"
                    required
                    value={sellingPrice}
                    onChange={e => setSellingPrice(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-xs font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1.5">MRP (₹)</label>
                  <input
                    id="quick-product-mrp-input"
                    type="number"
                    min="0"
                    step="any"
                    value={mrp}
                    onChange={e => setMrp(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1.5">Cost (₹)</label>
                  <input
                    id="quick-product-cost-input"
                    type="number"
                    min="0"
                    step="any"
                    value={purchasePrice}
                    onChange={e => setPurchasePrice(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Stock, Unit & Low Stock Threshold */}
              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1.5">Initial Stock *</label>
                  <input
                    id="quick-product-stock-input"
                    type="number"
                    min="0"
                    required
                    value={stock}
                    onChange={e => setStock(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-xs font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1.5">Unit</label>
                  <select
                    id="quick-product-unit-select"
                    value={unit}
                    onChange={e => setUnit(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-emerald-500"
                  >
                    {UNITS.map(u => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1.5">Alert Below</label>
                  <input
                    id="quick-product-min-input"
                    type="number"
                    min="1"
                    value={minThreshold}
                    onChange={e => setMinThreshold(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Barcode & GST Rate */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                      <Barcode className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Barcode / SKU</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleGenerateBarcode}
                      className="text-[10px] text-emerald-400 hover:underline font-semibold"
                    >
                      Generate New
                    </button>
                  </div>
                  <input
                    id="quick-product-barcode-input"
                    type="text"
                    value={barcode}
                    onChange={e => setBarcode(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1.5">GST Tax Rate</label>
                  <select
                    id="quick-product-tax-select"
                    value={taxRate}
                    onChange={e => setTaxRate(parseInt(e.target.value, 10))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-emerald-500"
                  >
                    <option value={0}>0% (Tax Exempt)</option>
                    <option value={5}>5% (Essential Goods)</option>
                    <option value={12}>12% (Standard FMCG)</option>
                    <option value={18}>18% (Packaged Food & Retail)</option>
                    <option value={28}>28% (Luxury & Electronics)</option>
                  </select>
                </div>
              </div>

              {/* Submit Product Button */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2.5">
                <button
                  id="quick-product-cancel-btn"
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  id="quick-product-submit-btn"
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-extrabold shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Product to Catalog</span>
                </button>
              </div>
            </form>
          )}

          {/* ---------------------------------------------------- */}
          {/* TAB 2: LOG QUICK SALE                                */}
          {/* ---------------------------------------------------- */}
          {activeTab === 'sale' && (
            <form id="quick-log-sale-form" onSubmit={handleQuickSaleSubmit} className="space-y-4">
              {/* Product Selection */}
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Select Product *</span>
                  </span>
                  {selectedProduct && (
                    <span className="text-[10px] text-emerald-400 font-semibold">
                      Stock: {selectedProduct.stock} {selectedProduct.unit}
                    </span>
                  )}
                </label>
                <select
                  id="quick-sale-product-select"
                  value={selectedProductId}
                  onChange={e => handleProductChange(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-emerald-500"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} — ₹{p.sellingPrice} (Stock: {p.stock} {p.unit})
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity & Unit Price */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1.5">Quantity</label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSaleQuantity(prev => Math.max(1, prev - 1))}
                      className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 flex items-center justify-center active:scale-95"
                    >
                      -
                    </button>
                    <input
                      id="quick-sale-qty-input"
                      type="number"
                      min="1"
                      value={saleQuantity}
                      onChange={e => setSaleQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                      className="flex-1 text-center bg-slate-800 border border-slate-700 rounded-xl py-2 text-white text-xs font-bold focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => setSaleQuantity(prev => prev + 1)}
                      className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 flex items-center justify-center active:scale-95"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1.5 flex items-center gap-1">
                    <DollarSign className="w-3 h-3 text-emerald-400" />
                    <span>Unit Price (₹)</span>
                  </label>
                  <input
                    id="quick-sale-price-input"
                    type="number"
                    step="any"
                    min="0"
                    value={saleUnitPrice}
                    onChange={e => setSaleUnitPrice(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-xs font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Customer Details (Optional) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Customer Mobile (Optional)</span>
                  </label>
                  <input
                    id="quick-sale-customer-phone-input"
                    type="tel"
                    value={customerPhone}
                    onChange={e => handlePhoneChange(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Customer Name</span>
                  </label>
                  <input
                    id="quick-sale-customer-name-input"
                    type="text"
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    placeholder="Walk-in Customer"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Payment Method Pills */}
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1.5">Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'cash', label: '💵 Cash' },
                    { id: 'upi', label: '⚡ UPI / QR' },
                    { id: 'card', label: '💳 Card' }
                  ].map(m => (
                    <button
                      id={`quick-sale-pay-${m.id}`}
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id as PaymentMethod)}
                      className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all text-center ${
                        paymentMethod === m.id
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-sm'
                          : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Calculation Breakdown Card */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Subtotal ({saleQuantity} item{saleQuantity > 1 ? 's' : ''})</span>
                  <span>₹{currentSaleSubtotal.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>GST ({selectedProduct?.taxRate || 5}%)</span>
                  <span>₹{currentSaleTax.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-white font-extrabold text-sm">
                  <span>Grand Total</span>
                  <span className="text-emerald-400 text-base">₹{currentSaleGrandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2.5">
                <button
                  id="quick-sale-cancel-btn"
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  id="quick-sale-submit-btn"
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-extrabold shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all active:scale-95"
                >
                  <span>Complete & Log Sale</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};
