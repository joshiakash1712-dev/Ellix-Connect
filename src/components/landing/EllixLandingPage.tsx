import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMotionValue, useSpring, useReducedMotion } from 'motion/react';
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
import { WebsiteCursor } from './WebsiteCursor';
import type { LegalDocType } from './modals/LegalModal';
import { CookieConsentBanner } from '../legal/CookieConsentBanner';
import { FirstTimeGuideBanner } from './guide/FirstTimeGuideBanner';
import { loadGuideProgress } from './guide/guideData';
import {
  LEGAL_PAGE_ROUTES,
  LegalPageSlug,
  getLegalSlugFromLocation,
} from '../../config/legal.config';

// Lazy-loaded modals & hubs so initial landing page bundle loads and parses faster
const SignInModal = lazy(() =>
  import('./modals/SignInModal').then((m) => ({ default: m.SignInModal }))
);
const GetStartedModal = lazy(() =>
  import('./modals/GetStartedModal').then((m) => ({ default: m.GetStartedModal }))
);
const ContactModal = lazy(() =>
  import('./modals/ContactModal').then((m) => ({ default: m.ContactModal }))
);
const LegalModal = lazy(() =>
  import('./modals/LegalModal').then((m) => ({ default: m.LegalModal }))
);
const AiMetadataModal = lazy(() =>
  import('../common/AiMetadataModal').then((m) => ({ default: m.AiMetadataModal }))
);
const LegalComplianceHub = lazy(() =>
  import('../legal/LegalComplianceHub').then((m) => ({ default: m.LegalComplianceHub }))
);
const InteractiveUserGuideModal = lazy(() =>
  import('./guide/InteractiveUserGuideModal').then((m) => ({ default: m.InteractiveUserGuideModal }))
);

gsap.registerPlugin(ScrollTrigger);

export interface EllixLandingPageProps {
  onLaunchApp?: () => void;
  onLaunchDemo?: () => void;
}

export const EllixLandingPage: React.FC<EllixLandingPageProps> = ({ onLaunchApp, onLaunchDemo }) => {
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isGetStartedOpen, setIsGetStartedOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [guideInitialStep, setGuideInitialStep] = useState<number | undefined>(undefined);
  const [guideProgressState, setGuideProgressState] = useState(() => loadGuideProgress());
  const [legalModalType, setLegalModalType] = useState<LegalDocType | null>(null);
  const [activeLegalPageSlug, setActiveLegalPageSlug] = useState<LegalPageSlug | null>(() =>
    getLegalSlugFromLocation()
  );

  const syncGuideProgress = () => {
    setGuideProgressState(loadGuideProgress());
  };

  const handleOpenGuide = (step?: number) => {
    syncGuideProgress();
    setGuideInitialStep(step);
    setIsGuideModalOpen(true);
  };

  const handleCloseGuide = () => {
    setIsGuideModalOpen(false);
    setGuideInitialStep(undefined);
    syncGuideProgress();
  };

  const handleNavigateToSection = (sectionId: string) => {
    const cleanId = sectionId.replace('#', '');
    const el = document.getElementById(cleanId);
    if (el) {
      const headerOffset = 80;
      const top = el.getBoundingClientRect().top + window.pageYOffset - headerOffset;
      window.scrollTo({ top, behavior: 'smooth' });
      try {
        window.history.pushState(null, '', `#${cleanId}`);
      } catch {
        // ignore history error
      }
    }
  };

  useEffect(() => {
    const syncLegalRoute = () => {
      setActiveLegalPageSlug(getLegalSlugFromLocation());
    };
    window.addEventListener('popstate', syncLegalRoute);
    window.addEventListener('hashchange', syncLegalRoute);
    return () => {
      window.removeEventListener('popstate', syncLegalRoute);
      window.removeEventListener('hashchange', syncLegalRoute);
    };
  }, []);

  const handleNavigateToLegalPage = (slug: LegalPageSlug) => {
    const targetPath = LEGAL_PAGE_ROUTES[slug]?.path || `/${slug}`;
    try {
      if (window.location.pathname !== targetPath) {
        window.history.pushState({}, '', targetPath);
      }
    } catch {
      // ignore history errors
    }
    setActiveLegalPageSlug(slug);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseLegalPage = () => {
    try {
      if (window.location.pathname !== '/') {
        window.history.pushState({}, '', '/');
      }
    } catch {
      // ignore history errors
    }
    setActiveLegalPageSlug(null);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  };

  const rootRef = useRef<HTMLDivElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const activeHoverCardRef = useRef<HTMLElement | null>(null);
  const activeMagneticBtnRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  // Spring values for subtle desktop Magnetic CTA interaction (Section 7: max 4-6px, 1px inner shift)
  const rawMagX = useMotionValue(0);
  const rawMagY = useMotionValue(0);
  const springMagX = useSpring(rawMagX, { stiffness: 320, damping: 26, mass: 0.4 });
  const springMagY = useSpring(rawMagY, { stiffness: 320, damping: 26, mass: 0.4 });

  useEffect(() => {
    const unsubX = springMagX.on('change', (val) => {
      if (activeMagneticBtnRef.current) {
        activeMagneticBtnRef.current.style.setProperty('--mag-x', `${val.toFixed(2)}px`);
        activeMagneticBtnRef.current.style.setProperty('--mag-inner-x', `${(val * 0.22).toFixed(2)}px`);
      }
    });
    const unsubY = springMagY.on('change', (val) => {
      if (activeMagneticBtnRef.current) {
        activeMagneticBtnRef.current.style.setProperty('--mag-y', `${val.toFixed(2)}px`);
        activeMagneticBtnRef.current.style.setProperty('--mag-inner-y', `${(val * 0.22).toFixed(2)}px`);
      }
    });

    return () => {
      unsubX();
      unsubY();
    };
  }, [springMagX, springMagY]);

  useEffect(() => {
    const rootEl = rootRef.current;
    if (!rootEl || prefersReducedMotion) return;

    let rafId: number | null = null;
    let latestClientX = 0;
    let latestClientY = 0;
    let latestTarget: HTMLElement | null = null;
    let cachedCardRect: DOMRect | null = null;
    let cachedBtnRect: DOMRect | null = null;

    const invalidateRectCache = () => {
      cachedCardRect = null;
      cachedBtnRect = null;
    };

    const resetMagneticBtn = (btn: HTMLElement | null) => {
      if (!btn) return;
      btn.style.removeProperty('--mag-x');
      btn.style.removeProperty('--mag-y');
      btn.style.removeProperty('--mag-inner-x');
      btn.style.removeProperty('--mag-inner-y');
    };

    const processPointerFrame = () => {
      rafId = null;
      const target = latestTarget;
      const clientX = latestClientX;
      const clientY = latestClientY;

      // 1. Update Card Radial Spotlight coordinates (cached rect to prevent layout thrashing)
      const card = target?.closest('.website-card-hover') as HTMLElement | null;
      if (card) {
        if (activeHoverCardRef.current !== card || !cachedCardRect) {
          activeHoverCardRef.current = card;
          cachedCardRect = card.getBoundingClientRect();
        }
        const x = clientX - cachedCardRect.left;
        const y = clientY - cachedCardRect.top;
        card.style.setProperty('--card-mouse-x', `${x.toFixed(0)}px`);
        card.style.setProperty('--card-mouse-y', `${y.toFixed(0)}px`);
      } else {
        activeHoverCardRef.current = null;
        cachedCardRect = null;
      }

      // 2. Subtle Desktop Magnetic CTA Effect (within 48px proximity, max 5px displacement)
      const directBtn = target?.closest('.website-btn-glow, [data-magnetic="cta"]') as HTMLElement | null;
      let candidateBtn: HTMLElement | null = directBtn;

      if (!candidateBtn && activeMagneticBtnRef.current) {
        if (!cachedBtnRect) {
          cachedBtnRect = activeMagneticBtnRef.current.getBoundingClientRect();
        }
        const rect = cachedBtnRect;
        const proximityPad = 44;
        if (
          clientX >= rect.left - proximityPad &&
          clientX <= rect.right + proximityPad &&
          clientY >= rect.top - proximityPad &&
          clientY <= rect.bottom + proximityPad
        ) {
          candidateBtn = activeMagneticBtnRef.current;
        }
      }

      if (candidateBtn !== activeMagneticBtnRef.current) {
        resetMagneticBtn(activeMagneticBtnRef.current);
        activeMagneticBtnRef.current = candidateBtn;
        cachedBtnRect = candidateBtn ? candidateBtn.getBoundingClientRect() : null;
        if (!candidateBtn) {
          rawMagX.set(0);
          rawMagY.set(0);
        }
      }

      if (candidateBtn) {
        if (!cachedBtnRect) {
          cachedBtnRect = candidateBtn.getBoundingClientRect();
        }
        const rect = cachedBtnRect;
        if (rect.width > 0 && rect.height > 0) {
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const normX = Math.max(-1, Math.min(1, (clientX - centerX) / (rect.width / 2 + 40)));
          const normY = Math.max(-1, Math.min(1, (clientY - centerY) / (rect.height / 2 + 40)));
          const maxShiftPx = 4.5;

          rawMagX.set(normX * maxShiftPx);
          rawMagY.set(normY * maxShiftPx);
        }
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      latestClientX = e.clientX;
      latestClientY = e.clientY;
      latestTarget = e.target as HTMLElement | null;
      if (rafId === null) {
        rafId = requestAnimationFrame(processPointerFrame);
      }
    };

    const handlePointerLeave = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      resetMagneticBtn(activeMagneticBtnRef.current);
      activeMagneticBtnRef.current = null;
      cachedCardRect = null;
      cachedBtnRect = null;
      rawMagX.set(0);
      rawMagY.set(0);
    };

    rootEl.addEventListener('pointermove', handlePointerMove, { passive: true });
    rootEl.addEventListener('pointerleave', handlePointerLeave, { passive: true });
    window.addEventListener('scroll', invalidateRectCache, { passive: true });
    window.addEventListener('resize', invalidateRectCache, { passive: true });

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      rootEl.removeEventListener('pointermove', handlePointerMove);
      rootEl.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('scroll', invalidateRectCache);
      window.removeEventListener('resize', invalidateRectCache);
      resetMagneticBtn(activeMagneticBtnRef.current);
    };
  }, [prefersReducedMotion, rawMagX, rawMagY]);

  useEffect(() => {
    const rootEl = rootRef.current;
    if (!rootEl) return;

    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // 1. Top Scroll Progress Indicator (scrubbed to page scroll)
      if (progressBarRef.current) {
        gsap.fromTo(
          progressBarRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: rootEl,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 0.15,
            },
          }
        );
      }

      // 2. Section ScrollTrigger Choreography (Section 9: 500–700ms duration, 24px Y, 80ms stagger)
      const sections = gsap.utils.toArray<HTMLElement>(
        rootEl.querySelectorAll('main > section:not(.sr-only)')
      );

      sections.forEach((section, index) => {
        // Active section ambient glow class toggle while in viewport center band
        ScrollTrigger.create({
          trigger: section,
          start: 'top 68%',
          end: 'bottom 32%',
          toggleClass: { targets: section, className: 'ellix-section-inview' },
        });

        // Skip scroll-reveal on the top Hero section (handled by Page Load Entrance Sequence)
        if (index === 0 || section.id === 'hero') {
          return;
        }

        // Section Heading Block Reveal (24px -> 0, 600ms)
        const headerBlock = section.querySelector(':scope > div > div:first-child');
        if (headerBlock) {
          gsap.fromTo(
            headerBlock,
            { y: 24, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.6,
              ease: 'power3.out',
              clearProps: 'transform,opacity,visibility',
              scrollTrigger: {
                trigger: section,
                start: 'top 86%',
                once: true,
              },
            }
          );
        }

        // Staggered Interactive Entry-Point Cards Reveal (0ms, 80ms, 160ms, 240ms...)
        const cards = section.querySelectorAll('.website-card-hover');
        if (cards.length > 0) {
          gsap.fromTo(
            cards,
            { y: 24, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.62,
              stagger: 0.08,
              ease: 'power3.out',
              overwrite: 'auto',
              onComplete: () => {
                // Clear inline GSAP transform/opacity so CSS :hover & interactive morphing remain 100% native
                gsap.set(cards, { clearProps: 'transform,opacity' });
              },
              scrollTrigger: {
                trigger: section,
                start: 'top 82%',
                once: true,
              },
            }
          );
        } else {
          // Fallback content container reveal for sections without .website-card-hover (e.g., FinalCTA)
          const contentBlock = section.querySelector(':scope > div > div:nth-child(2), :scope > div');
          if (contentBlock && contentBlock !== headerBlock) {
            gsap.fromTo(
              contentBlock,
              { y: 24, autoAlpha: 0 },
              {
                y: 0,
                autoAlpha: 1,
                duration: 0.65,
                ease: 'power3.out',
                clearProps: 'transform,opacity,visibility',
                scrollTrigger: {
                  trigger: section,
                  start: 'top 84%',
                  once: true,
                },
              }
            );
          }
        }
      });
    });

    return () => {
      mm.revert();
    };
  }, []);

  const handleOpenSignIn = () => {
    setIsGetStartedOpen(false);
    setIsSignInOpen(true);
  };

  const handleOpenGetStarted = () => {
    setIsSignInOpen(false);
    setIsGetStartedOpen(true);
  };

  if (activeLegalPageSlug) {
    return (
      <div className="website-root min-h-screen bg-[#fafafa] dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] selection:bg-emerald-500 selection:text-white antialiased overflow-x-hidden w-full max-w-full">
        <WebsiteCursor />
        <Suspense fallback={<div className="min-h-screen" />}>
          <LegalComplianceHub
            activeSlug={activeLegalPageSlug}
            onSelectSlug={handleNavigateToLegalPage}
            onBackToWebsite={handleCloseLegalPage}
            onOpenContactModal={() => setIsContactOpen(true)}
          />
        </Suspense>
        <LandingFooter
          onOpenSignIn={handleOpenSignIn}
          onOpenContact={() => setIsContactOpen(true)}
          onOpenPrivacy={() => handleNavigateToLegalPage('privacy-policy')}
          onOpenTerms={() => handleNavigateToLegalPage('terms-of-service')}
          onOpenLegalPage={handleNavigateToLegalPage}
          onOpenAiMetadata={() => setIsAiModalOpen(true)}
        />
        <Suspense fallback={null}>
          {isContactOpen && (
            <ContactModal
              isOpen={isContactOpen}
              onClose={() => setIsContactOpen(false)}
              onOpenLegalPage={handleNavigateToLegalPage}
            />
          )}
          {isSignInOpen && (
            <SignInModal
              isOpen={isSignInOpen}
              onClose={() => setIsSignInOpen(false)}
              onSwitchToGetStarted={handleOpenGetStarted}
              onLaunchApp={onLaunchApp}
            />
          )}
          {isGetStartedOpen && (
            <GetStartedModal
              isOpen={isGetStartedOpen}
              onClose={() => setIsGetStartedOpen(false)}
              onSwitchToSignIn={handleOpenSignIn}
              onOpenLegalPage={handleNavigateToLegalPage}
            />
          )}
          {isAiModalOpen && (
            <AiMetadataModal
              isOpen={isAiModalOpen}
              onClose={() => setIsAiModalOpen(false)}
            />
          )}
        </Suspense>
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className="website-root min-h-screen bg-[#fafafa] dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] selection:bg-emerald-500 selection:text-white antialiased overflow-x-hidden w-full max-w-full transition-colors duration-200"
    >
      {/* Top ScrollTrigger Progress Indicator */}
      <div
        ref={progressBarRef}
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 origin-left scale-x-0 z-[60] pointer-events-none shadow-[0_0_12px_rgba(16,185,129,0.65)]"
      />

      {/* Website-Only Smooth Interactive Cursor */}
      <WebsiteCursor />

      {/* 1. Header */}
      <LandingHeader
        onOpenSignIn={handleOpenSignIn}
        onOpenGetStarted={handleOpenGetStarted}
        onOpenAppPreview={onLaunchDemo}
        onOpenGuide={() => handleOpenGuide()}
        guideProgressStep={guideProgressState.currentStep}
        guideCompleted={guideProgressState.completed}
      />

      {/* Main Content Sections */}
      <main className="flex-1 w-full max-w-full overflow-x-hidden">
        
        {/* 2. Hero */}
        <HeroSection
          onOpenGetStarted={handleOpenGetStarted}
          onLaunchApp={onLaunchDemo}
          onOpenGuide={(step) => handleOpenGuide(step)}
          guideProgressStep={guideProgressState.currentStep}
          guideCompleted={guideProgressState.completed}
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
        <GuidebookPreview
          onOpenInteractiveGuide={(step) => handleOpenGuide(step)}
          guideProgressStep={guideProgressState.currentStep}
          guideCompleted={guideProgressState.completed}
        />

        {/* 10. FAQ Section */}
        <FAQSection onOpenContact={() => setIsContactOpen(true)} />

        {/* 11. Final CTA */}
        <FinalCTA onOpenGetStarted={handleOpenGetStarted} />

      </main>

      {/* 12. Footer */}
      <LandingFooter
        onOpenSignIn={handleOpenSignIn}
        onOpenContact={() => setIsContactOpen(true)}
        onOpenPrivacy={() => handleNavigateToLegalPage('privacy-policy')}
        onOpenTerms={() => handleNavigateToLegalPage('terms-of-service')}
        onOpenLegalPage={handleNavigateToLegalPage}
        onOpenAiMetadata={() => setIsAiModalOpen(true)}
        onOpenGuide={() => handleOpenGuide()}
      />

      {/* First-Time Visitor Guided Tour Prompt & Resume Pill (Sections 3 & 30) */}
      <FirstTimeGuideBanner
        isGuideOpen={isGuideModalOpen}
        onStartGuide={(step) => handleOpenGuide(step)}
        guideProgressStep={guideProgressState.currentStep}
        guideCompleted={guideProgressState.completed}
      />

      {/* Interactive 12-Chapter First-Time User Guide & Website Tour Modal */}
      <Suspense fallback={null}>
        {isGuideModalOpen && (
          <InteractiveUserGuideModal
            isOpen={isGuideModalOpen}
            onClose={handleCloseGuide}
            initialStep={guideInitialStep}
            onOpenGetStarted={handleOpenGetStarted}
            onOpenSignIn={handleOpenSignIn}
            onOpenContact={() => setIsContactOpen(true)}
            onNavigateToSection={handleNavigateToSection}
            onOpenLegalPage={handleNavigateToLegalPage}
            onLaunchDemo={onLaunchDemo}
            onProgressChange={() => syncGuideProgress()}
          />
        )}
      </Suspense>

      {/* Cookie & Local Storage Transparency Banner */}
      <CookieConsentBanner onOpenLegalPage={handleNavigateToLegalPage} />

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

      {/* Lazy-Loaded Informational & Lead Capture Modals */}
      <Suspense fallback={null}>
        {isAiModalOpen && (
          <AiMetadataModal
            isOpen={isAiModalOpen}
            onClose={() => setIsAiModalOpen(false)}
          />
        )}

        {isSignInOpen && (
          <SignInModal
            isOpen={isSignInOpen}
            onClose={() => setIsSignInOpen(false)}
            onSwitchToGetStarted={handleOpenGetStarted}
            onLaunchApp={onLaunchApp}
          />
        )}

        {isGetStartedOpen && (
          <GetStartedModal
            isOpen={isGetStartedOpen}
            onClose={() => setIsGetStartedOpen(false)}
            onSwitchToSignIn={handleOpenSignIn}
            onOpenLegalPage={handleNavigateToLegalPage}
          />
        )}

        {isContactOpen && (
          <ContactModal
            isOpen={isContactOpen}
            onClose={() => setIsContactOpen(false)}
            onOpenLegalPage={handleNavigateToLegalPage}
          />
        )}

        {legalModalType && (
          <LegalModal
            isOpen={!!legalModalType}
            onClose={() => setLegalModalType(null)}
            type={legalModalType}
          />
        )}
      </Suspense>

    </div>
  );
};
