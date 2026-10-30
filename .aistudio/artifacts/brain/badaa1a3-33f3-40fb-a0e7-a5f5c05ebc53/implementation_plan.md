# Admin & Super Admin Governance, Store Subscription Paywall, and Platform Analytics

Implement refined role-based governance establishing `ellixorrr@gmail.com` as the sole Super Admin and `ellic.admin11@gmail.com` as Admin, enforce `customer` as the default role for all new sign-ins with admin role promotion/demotion authority, add store subscription pause controls with an access-blocking paywall for unpaid stores, and provide a comprehensive platform analytics suite (live visitor counter, daily traffic trends, conversion metrics, review totals, and online vs. paused store statuses).

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural decisions were aligned and confirmed with the user during Phase 1:
> - **Sole Super Admin**: `ellixorrr@gmail.com` is configured as the sole Super Admin with root platform governance. `ellic.admin11@gmail.com` is configured as Admin with client, user, and store management authority.
> - **Default New User Role**: Every new user login automatically defaults to the `customer` role until promoted by an Admin or Super Admin to `client`, `crew`, or `admin`.
> - **Store Subscription Enforcement**: If a client store is unpaid or paused by an Admin, store owners and crew are blocked from conducting billing and store operations, and are presented with an interactive subscription payment paywall.
> - **Platform Analytics Scope**: The Admin console includes both real-time visitor session counters and daily historical traffic charts with visitor-to-client conversion rates, store operational statuses, customer growth, and aggregate review ratings.

---

### 1. Overview & Core Concept

- **What It Does**:
  1. **Strict Authority Hierarchy**: Confirms `ellixorrr@gmail.com` as the sole Super Admin and `ellic.admin11@gmail.com` as Admin. All other sign-ins start with the `customer` role. Admins can promote/demote users across roles (`customer` ↔ `client` ↔ `crew` ↔ `admin`).
  2. **Paid Store & Subscription Enforcement**: Identifies store clients by paid subscription status. When an Admin pauses an unpaid store, access to the POS, inventory, and ledger is locked with a branded Subscription Paywall prompting payment to reactivate.
  3. **Privacy-Preserving Admin Model**: Preserves the privacy boundary where Admins govern store lifecycle, subscriptions, and platform telemetry without inspecting confidential individual store receipts or internal cash drawers.
  4. **Platform Analytics Suite**: Provides live visitor tracking for `ellico.ai.studio`, tracking active online sessions, total daily unique visitors, customer-to-client conversion funnels, review sentiment/ratings, and active vs. paused store tallies.

- **Target Audience / Persona**:
  - **Super Admin (`ellixorrr@gmail.com`)**: Root authority managing platform infrastructure, administrative permissions, system security, and high-level operations.
  - **Admin (`ellic.admin11@gmail.com`)**: Platform operator monitoring site traffic, onboarding/offboarding clients, managing unpaid stores, and viewing overarching health metrics.
  - **Customers & Store Clients**: Registered users who browse services and store merchants whose access depends on valid subscription standing.

- **Key Value**:
  Eliminates unauthorized privilege escalation, automates subscription billing compliance for store owners, prevents unpaid usage, and empowers administrators with actionable traffic and conversion telemetry.

---

### 2. User Experience & Visual Design

#### Key User Flows
1. **User Sign-In & Onboarding**:
   - A user signs in with Google or Email/Password.
   - If the user is `ellixorrr@gmail.com`, they immediately receive `super_admin`.
   - If the user is `ellic.admin11@gmail.com`, they immediately receive `ellix_admin`.
   - All other users receive `customer` role and can view consumer-facing features, place orders, and browse public store directories.
2. **Admin Role Promotion & User Management**:
   - Admin navigates to the **Platform Console** > **Client & User Access** tab.
   - Admin views segmented filters (`All Users`, `Customers`, `Clients (Store Owners)`, `Crew Staff`, `Admins`).
   - Admin can promote a `customer` to `client`, assign a store, or revoke access with 1 click.
3. **Store Subscription Pause & Paywall**:
   - In **Clients & Subscriptions** or **Stores & Franchises**, Admin sees subscription status badges (`Paid / Active`, `Unpaid / Paused`, `Trial`).
   - Admin can toggle store status to **Paused (Unpaid)**.
   - When a merchant or employee of that paused store logs in or attempts to use the POS/Inventory, an overlay modal displays: `"Store Access Paused — Subscription Payment Pending"` with direct payment resolution actions.
4. **Platform Telemetry & Analytics Dashboard**:
   - In **Admin Overview / Platform Console**, Admin views:
     - Real-time active visitor badge & total visitor counter.
     - 14-day daily visitor & pageview trend chart using Recharts.
     - Funnel metrics: Visitors → Registered Customers → Paid Client Stores.
     - Store Health: Online Stores, Paused Stores, and Aggregate Customer Review Ratings.

#### Visual Identity & Theme
- **Color Palette & Styling**:
  - Background: Crisp dark slate (`#0B0F19`) / light neutral (`#F8FAFC`).
  - Structural Cards: Flat single-elevation surfaces with subtle 1px border lines (`border-slate-800` / `border-slate-200`).
  - Status Accents:
    - Paid / Active: Emerald (`#10B981`)
    - Paused / Unpaid: Amber / Crimson (`#F59E0B` / `#EF4444`)
    - Super Admin Accent: Violet / Indigo (`#6366F1`)
    - Admin Accent: Cyan / Blue (`#0EA5E9`)
- **Typography & Hierarchy**:
  - Display Font: `Plus Jakarta Sans` / `Outfit` for clean dashboard headers.
  - Data Numerals: Monospace tabular numbers (`font-mono tabular-nums`) for visitor counts, ratings, and subscription metrics.
- **Zero-Pill Restraint**:
  - Metadata rendered as clean unboxed text separated by subtle middots (`·`).
  - Interactive tabs styled with clean segmented backgrounds.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Sole Super Admin Configuration**:
  - *Chosen Approach*: Assign `super_admin` exclusively to `ellixorrr@gmail.com`. Retain `ellic.admin11@gmail.com` as `ellix_admin`. Remove default root super-admin claims from previous emails while ensuring seamless fallback for developer verification.
  - *Why*: Directly aligns with user requirement: "confirm the admin as ellic.admin11@gmail.com & ellixorrr@gmail.com as super admin" and the clarified answer: "Make ellixorrr@gmail.com the sole Super Admin".
- **Decision 2: Default Role as 'Customer' on First Login**:
  - *Chosen Approach*: Update `AuthContext.tsx`, `server.ts`, and Firestore sync logic so that any new unassigned user defaults to `customer`.
  - *Why*: Prevents accidental granting of merchant store ownership (`client`) or privileged actions to general public sign-ins.
- **Decision 3: Paused Store Enforcement via Interceptor Component**:
  - *Chosen Approach*: Create a non-intrusive Store Guard inside `RetailerDashboard.tsx` and POS routing that inspects `activeStore.status` or `activeStore.subscriptionStatus`. If paused, displays the Subscription Paywall and halts transactional writes.
  - *Why*: Allows merchants to see their billing invoice status and contact support without destroying their store data.
- **Decision 4: Visitor Tracking Mechanism**:
  - *Chosen Approach*: Implement a lightweight client-side visitor tracker in `App.tsx` that increments session visits in Firestore (`platform_telemetry/visitors`) and stores daily session metrics, backed by a resilient fallback cache for offline use.
  - *Why*: Provides immediate, real-time feedback in the admin dashboard without requiring heavy external tracking scripts or cookies.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ELLIC CLIENT BROWSER                            │
│                                                                        │
│   App.tsx  ──(Logs page visit)──►  VisitorTracker Service              │
│      │                                    │                            │
│      ▼                                    ▼                            │
│   AuthContext.tsx  ──►  Role Resolver:                                 │
│     • ellixorrr@gmail.com   ──►  'super_admin'                         │
│     • ellic.admin11@gmail.com ──►  'ellix_admin'                       │
│     • All other new logins  ──►  'customer' (default)                  │
│                                                                        │
│   StoreContext.tsx ──►  Store & Subscription State                     │
│      │                                                                 │
│      ├─► Store Paused? ──► Render <SubscriptionPaywall /> (Lock POS)   │
│      └─► Store Active? ──► Render Normal POS & Inventory Modules       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                         ADMIN PANEL CONSOLE                            │
│                                                                        │
│   AdminPanel.tsx                                                       │
│      ├─► AdminOverview.tsx:                                            │
│      │     • Live Session Counter & Total Visitors                     │
│      │     • 14-Day Visitor & Conversion Chart (Recharts)              │
│      │     • Store Status Tally (Online vs. Paused Unpaid)             │
│      │     • Customer Review Analytics (Average & Distribution)        │
│      ├─► AdminClients.tsx:                                             │
│      │     • Client Subscription Management (Active / Paused Unpaid)   │
│      │     • Pause Store / Resume Store Action Handlers                │
│      └─► AdminUsersRBAC.tsx:                                           │
│            • Promote Customer ◄──► Client ◄──► Crew ◄──► Admin         │
│            • Filter by Role ('customer', 'client', 'crew', 'admin')    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                  EXPRESS BACKEND (server.ts) & FIRESTORE               │
│                                                                        │
│   • /api/telemetry/visit  ──► Updates real-time & daily visitor counters│
│   • /api/admin/role       ──► Authoritative role update (Admin/Super)  │
│   • /api/admin/store-status ──► Toggle active / paused subscription    │
│   • Collections:                                                       │
│       - 'users/{uid}' (role: 'customer' | 'client' | 'ellix_admin'...) │
│       - 'stores/{storeId}' (subscriptionStatus: 'paid' | 'unpaid')     │
│       - 'telemetry/analytics' (dailyVisits, liveSessions, totalHits)   │
└────────────────────────────────────────────────────────────────────────┘
```

#### State & Data Model Updates
1. **User Schema (`src/types.ts` & `server.ts`)**:
   - `CanonicalRole`: `'super_admin' | 'ellix_admin' | 'client' | 'customer' | 'crew' | 'wholesaler_admin' | 'unauthorized'`.
   - `User.role` and `UserProfile.role` explicitly support `'customer'`.
2. **Store Schema (`src/types.ts`)**:
   - `status`: `'active' | 'paused' | 'unpaid'`.
   - `subscriptionStatus`: `'paid' | 'unpaid' | 'expired' | 'trial'`.
   - `pausedReason`: string (e.g. `'Subscription payment overdue'`).
3. **Telemetry & Visitor Analytics Schema**:
   - `VisitorStats`:
     - `activeVisitors`: number
     - `totalVisitors`: number
     - `dailyTrends`: `{ date: string; visitors: number; pageViews: number; conversions: number }[]`
     - `customerCount`: number
     - `clientCount`: number
     - `onlineStores`: number
     - `pausedStores`: number
     - `averageRating`: number
     - `totalReviews`: number

#### Implementation Steps
1. **Types & Server Role Policy**:
   - Update `CanonicalRole` and `normalizeCanonicalRole` in `src/types.ts` and `server.ts` to include `'customer'`.
   - Configure `ellixorrr@gmail.com` as sole Super Admin and `ellic.admin11@gmail.com` as Admin.
   - Set fallback initial role for all new user registrations to `'customer'`.
2. **Auth & Profile Synchronization**:
   - Update `src/context/AuthContext.tsx` to initialize new users as `'customer'`.
   - Ensure Admin and Super Admin can edit and promote any user's role.
3. **Store Subscription & Pause Mechanism**:
   - Add `toggleStorePause(storeId: string, isPaused: boolean, reason?: string)` in `StoreContext.tsx`.
   - Integrate pause button into `AdminStores.tsx` and `AdminClients.tsx`.
   - Wire `<SubscriptionPaywall />` in `RetailerDashboard.tsx` to prevent access to POS/inventory if the current store is paused/unpaid.
4. **Visitor Tracking & Admin Overview Analytics**:
   - Implement visitor session logging in `App.tsx` and StoreContext.
   - Enhance `AdminOverview.tsx` and `AdminOverviewSummary.tsx` with:
     - Real-time session indicator & total visitor stats.
     - Daily visitor and conversion rate chart.
     - Store operational status breakdown (Paid Online vs. Unpaid Paused).
     - Customer reviews and sentiment metrics.
5. **Verification**:
   - Validate through `npm run build`, `lint_applet`, and `compile_applet`.
