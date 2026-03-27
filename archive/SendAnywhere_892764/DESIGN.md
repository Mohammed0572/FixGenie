# The Design System: Editorial Precision for AI-Driven Triage

## 1. Overview & Creative North Star
**Creative North Star: "The Intelligent Canvas"**

This design system moves beyond the "dashboard-as-a-grid" cliché. Instead, it treats the UI as an editorial layout—a sophisticated, living document where AI-driven bug triage is presented with the clarity of a high-end technical journal. We avoid the "boxed-in" feel of traditional software by embracing **Intentional Asymmetry** and **Tonal Depth**.

The system is defined by a "Quiet Authority." We use expansive white space (using the `20` and `24` spacing tokens) to allow data to breathe, while high-contrast typography scales ensure that critical bug metadata is immediately legible. By overlapping surfaces and utilizing glassmorphism, we create a UI that feels multi-dimensional and responsive to the user's focus.

---

## 2. Colors & Surface Philosophy
The palette is rooted in a professional "Sky Blue" (`primary: #006591`) and deep architectural neutrals. 

### The "No-Line" Rule
**Strict Mandate:** Designers are prohibited from using 1px solid borders to section off the interface. 
Structure is achieved through **Background Shifts**. A sidebar should not be "bordered" off; it should simply exist as a `surface-container-low` section sitting against a `surface` background. This creates a seamless, modern aesthetic that feels integrated rather than partitioned.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of premium materials. Use the `surface-container` tiers to define "importance" through depth:
*   **Base Layer:** `surface` (#f7f9fb) – The desk on which the work sits.
*   **Section Layer:** `surface-container-low` (#f2f4f6) – Used for broad layout divisions.
*   **Interactive Layer:** `surface-container-lowest` (#ffffff) – Used for the primary "Active" cards or bug details to make them pop against the background.

### The Glass & Gradient Rule
To prevent the UI from feeling "flat," main Action Buttons or Hero Headers must use a subtle gradient transitioning from `primary` (#006591) to `primary_container` (#0ea5e9). For floating utility panels (like the AI Triage Assistant chat bubble), use **Glassmorphism**: 
*   **Fill:** `surface_container_lowest` at 80% opacity.
*   **Effect:** `backdrop-filter: blur(12px)`.

---

## 3. Typography
We utilize a dual-typeface system to balance technical precision with editorial elegance.

*   **Display & Headlines (Manrope):** Chosen for its geometric modernism. Use `display-lg` for high-level dashboard metrics and `headline-sm` for bug titles. This adds a "Signature" feel that differentiates the system from generic SaaS tools.
*   **Body & Labels (Inter):** The workhorse. Inter is used for all bug descriptions (`body-md`) and metadata tags (`label-md`). Its high x-height ensures readability even at small sizes.
*   **Intentional Contrast:** Pair a `headline-lg` title with a `label-sm` metadata string (all caps, tracked out +5%) to create a sophisticated hierarchical tension.

---

## 4. Elevation & Depth
In this system, elevation is a result of **Tonal Layering**, not just shadows.

*   **The Layering Principle:** Place a `surface-container-highest` element (e.g., a "high priority" bug badge) on top of a `surface-container-lowest` card. The shift in tone creates natural focus without visual noise.
*   **Ambient Shadows:** When an element must "float" (like a dropdown or the Theme Toggle), use an extra-diffused shadow: `box-shadow: 0 10px 40px -10px rgba(0, 101, 145, 0.08)`. Note the subtle tint of the primary color in the shadow to mimic natural light refraction.
*   **The "Ghost Border" Fallback:** If a boundary is strictly required for accessibility, use the `outline_variant` token at **15% opacity**. This creates a "suggestion" of a line rather than a hard barrier.

---

## 5. Components

### The Theme Toggle
Positioned in the top-right corner, the toggle is a **Glassmorphic Pill** (`rounded-full`). In Light Mode, it uses `surface_container_low`; in Dark Mode, it shifts to `inverse_surface`. The transition between modes must be a `300ms cubic-bezier(0.4, 0, 0.2, 1)` fade.

### Buttons
*   **Primary:** Uses the `xl` (1.5rem) corner radius. Background is a gradient of `primary` to `primary_container`. Text is `on_primary`.
*   **Secondary:** No background. Uses a `Ghost Border` and `primary` text.
*   **Tertiary:** Only text (`primary`) with a subtle `surface_container` hover state.

### Bug Cards & Lists
*   **No Dividers:** Lists of bugs must not use horizontal lines. Use `spacing-4` vertical gaps and a subtle hover shift to `surface_container_high`.
*   **The "AI-Insight" Card:** Cards containing AI-generated triage suggestions should use a `tertiary_container` (#de8712) subtle glow or a left-accent "soft-bar" (4px wide) to denote AI intervention.

### Chips & Metadata
Use `rounded-md` (0.75rem) for technical tags. To differentiate from buttons, chips should always use `surface-container-highest` with `on-surface-variant` text, keeping them subordinate in the visual hierarchy.

---

## 6. Do’s and Don'ts

### Do:
*   **Do** use `20` (5rem) or `24` (6rem) spacing for outer page margins to create a "Gallery" feel.
*   **Do** lean into the `xl` (1.5rem) corner radius for all major containers—it softens the technical nature of "bug tracking."
*   **Do** use `title-lg` for bug IDs to make them feel like a primary brand element.

### Don't:
*   **Don't** use 100% black text. Always use `on_surface` or `on_surface_variant` to maintain the sophisticated tonal range.
*   **Don't** use "Drop Shadows" on cards that are already sitting on a contrasting surface container. Let the color shift do the work.
*   **Don't** use standard "Warning Red" for every error. Use the `error` (#ba1a1a) and `error_container` tokens thoughtfully to maintain the professional, calm atmosphere of the triage assistant.