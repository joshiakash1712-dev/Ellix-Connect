import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product, PaymentMethod, CustomerProfile, POSInvoice } from '../../types';
import { BarcodeScannerModal } from '../common/BarcodeScannerModal';
import { InvoiceModal } from '../common/InvoiceModal';
import {
  Scan,
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  QrCode,
  DollarSign,
  User,
  Tag,
  CheckCircle,
  Percent,
  Receipt,
  RotateCcw,
  Sparkles,
  Layers,
  Palette,
  MessageSquare,
  Phone,
  ShoppingBag,
  ArrowRight,
  UserPlus
} from 'lucide-react';

export const BillingPOS: React.FC = () => {
  const {
    products,
    customers,
    createInvoice,
    activeStore,
    addCustomer,
    invoiceTemplates
  } = useStore();

  const [mobileTab, setMobileTab] = useState<'catalog' | 'cart'>('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [cart, setCart] = useState<{ product: Product; quantity: number; discount: number }[]>([]);
  
  // Invoice settings
  const [isGSTInvoice, setIsGSTInvoice] = useState<boolean>(true);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(() => {
    const def = invoiceTemplates.find(t => t.isDefault) || invoiceTemplates[0];
    return def?.id || '';
  });
  
  // Split payment state
  const [splitCash, setSplitCash] = useState<number>(0);
  const [splitCard, setSplitCard] = useState<number>(0);
  const [splitUpi, setSplitUpi] = useState<number>(0);

  // Customer state
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerProfile | null>(customers[0] || null);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [redeemPoints, setRedeemPoints] = useState<boolean>(false);
  const [autoWhatsAppShare, setAutoWhatsAppShare] = useState<boolean>(true);

  // Focus refs for mobile keyboard optimization
  const searchInputRef = useRef<HTMLInputElement>(null);
  const splitCashRef = useRef<HTMLInputElement>(null);
  const newCustNameRef = useRef<HTMLInputElement>(null);

  // Auto focus search input on mount or when switching to catalog tab
  useEffect(() => {
    if (mobileTab === 'catalog') {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [mobileTab]);

  // Auto focus cash input when split payment is chosen
  useEffect(() => {
    if (paymentMethod === 'split') {
      const timer = setTimeout(() => {
        splitCashRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [paymentMethod]);

  // Auto focus customer name input when quick add is opened
  useEffect(() => {
    if (showAddCustomer) {
      const timer = setTimeout(() => {
        newCustNameRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [showAddCustomer]);

  // Auto-match template when customer segment changes
  useEffect(() => {
    if (!selectedCustomer) return;
    const custSegment = selectedCustomer.segment || 'Regular Retail';
    const matchingTemplate = invoiceTemplates.find(t => t.targetSegment === custSegment && t.isDefault) ||
      invoiceTemplates.find(t => t.targetSegment === custSegment) ||
      invoiceTemplates.find(t => t.isDefault) ||
      invoiceTemplates[0];

    if (matchingTemplate) {
      setSelectedTemplateId(matchingTemplate.id);
    }
  }, [selectedCustomer, invoiceTemplates]);

  // Modals
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [generatedInvoice, setGeneratedInvoice] = useState<POSInvoice | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.barcode.includes(searchQuery) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev; // Limit to stock
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1, discount: 0 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev =>
      prev
        .map(item => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            if (newQty > item.product.stock) return item;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter(Boolean) as { product: Product; quantity: number; discount: number }[]
    );
  };

  const updateItemDiscount = (productId: string, discountAmount: number) => {
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, discount: Math.max(0, discountAmount) } : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Subtotal & Calculations
  const subtotal = cart.reduce((acc, item) => acc + item.product.sellingPrice * item.quantity, 0);
  const itemDiscountsTotal = cart.reduce((acc, item) => acc + item.discount, 0);
  const loyaltyDiscount = redeemPoints && selectedCustomer ? Math.min(subtotal, selectedCustomer.loyaltyPoints) : 0;
  const totalDiscount = itemDiscountsTotal + loyaltyDiscount;

  const taxableAmount = Math.max(0, subtotal - totalDiscount);
  // Avg tax rate calc
  const avgTaxRate = cart.length > 0 ? cart.reduce((acc, i) => acc + i.product.taxRate, 0) / cart.length : 5;
  const totalTaxAmount = isGSTInvoice ? Math.round((taxableAmount * avgTaxRate) / 100) : 0;
  const cgst = Math.round(totalTaxAmount / 2);
  const sgst = Math.round(totalTaxAmount / 2);

  const grandTotal = Math.round(taxableAmount + totalTaxAmount);

  const handleCreateNewCustomer = () => {
    if (!newCustName || !newCustPhone) return;
    const created = addCustomer({
      name: newCustName,
      phone: newCustPhone,
      creditBalance: 0,
      loyaltyPoints: 50,
      phoneVerified: true
    });
    setSelectedCustomer(created);
    setNewCustName('');
    setNewCustPhone('');
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;

    const itemsData = cart.map(item => {
      const lineSubtotal = item.product.sellingPrice * item.quantity - item.discount;
      const lineTax = isGSTInvoice ? (lineSubtotal * item.product.taxRate) / 100 : 0;
      return {
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        unitPrice: item.product.sellingPrice,
        discount: item.discount,
        taxRate: item.product.taxRate,
        taxAmount: lineTax,
        total: Math.round(lineSubtotal + lineTax)
      };
    });

    const earnedPoints = Math.round(grandTotal * 0.05);

    const inv = createInvoice({
      storeId: activeStore.id,
      storeName: activeStore.name,
      storeGSTIN: activeStore.gstin,
      storeAddress: activeStore.address,
      customerName: selectedCustomer ? selectedCustomer.name : 'Walk-in Retail Customer',
      customerPhone: selectedCustomer ? selectedCustomer.phone : '+91 99999 00000',
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      isGSTInvoice,
      items: itemsData,
      subtotal,
      discountTotal: totalDiscount,
      cgst,
      sgst,
      igst: 0,
      grandTotal,
      paymentMethod,
      splitDetails: paymentMethod === 'split' ? { cashAmount: splitCash, cardAmount: splitCard, upiAmount: splitUpi } : undefined,
      upiTxnRef: paymentMethod === 'upi' ? `UPI/${Math.floor(100000000 + Math.random() * 900000000)}/OKAXIS` : undefined,
      loyaltyPointsEarned: earnedPoints,
      loyaltyPointsRedeemed: redeemPoints ? loyaltyDiscount : 0,
      templateId: selectedTemplateId
    });

    setGeneratedInvoice(inv);
    setIsInvoiceModalOpen(true);
    setCart([]);

    if (autoWhatsAppShare) {
      const targetPhone = inv.customerPhone || '+91 99999 00000';
      const cleanDigits = targetPhone.replace(/[^0-9]/g, '');
      const formattedPhone = cleanDigits.length === 10 ? `91${cleanDigits}` : cleanDigits;
      const pdfInvoiceUrl = `https://ellixconnect.com/invoices/pdf/${inv.invoiceNumber}.pdf`;

      const whatsappText = `*TAX INVOICE / OFFICIAL BILL* 🧾
*Store:* ${inv.storeName}
--------------------------------
*Invoice No:* #${inv.invoiceNumber}
*Date:* ${inv.date}
*Customer:* ${inv.customerName}

*Items:*
${inv.items.map(it => `• ${it.productName} (${it.quantity}x) = ₹${it.total}`).join('\n')}

--------------------------------
*Subtotal:* ₹${inv.subtotal}
${inv.cgst ? `*GST:* ₹${(inv.cgst + inv.sgst).toFixed(2)}\n` : ''}*Grand Total:* ₹${inv.grandTotal} (${inv.paymentMethod.toUpperCase()})

*Download Official PDF Invoice:*
${pdfInvoiceUrl}

Thank you for shopping with ${inv.storeName}!`;

      const waApiUrl = `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodeURIComponent(whatsappText)}`;
      window.open(waApiUrl, '_blank');
    }
  };

  return (
    <div className="space-y-4">
      {/* Mobile POS Navigation Segment (lg:hidden) */}
      <div className="flex lg:hidden bg-slate-900 p-1.5 rounded-2xl border border-slate-800 gap-1 shadow-lg">
        <button
          onClick={() => setMobileTab('catalog')}
          className={`flex-1 min-h-[44px] rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            mobileTab === 'catalog'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Catalog ({filteredProducts.length})</span>
        </button>

        <button
          onClick={() => setMobileTab('cart')}
          className={`flex-1 min-h-[44px] rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all relative ${
            mobileTab === 'cart'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Cart ({cart.reduce((a, c) => a + c.quantity, 0)})</span>
          {cart.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-emerald-400 text-slate-950 text-[10px] font-black">
              ₹{grandTotal}
            </span>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Product Selection Catalog */}
        <div
          className={`lg:col-span-7 space-y-4 ${
            mobileTab === 'catalog' ? 'block' : 'hidden lg:block'
          }`}
        >
          {/* Search & Barcode Scan Bar */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="input-pos-product-search"
                  ref={searchInputRef}
                  type="search"
                  inputMode="search"
                  autoFocus
                  autoCapitalize="none"
                  spellCheck={false}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search products by Name, Barcode, or Brand..."
                  className="w-full bg-slate-800 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 min-h-[44px]"
                />
              </div>

              <button
                onClick={() => setIsScannerOpen(true)}
                className="px-4 py-2.5 min-h-[44px] rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition-all active:scale-95 shrink-0"
              >
                <Scan className="w-4 h-4" />
                <span className="hidden sm:inline">Scan Barcode</span>
              </button>
            </div>

            {/* Category Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-2 min-h-[38px] rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filteredProducts.map(prod => {
              const inCartItem = cart.find(i => i.product.id === prod.id);
              const isLowStock = prod.stock <= prod.minThreshold;

              return (
                <div
                  key={prod.id}
                  onClick={() => addToCart(prod)}
                  className={`p-3 rounded-2xl bg-slate-900 border transition-all cursor-pointer flex flex-col justify-between relative group active:scale-95 ${
                    inCartItem
                      ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-slate-800/80'
                      : 'border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                  }`}
                >
                  {inCartItem && (
                    <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-emerald-500 text-xs font-black text-white flex items-center justify-center shadow-md">
                      {inCartItem.quantity}
                    </span>
                  )}

                  <div className="space-y-2">
                    <div className="h-24 w-full rounded-xl overflow-hidden bg-slate-800 relative">
                      <img
                        src={
                          prod.image ||
                          'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=300'
                        }
                        alt={prod.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute bottom-1.5 left-1.5 text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-slate-950/80 text-slate-300 backdrop-blur-sm border border-slate-700">
                        {prod.category}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-white line-clamp-1 group-hover:text-emerald-300 transition-colors">
                        {prod.name}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-medium">{prod.brand}</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-black text-emerald-400">₹{prod.sellingPrice}</div>
                      <div className="text-[9px] text-slate-500 line-through">MRP ₹{prod.mrp}</div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        isLowStock ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {prod.stock} {prod.unit}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: POS Billing Cart & Checkout Terminal */}
        <div
          className={`lg:col-span-5 p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4 ${
            mobileTab === 'cart' ? 'block' : 'hidden lg:block'
          }`}
        >
          {/* Terminal Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">POS Checkout Terminal</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsGSTInvoice(!isGSTInvoice)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  isGSTInvoice
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {isGSTInvoice ? 'GST Invoice' : 'Non-GST Bill'}
              </button>
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                  title="Clear Cart"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Customer Selector / Quick Add */}
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <span>Customer Link</span>
              </span>
              <div className="flex items-center gap-2">
                {selectedCustomer && (
                  <span className="text-[10px] text-emerald-400 font-bold">
                    {selectedCustomer.loyaltyPoints} Pts
                  </span>
                )}
                <button
                  type="button"
                  id="btn-pos-toggle-add-customer"
                  onClick={() => setShowAddCustomer(!showAddCustomer)}
                  className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 hover:underline"
                >
                  <UserPlus className="w-3 h-3" />
                  <span>{showAddCustomer ? 'Select Existing' : '+ Quick Add'}</span>
                </button>
              </div>
            </div>

            {showAddCustomer ? (
              <div className="p-2.5 rounded-xl bg-slate-900 border border-emerald-500/30 space-y-2">
                <div className="text-[11px] font-semibold text-emerald-400 flex items-center justify-between">
                  <span>New Customer Registration</span>
                  <button
                    type="button"
                    onClick={() => setShowAddCustomer(false)}
                    className="text-slate-400 hover:text-white text-[10px]"
                  >
                    Cancel
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    id="input-pos-cust-name"
                    ref={newCustNameRef}
                    type="text"
                    inputMode="text"
                    autoFocus
                    autoCapitalize="words"
                    placeholder="Customer Full Name"
                    value={newCustName}
                    onChange={e => setNewCustName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                  <input
                    id="input-pos-cust-phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    pattern="[0-9]*"
                    placeholder="Mobile (e.g. 9876543210)"
                    value={newCustPhone}
                    onChange={e => setNewCustPhone(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && newCustName.trim() && newCustPhone.trim()) {
                        handleCreateNewCustomer();
                        setShowAddCustomer(false);
                      }
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <button
                  type="button"
                  id="btn-pos-save-customer"
                  onClick={() => {
                    handleCreateNewCustomer();
                    setShowAddCustomer(false);
                  }}
                  disabled={!newCustName.trim() || !newCustPhone.trim()}
                  className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs transition-colors"
                >
                  Save & Link Customer
                </button>
              </div>
            ) : (
              <select
                id="select-pos-customer"
                value={selectedCustomer?.id || ''}
                onChange={e => {
                  const found = customers.find(c => c.id === e.target.value);
                  setSelectedCustomer(found || null);
                }}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 min-h-[44px]"
              >
                <option value="">Walk-in Retail Customer</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.phone}) - Bal: ₹{c.creditBalance}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Cart Itemized List */}
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {cart.length === 0 ? (
              <div className="text-center py-10 text-slate-500 space-y-2">
                <ShoppingCart className="w-10 h-10 text-slate-700 mx-auto" />
                <p className="text-xs font-semibold">Cart is empty</p>
                <p className="text-[10px] text-slate-600">Scan barcode or select products to start billing.</p>
              </div>
            ) : (
              cart.map(item => (
                <div
                  key={item.product.id}
                  className="p-3 rounded-xl bg-slate-800/90 border border-slate-700/80 flex items-center justify-between gap-2"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-white truncate">{item.product.name}</div>
                    <div className="text-[10px] text-slate-400">
                      ₹{item.product.sellingPrice} x {item.quantity} | Tax: {item.product.taxRate}%
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-slate-900 rounded-xl border border-slate-700 overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.product.id, -1)}
                        className="w-9 h-9 flex items-center justify-center hover:text-rose-400 text-slate-300 active:bg-slate-800"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-2 text-xs font-extrabold text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, 1)}
                        className="w-9 h-9 flex items-center justify-center hover:text-emerald-400 text-slate-300 active:bg-slate-800"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right min-w-[60px]">
                      <div className="text-xs font-black text-white">
                        ₹{item.product.sellingPrice * item.quantity - item.discount}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

        {/* Calculation & Discount Section */}
        {cart.length > 0 && (
          <div className="pt-3 border-t border-slate-800 space-y-2 text-xs text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Subtotal:</span>
              <span className="font-semibold text-white">₹{subtotal}</span>
            </div>

            {selectedCustomer && selectedCustomer.loyaltyPoints > 0 && (
              <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-emerald-300">
                  <input
                    type="checkbox"
                    checked={redeemPoints}
                    onChange={e => setRedeemPoints(e.target.checked)}
                    className="accent-emerald-500 rounded"
                  />
                  <span>Redeem {selectedCustomer.loyaltyPoints} Loyalty Points</span>
                </label>
                <span className="font-extrabold text-emerald-400">-₹{loyaltyDiscount}</span>
              </div>
            )}

            {isGSTInvoice && (
              <div className="flex justify-between text-slate-400">
                <span>GST (CGST + SGST avg {avgTaxRate}%):</span>
                <span className="font-semibold text-slate-200">₹{totalTaxAmount}</span>
              </div>
            )}

            <div className="flex justify-between text-base font-black text-white pt-2 border-t border-slate-800">
              <span>Grand Total:</span>
              <span className="text-emerald-400">₹{grandTotal}</span>
            </div>

            {/* Template Selector */}
            <div className="pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Palette className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Invoice Design Template</span>
                </span>
                {selectedCustomer && (
                  <span className="text-[10px] text-emerald-400 font-semibold">
                    Auto-Matched ({selectedCustomer.segment})
                  </span>
                )}
              </div>
              <select
                value={selectedTemplateId}
                onChange={e => setSelectedTemplateId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-medium focus:outline-none focus:border-emerald-500"
              >
                {invoiceTemplates.map(tpl => (
                  <option key={tpl.id} value={tpl.id}>
                    {tpl.name} — [{tpl.targetSegment}] ({tpl.paperSize.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Payment Method Selector */}
        {cart.length > 0 && (
          <div className="space-y-2">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Payment Method
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { id: 'upi', label: 'UPI QR', icon: <QrCode className="w-3.5 h-3.5" /> },
                { id: 'cash', label: 'Cash', icon: <DollarSign className="w-3.5 h-3.5" /> },
                { id: 'card', label: 'Card', icon: <CreditCard className="w-3.5 h-3.5" /> },
                { id: 'split', label: 'Split', icon: <Layers className="w-3.5 h-3.5" /> }
              ].map(m => (
                <button
                  key={m.id}
                  onClick={() => setPaymentMethod(m.id as PaymentMethod)}
                  className={`p-2 rounded-xl text-xs font-bold border flex flex-col items-center justify-center gap-1 transition-all ${
                    paymentMethod === m.id
                      ? 'bg-emerald-600 text-white border-emerald-400 shadow-lg shadow-emerald-600/20'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {m.icon}
                  <span>{m.label}</span>
                </button>
              ))}
            </div>

            {/* Split Payment Form */}
            {paymentMethod === 'split' && (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="text-[10px] text-slate-400">Enter split amounts (Sum: ₹{grandTotal}):</div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label htmlFor="input-split-cash" className="text-[10px] text-slate-400 block mb-1">Cash ₹</label>
                    <input
                      id="input-split-cash"
                      ref={splitCashRef}
                      type="number"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      autoFocus
                      min="0"
                      step="any"
                      placeholder="0"
                      value={splitCash || ''}
                      onChange={e => setSplitCash(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white text-xs font-semibold focus:outline-none focus:border-emerald-500 min-h-[40px]"
                    />
                  </div>
                  <div>
                    <label htmlFor="input-split-card" className="text-[10px] text-slate-400 block mb-1">Card ₹</label>
                    <input
                      id="input-split-card"
                      type="number"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      min="0"
                      step="any"
                      placeholder="0"
                      value={splitCard || ''}
                      onChange={e => setSplitCard(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white text-xs font-semibold focus:outline-none focus:border-emerald-500 min-h-[40px]"
                    />
                  </div>
                  <div>
                    <label htmlFor="input-split-upi" className="text-[10px] text-slate-400 block mb-1">UPI ₹</label>
                    <input
                      id="input-split-upi"
                      type="number"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      min="0"
                      step="any"
                      placeholder="0"
                      value={splitUpi || ''}
                      onChange={e => setSplitUpi(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white text-xs font-semibold focus:outline-none focus:border-emerald-500 min-h-[40px]"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* WhatsApp Share Control Toggle */}
        {cart.length > 0 && (
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
            <label className="flex items-center gap-2.5 cursor-pointer text-slate-300 font-bold select-none">
              <input
                type="checkbox"
                checked={autoWhatsAppShare}
                onChange={e => setAutoWhatsAppShare(e.target.checked)}
                className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
              />
              <span className="flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span>Auto-Share PDF Invoice on WhatsApp</span>
              </span>
            </label>

            <span className="text-[10px] text-slate-400 font-mono font-semibold">
              {selectedCustomer ? selectedCustomer.phone : '+91 Registered Mobile'}
            </span>
          </div>
        )}

        {/* Complete Payment Button */}
        {cart.length > 0 && (
          <button
            onClick={handleCheckout}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white text-sm font-black shadow-xl shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Complete Sale & Generate Invoice (₹{grandTotal})</span>
          </button>
        )}

      </div>
    </div>

      {/* Floating Sticky Mobile Quick Checkout Bar */}
      {cart.length > 0 && mobileTab === 'catalog' && (
        <div className="fixed bottom-16 left-3 right-3 z-30 lg:hidden bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 rounded-2xl p-3 shadow-2xl border border-emerald-400/40 flex items-center justify-between text-white animate-in slide-in-from-bottom duration-200">
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-100">
              Cart ({cart.reduce((a, c) => a + c.quantity, 0)} Items)
            </div>
            <div className="text-base font-black">₹{grandTotal}</div>
          </div>
          <button
            onClick={() => setMobileTab('cart')}
            className="px-4 py-2.5 rounded-xl bg-slate-950 text-white text-xs font-black flex items-center gap-1.5 shadow-lg active:scale-95 transition-transform"
          >
            <span>View Cart & Pay</span>
            <ArrowRight className="w-4 h-4 text-emerald-400" />
          </button>
        </div>
      )}

      {/* Barcode Scanner Modal */}
      <BarcodeScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={p => addToCart(p)}
      />

      {/* Generated GST Invoice Modal */}
      <InvoiceModal
        invoice={generatedInvoice}
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
      />

    </div>
  );
};
