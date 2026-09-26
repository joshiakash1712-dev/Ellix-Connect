import React, { useState } from 'react';
import { MarketingModal } from './MarketingModal';
import { EllixConnectLogo } from '../../branding/EllixConnectLogo';
import { Store, CheckCircle2, ArrowRight, Sparkles, Building2, MapPin, Phone, Mail } from 'lucide-react';

interface GetStartedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignIn?: () => void;
}

export const GetStartedModal: React.FC<GetStartedModalProps> = ({
  isOpen,
  onClose,
  onSwitchToSignIn
}) => {
  const [storeName, setStoreName] = useState('');
  const [businessType, setBusinessType] = useState('grocery');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <MarketingModal
      isOpen={isOpen}
      onClose={onClose}
      title="Get Started with Ellix Connect"
      subtitle="Ellix Connect access will be available through our upcoming client onboarding process."
    >
      {submitted ? (
        <div className="py-6 text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h4 className="text-xl font-bold text-slate-950 dark:text-white">
            Thank you, {contactName || 'Store Owner'}!
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
            Your onboarding request for <span className="font-semibold text-slate-900 dark:text-white">{storeName || 'your business'}</span> has been received. Our merchant success team will connect with you via WhatsApp/phone within 24 hours to schedule your live walkthrough and hardware setup.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-sm font-semibold transition-all shadow-sm"
            >
              Back to Website
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Brand Logo Header */}
          <div className="flex justify-center pb-1">
            <EllixConnectLogo size="sm" />
          </div>

          {/* Informational Hero Banner */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Priority Merchant Onboarding (Cohort 2026)</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              We are onboarding retail stores with complimentary catalog migration, custom barcode printer setup, and hands-on cashier staff training.
            </p>
          </div>

          {/* Registration Interest Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Store / Business Name *
                </label>
                <div className="relative">
                  <Store className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="e.g. Metro Mart"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Business Category *
                </label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 dark:text-white"
                >
                  <option value="grocery">Grocery & Supermarket</option>
                  <option value="electronics">Electronics & Mobile</option>
                  <option value="clothing">Clothing & Apparel</option>
                  <option value="hardware">Hardware & Electrical</option>
                  <option value="retail">General Retail & Mart</option>
                  <option value="wholesale">Wholesaler & Distributor</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Contact Person *
                </label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  City / Location *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Pune, Mumbai"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                WhatsApp / Phone Number *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Request Onboarding Invitation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Footer note */}
          <div className="pt-2 text-center text-[11px] text-slate-500 dark:text-slate-400">
            <span>Free 14-day trial included · No payment details required</span>
            {onSwitchToSignIn && (
              <span className="block mt-1">
                Already an onboarded client?{' '}
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onSwitchToSignIn();
                  }}
                  className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
                >
                  Sign In here
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </MarketingModal>
  );
};
