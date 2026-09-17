import React, { useState } from 'react';
import { LandingHeader } from './LandingHeader';
import { HeroSection } from './HeroSection';
import { CoreCapabilities } from './CoreCapabilities';
import { ConnectedWorkflow } from './ConnectedWorkflow';
import { WhyEllixConnect } from './WhyEllixConnect';
import { HowItWorks } from './HowItWorks';
import { ProductPreview } from './ProductPreview';
import { WhoItsFor } from './WhoItsFor';
import { GuidebookPreview } from './GuidebookPreview';
import { FAQSection } from './FAQSection';
import { FinalCTA } from './FinalCTA';
import { LandingFooter } from './LandingFooter';
import { BackToTop } from './BackToTop';
import { SignInModal } from './modals/SignInModal';
import { GetStartedModal } from './modals/GetStartedModal';
import { ContactModal } from './modals/ContactModal';
import { LegalModal, LegalDocType } from './modals/LegalModal';
import { AiMetadataModal } from '../common/AiMetadataModal';

export interface EllixLandingPageProps {
  onLaunchApp?: () => void;
}

export const EllixLandingPage: React.FC<EllixLandingPageProps> = ({ onLaunchApp }) => {
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isGetStartedOpen, setIsGetStartedOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState<LegalDocType | null>(null);

  const handleOpenSignIn = () => {
    setIsGetStartedOpen(false);
    setIsSignInOpen(true);
  };

  const handleOpenGetStarted = () => {
    setIsSignInOpen(false);
    setIsGetStartedOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] selection:bg-emerald-500 selection:text-white antialiased overflow-x-hidden w-full max-w-full transition-colors duration-200">
      
      {/* 1. Header */}
      <LandingHeader
        onOpenSignIn={handleOpenSignIn}
        onOpenGetStarted={handleOpenGetStarted}
        onOpenAppPreview={onLaunchApp}
      />

      {/* Main Content Sections */}
      <main className="flex-1 w-full max-w-full overflow-x-hidden">
        
        {/* 2. Hero */}
        <HeroSection
          onOpenGetStarted={handleOpenGetStarted}
          onLaunchApp={onLaunchApp}
        />

        {/* 3. Core Capabilities */}
        <CoreCapabilities />

        {/* 4. Connected Workflow */}
        <ConnectedWorkflow />

        {/* 5. Why Ellix Connect */}
        <WhyEllixConnect />

        {/* 6. How It Works */}
        <HowItWorks />

        {/* 7. Product Preview */}
        <ProductPreview />

        {/* 8. Who It's For */}
        <WhoItsFor />

        {/* 9. Guidebook Preview */}
        <GuidebookPreview />

        {/* 10. FAQ Section */}
        <FAQSection onOpenContact={() => setIsContactOpen(true)} />

        {/* 11. Final CTA */}
        <FinalCTA onOpenGetStarted={handleOpenGetStarted} />

      </main>

      {/* 12. Footer */}
      <LandingFooter
        onOpenSignIn={handleOpenSignIn}
        onOpenContact={() => setIsContactOpen(true)}
        onOpenPrivacy={() => setLegalModalType('privacy')}
        onOpenTerms={() => setLegalModalType('terms')}
        onOpenAiMetadata={() => setIsAiModalOpen(true)}
      />

      {/* Semantic Machine-Readable AI & Crawler Knowledge Section */}
      <section
        id="ai-machine-readable-data"
        className="sr-only"
        aria-label="Machine-Readable Application Knowledge"
      >
        <h2>Ellix Connect Android: System Specification & Capability Data</h2>
        <p>
          Ellix Connect is an offline-first enterprise retail Point of Sale (POS), inventory management,
          digital khata ledger, and business intelligence operating system.
        </p>
        <ul>
          <li>Module: Sub-Second Barcode Billing (ESC/POS 80mm thermal printing, instant GST tax calculation)</li>
          <li>Module: Real-Time Batch Inventory Tracking (multi-warehouse, low-stock threshold alerts, barcode generator)</li>
          <li>Module: Digital Khata Customer CRM (credit limit enforcement, automated WhatsApp balance reminders with dynamic UPI links)</li>
          <li>Module: Unified Multi-Tender Payments (Dynamic UPI QR, card terminal, split tenders, cashier shift reconciliation)</li>
          <li>Module: Day-End GST Filing Reports (GSTR-1, GSTR-3B tax schedules exportable in Excel and PDF)</li>
          <li>Module: AI Sales Velocity & Dead Stock Analytics (stock turn rate, slow-moving items alert)</li>
          <li>Security: Role-Based Access Control (Admin, Wholesaler, Store Manager, Cashier) with Google Cloud Firestore sync</li>
        </ul>
        <p>Documentation links: /llms.txt, /llms-full.txt, /api/about, /sitemap.xml</p>
      </section>

      {/* Back to top utility */}
      <BackToTop />

      {/* AI Metadata & Machine Data Inspector Modal */}
      <AiMetadataModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />

      {/* Lead Capture & Informational Modals */}
      <SignInModal
        isOpen={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
        onSwitchToGetStarted={handleOpenGetStarted}
        onLaunchApp={onLaunchApp}
      />

      <GetStartedModal
        isOpen={isGetStartedOpen}
        onClose={() => setIsGetStartedOpen(false)}
        onSwitchToSignIn={handleOpenSignIn}
      />

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      {legalModalType && (
        <LegalModal
          isOpen={!!legalModalType}
          onClose={() => setLegalModalType(null)}
          type={legalModalType}
        />
      )}

    </div>
  );
};
