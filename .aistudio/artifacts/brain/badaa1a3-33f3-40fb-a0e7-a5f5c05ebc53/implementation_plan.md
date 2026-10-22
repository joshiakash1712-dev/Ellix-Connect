# WorksWheel 3D Workflow Integration

Integrate the interactive 3D `WorksWheel` portfolio drum into the store's Connected Workflow section, pairing each turning step with live synchronized retail data in an anchored side-by-side monitor.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following design and architectural decisions were confirmed via interactive clarification:

- **Confirmed Layout**: Side-by-side arrangement with the interactive 3D `WorksWheel` drum on one side and the live workflow monitor card anchored beside it.
- **Confirmed Interaction**: Turning the wheel (via wheel scroll, drag, arrow keys, or direct step selection) drives through the 6 store workflow stages (01 Products, 02 Customers, 03 Billing, 04 Payments, 05 Inventory, 06 Records), seamlessly updating the live monitor in real time.
- **Confirmed Visual Artwork**: 6 tailored, high-fidelity retail workflow visuals representing each operational milestone with crisp fallback artwork.
- **Codebase & Folder Architecture**: Support shadcn UI conventions by creating `/components/ui/works-wheel.tsx` and providing utility helper `cn` in `/lib/utils.ts` and `/src/lib/utils.ts`, while maintaining full TypeScript and Tailwind CSS v4 styling.

---

## 1. Overview & Core Concept

- **What It Does**: Replaces the conventional static workflow display with an immersive 3D cylindrical drum wheel (`WorksWheel`). As users scroll, drag, or turn the wheel, it smoothly transforms from an initial 3D ring into a perspective-warped drum, bringing each of the 6 retail workflow steps to the front while keeping the detailed live POS/Khata/Inventory monitor anchored beside it for deep reading.
- **Target Audience**: Store owners, retail managers, and cashiers evaluating Ellix Connect who want to see how data effortlessly moves from barcode scan to tax reporting.
- **Key Value**: Delivers a tangible, tactile experience of the retail pipeline—turning the wheel feels physical and directly illustrates cause-and-effect across retail operations.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Initial View (Ring at Rest)**: The wheel displays the 6 retail stages arranged in a 3D ring around the central label "Workflow '26".
2. **First Interaction (Drum Blow-Out)**: A wheel gesture or drag opens the ring into a 3D perspective drum. Stage 01 (Products) snaps forward at full scale, while neighbors tilt away into deep perspective.
3. **Continuous Turning & Synchronization**: As the user turns the wheel to any stage (e.g., Billing or Payments), the active stage index updates synchronously. The adjacent Live Workflow Monitor immediately displays that stage's invoice data, speed metrics, and automated ripple effect.
4. **Direct Step Jump**: Clicking any of the 6 step tags or the index list on the wheel glides the 3D drum straight to that stage with smooth easing.
5. **Responsive Fallback**: On mobile viewports, the drum scales gracefully to fit screen boundaries, with compact stage controls and touch-drag support.

### Visual Identity & Theme
- **Theme Consistency**: Full dark and light theme compatibility. The wheel uses semantic theme tokens (`bg-background`, `text-foreground`, `bg-muted`, `text-muted-foreground`) matching Ellix Connect's Electric Cobalt (`#2563EB`), Ice Cyan (`#38BDF8`), and Obsidian Midnight (`#070B14`) palette.
- **Card Geometry & Perspective**:
  - `CARD_RATIO`: 1.45 (classic 4:3 / 16:9 retail card proportion)
  - `DRUM`: 2.22 radii with lateral bow curvature (`BOW: 1.82`) so neighbor cards swing naturally along the focal arc.
  - Optical depth: Perspective focal distance tuned to avoid clipping on standard viewports.
- **Side-by-Side Composition**:
  - **Desktop (12-column grid)**: Left 7 columns house the interactive `WorksWheel` 3D stage (`min-h-[440px] lg:min-h-[520px]`); right 5 columns house the anchored Live Workflow Monitor.
  - **Mobile**: Vertically stacked with touch-draggable 3D wheel on top and live workflow monitor card below.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Direct Two-Way Synchronization**
  - *Chosen Approach*: Link `WorksWheel`'s active turn state with the live workflow monitor's state. When `active` changes in `WorksWheel`, it notifies the parent via an `onActiveChange` callback or controlled prop so the adjacent monitor updates without lag.
  - *Why*: Ensures the 3D visual spectacle directly serves product comprehension rather than existing as an isolated decorative toy.
  - *Alternatives Considered*: Independent wheel without monitor synchronization (rejected: would disconnect the visual from the explanatory text).

- **Decision 2: shadcn UI Structure Compliance**
  - *Chosen Approach*: Place `works-wheel.tsx` at `/components/ui/works-wheel.tsx` (and symlink/export from `src/components/ui/` if required). Ensure `/lib/utils.ts` exports `cn(...)` using standard `clsx` and `tailwind-merge` logic.
  - *Why*: Adheres to shadcn conventions requested by the user, enabling simple copy-paste and future component imports via standard paths.

- **Decision 3: Image Assets & Visual Resiliency**
  - *Chosen Approach*: Deliver high-resolution tailored retail workflow visuals for the 6 stages (Products, Customers, POS Billing, UPI Payments, Stock Engine, GST Reports) with robust CSS SVG fallbacks so cards never show broken images.
  - *Why*: Satisfies the user's explicit preference for tailored retail illustrations while ensuring zero broken image frames in hermetic sandbox environments.

---

## 4. Technical Architecture & Data Strategy

### System Component Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                   section#workflow (ConnectedWorkflow)                 │
├────────────────────────────────────────────────────────────────────────┤
│  Top Header: Section Title + Editorial Step Progress                   │
│  Stage Navigation Strip: 6 Step Quick-Jump Buttons (01 -> 06)          │
├───────────────────────────────────┬────────────────────────────────────┤
│   Left Column (lg:col-span-7)     │    Right Column (lg:col-span-5)    │
│   WorksWheel 3D Container         │    Live Workflow Monitor           │
│  ┌─────────────────────────────┐  │  ┌──────────────────────────────┐  │
│  │  3D Preserved Perspective   │  │  │ Step Badge & Live Status     │  │
│  │  Turning Drum / Ring Cards  ├──┼─►│ Active Invoice / Stock Snippet│ │
│  │  [01 Products]              │  │  │ Automated Ripple Callout     │  │
│  │  [02 Customers]             │  │  │ Step Prev / Next Controls    │  │
│  │  [03 Billing] (Active Front)│  │  └──────────────────────────────┘  │
│  │  [04 Payments]              │  │                                    │
│  │  [05 Inventory]             │  │                                    │
│  │  [06 Records]               │  │                                    │
│  └─────────────────────────────┘  │                                    │
└───────────────────────────────────┴────────────────────────────────────┘
```

### Component & Path Layout
1. **Utility Path**: `/lib/utils.ts` and `/src/lib/utils.ts` providing `cn(...)`.
2. **shadcn UI Primitive**: `/components/ui/works-wheel.tsx` (and `src/components/ui/works-wheel.tsx`) with added `onActiveChange?: (index: number) => void` and controlled `activeIndex?: number` support for two-way synchronization.
3. **Workflow Integration**: `src/components/landing/ConnectedWorkflow.tsx` updated to host `WorksWheel` beside the live monitor card inside `section#workflow`.
4. **Tailwind & Theme Tokens**: Verify CSS variable mappings in `src/index.css` for `--background`, `--foreground`, `--muted`, and `--muted-foreground`.

---

## Verification & Quality Assurance Plan

1. **Compilation Check**: Run `compile_applet` to confirm zero TypeScript compilation errors with Vite.
2. **Lint Verification**: Run `lint_applet` (`tsc --noEmit`) to verify strict type safety.
3. **Interactive Testing**: Verify 3D wheel turns smoothly via mouse drag, wheel scroll, arrow keys, and stage button clicks; confirm live monitor reflects the active step instantaneously.
4. **Theme Verification**: Verify crisp visual contrast across both Light and Dark themes.
