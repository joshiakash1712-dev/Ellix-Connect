import React, { useState } from 'react';
import { MarketingModal } from './MarketingModal';
import { EllixConnectLogo } from '../../branding/EllixConnectLogo';
import { Mail, Phone, MapPin, MessageSquare, Clock, CheckCircle2, Send, Bot, Sparkles } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sentNotice, setSentNotice] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSentNotice(true);
  };

  return (
    <MarketingModal
      isOpen={isOpen}
      onClose={onClose}
      title="Contact Ellix Connect"
      subtitle="Have questions about hardware, pricing, or custom store setups? We're here to help."
      maxWidth="max-w-xl"
    >
      <div className="space-y-6">
        {/* Brand Logo Header */}
        <div className="flex justify-center pb-1">
          <EllixConnectLogo size="sm" />
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
            <div className="w-8 h-8 mx-auto rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-2">
              <Mail className="w-4 h-4" />
            </div>
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              General Support
            </div>
            <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5 break-words">
              support@ellixconnect.com
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
            <div className="w-8 h-8 mx-auto rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 flex items-center justify-center mb-2">
              <Phone className="w-4 h-4" />
            </div>
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Merchant Hotline
            </div>
            <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
              +91 1800 572 3400
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
            <div className="w-8 h-8 mx-auto rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-400 flex items-center justify-center mb-2">
              <Clock className="w-4 h-4" />
            </div>
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Support Hours
            </div>
            <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
              Mon–Sat, 8am–10pm
            </div>
          </div>
        </div>

        {/* 24/7 Instant AI Assistant Banner */}
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent border border-emerald-500/30 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 border border-emerald-500/30 flex items-center justify-center shrink-0 shadow-sm p-1">
              <EllixConnectLogo variant="symbol" size={24} alt="Ellix Assistant" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>Need Instant Answers?</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold">24/7 Active</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                Ask our AI assistant about hardware, thermal printing, GST, or billing.
              </p>
            </div>
          </div>
          <button
            type="button"
            id="btn-contact-modal-launch-chatbot"
            onClick={() => {
              onClose();
              window.dispatchEvent(new CustomEvent('open-support-chat'));
            }}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shrink-0 transition-colors shadow-sm"
          >
            Start Chat
          </button>
        </div>

        {/* Static Contact Inquiry Form */}
        {sentNotice ? (
          <div className="p-5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-center space-y-2">
            <CheckCircle2 className="w-7 h-7 text-emerald-600 dark:text-emerald-400 mx-auto" />
            <div className="text-sm font-bold text-slate-950 dark:text-white">
              Message Received
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Thank you for reaching out. Our merchant specialist will review your inquiry and follow up within 24 business hours.
            </p>
            <button
              type="button"
              onClick={() => {
                setSentNotice(false);
                setName('');
                setEmail('');
                setMessage('');
              }}
              className="mt-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Aarav Sharma"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Your Email / WhatsApp
                </label>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="aarav@retailstore.com"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                How can we help your business?
              </label>
              <textarea
                rows={3}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us about your store, current billing setup, or any specific hardware requirements..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 dark:text-white resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Inquiry to Specialist</span>
            </button>
          </form>
        )}

        <div className="pt-2 text-center text-[11px] text-slate-500 dark:text-slate-400">
          Ellix Connect Retail Technologies · Bangalore & Mumbai Tech Hubs
        </div>
      </div>
    </MarketingModal>
  );
};
