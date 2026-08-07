# Changelog

## 0.6.0

The Style system: ten holistic looks-and-feels, independent of color theme.

### New

- **Styles** — `data-style` on `<html>` (whole app) or any container
  (scoped section) selects one of ten coherent visual personalities:
  `soft` (default) · `crisp` · `sharp` · `flat` · `depth` · `glass` ·
  `round` · `puff` · `toy` · `brutal`. Each preset is a single token block
  covering corner radius, shadow character, border weight/color, surface
  treatment, control shape, spacing density, and motion (easing, duration,
  and an entrance/exit animation multiplier). 6 themes × 10 styles = 60
  looks from one stylesheet.
  - **glass** implements liquid-glass surfaces: `color-mix` translucency +
    `backdrop-filter: saturate(180%) blur(16px)` with a specular top edge
    baked into the shadow tokens, capsule controls, per-surface tuning
    (heavier blur on modals, more opacity on toasts/menus), a one-glass-
    layer-per-stack guard for nested surfaces, gated *together* behind
    `@supports (backdrop-filter…)` so unsupported browsers keep fully
    opaque surfaces, and `prefers-reduced-transparency` support.
  - **brutal**/`toy`/`puff` carry structural signatures (slam-press into
    the shadow, 3D bottom edge that collapses on press, extrusion that
    inverts on press) — all keyed off the style attribute, none leaking
    into other styles.
- `StyleSwitcher` — a picker whose tiles are *real scoped previews*: each
  tile carries its own `data-style`, so every chip renders with that
  preset's actual tokens. Built on Popover; `useStyleSwitcher` exposes the
  engine (own `style` cookie, DOM application, toast announcement).
- `getServerStyle` + `styleInitScript` for flicker-free SSR, mirroring the
  color-theme contracts exactly. `Style` enum, `ALL_STYLES`,
  `STYLE_COOKIE_NAME`, cookie helpers exported from root, `/server` and
  `/client`.
- New style-axis tokens (all defaulting to today's shipped values, so the
  zero-diff guarantee holds for consumers who never opt in):
  `--bz-border-w`, `--bz-border-c`, `--bz-border-c-strong`,
  `--bz-surface-bg`, `--bz-surface-filter`, `--bz-overlay-bg`,
  `--bz-control-radius`, `--bz-density`, `--bz-anim`, `--bz-glass-mix`.

### Hardened (adversarial review of the diff before shipping)

- Theme selectors re-derive the `--bz-*` indirection tokens, so a scoped
  theme container (`<div class="dark">`) resolves surfaces/borders against
  its own colors instead of inheriting the outer theme's frozen values.
- Every preset block restates the full style-axis token set (including a
  real `[data-style='soft']` reset block), and structural rules live in
  `@scope … to ([data-style])` donuts — nested scoped previews can neither
  inherit another preset's tokens nor catch its interaction rules, so the
  switcher tiles and gallery panels never lie.
- `prefers-reduced-transparency` now out-cascades glass's per-surface
  tuning (modals, drawers, palette, toasts, menus, listboxes included).
- Cascade ties fixed: toy/flat press feedback survives hover overrides,
  puff/toy preserve the `[data-selected]` ring, depth keeps elevated cards
  above base cards and its borderless look through hover, crisp keeps the
  danger signal on invalid-input focus.
- `useStyleSwitcher` instances stay in sync via a shared broadcast; the
  switcher trigger's accessible name contains its visible label; gallery
  buttons no longer drop keyboard focus on activation; switcher controls
  joined the shared focus-ring list. `getServerStyle` gained
  `getServerTheme`'s bare-default overload for exact contract parity.

### Changed (supersedes 0.4.0's Shape system — never published)

- The 3-preset Shape axis (`data-shape`, `ShapeSwitcher`, `getServerShape`)
  is replaced by the Style axis before ever shipping in a release. `sharp`
  and `round` live on as full Style presets; `soft` remains the untouched
  default.

## 0.5.0

Two roadmap components, closing out Phase 1 and Phase 2 of the component
roadmap.

### New

- **Fab** — a Button pinned to a screen corner via `position: fixed`. Same
  variants, sizes, hotkeys and `asChild` polymorphism as Button; add
  `position` (`bottom-right` default, plus the other three corners and both
  centers) and `offset`. Sits at z-index 40, below every overlay, so an open
  modal/popover/tooltip/toast always wins visually. Centered positions avoid
  `transform` for centering specifically so they don't fight Button's own
  hover-lift/press-scale animations.
- **Combobox** — filterable single-select input implementing the WAI-ARIA
  combobox + listbox pattern, built on the same overlay engine as Dropdown
  (portal, collision-aware positioning, shared layer-stack dismissal).
  Focusing shows every option; typing filters (case-insensitive substring by
  default, or pass `filter` for server-side search); `onInputChange` fires
  per keystroke for your own debounced async fetch; `loading` swaps the
  chevron for a spinner. Controlled (`value`/`onChange`) or uncontrolled
  (`defaultValue`); `name` renders a hidden input so the selection
  participates in native form submission; `clearable` shows a (×) button.
  Closing without selecting (Escape, outside-press, Tab) reverts the typed
  text to the current selection instead of leaving a dangling string.
  Keyboard navigation skips disabled options entirely, matching Dropdown's
  existing precedent, rather than landing on one Enter can't select.

## 0.4.0

Elegance pass: a second, independent design dimension, plus a round of
motion/interaction polish.

### New

- **Shape system** — `data-shape` (`sharp` / `soft` / `round`) covering
  corner radius, shadow weight and motion timing, completely orthogonal to
  color theme: any shape combines with any of the six built-in themes (18
  looks, one stylesheet, zero extra CSS). Ships `ShapeSwitcher`,
  `useShapeSwitcher`, `getServerShape`, `shapeInitScript`, and the `Shape`
  enum / `ALL_SHAPES` / cookie helpers — mirroring the color-theme SSR
  pattern exactly (own cookie, flicker-free hard loads, `initialShape` to
  skip the mount fallback). `soft` is the unmodified `:root` default, so
  existing consumers see no visual change unless they opt in.

### Improved

- Subtle hover-lift (`translateY`) on filled button variants
  (`bold`/`success`/`danger`) and interactive `Card`s. Press feedback
  (`:active` scale) still wins over the lift when both are true at once —
  hovering while pressing scales down rather than staying lifted.

### Fixed

- Cookie-writer strings (`setThemeCookie`, `setShapeCookie`,
  `ThemeProvider`'s internal cookie write) now include a space after each
  `;` separator, matching standard `Set-Cookie` formatting and fixing naive
  substring-based cookie parsers that split on `'; '`.

## 0.3.0

Quality pass driven by a full multi-lens audit (correctness, accessibility,
API consistency, performance, CSS, RSC/build, tests, docs accuracy).

### New

- **Slider** — range input built on the native platform control: themed
  filled track and thumb, marks with active states, value display with
  `formatValue`, `onChangeEnd` commit events, sizes, controlled/uncontrolled,
  form submission via `name`.
- **CI** — pull requests now run typecheck, tests, the library build (with
  its RSC-boundary verification) and the site build.

### Fixed

- Popover now returns focus to its trigger on close (APG popover pattern)
  instead of the previously focused element, unless focus moved elsewhere.
- Audit-driven fixes across the library (see the PR for the itemized list).

### Docs

- Toast docs page rewritten for the built-in system (the old page still
  documented react-hot-toast).
- Tooltip docs page updated — removed framer-motion animation samples that no
  longer exist; documented `title`, `onOpenChange` and the focus/Escape
  behavior.
- New docs pages: Popover, Slider.
- The showcase site no longer depends on framer-motion or react-hot-toast.

## 0.2.0

Ground-up architecture pass: zero dependencies, shipped stylesheet, RSC-first
module graph, and real accessibility across every component.

### Highlights

- **Zero runtime dependencies.** `framer-motion`, `react-hot-toast`,
  `react-hotkeys-hook`, and `lucide-react` are gone. Animations are CSS,
  toasts and hotkeys are built in, icons are inlined.
- **The package now works standalone.** `@creo-team/buzz-ui/styles.css` ships
  every design token (all six themes) and all component styles. Previously the
  published package rendered unstyled unless the consumer recreated the
  tokens and scanned library sources with Tailwind.
- **ESM-only, per-file build.** `"use client"` directives are preserved per
  module, so React Server Components get zero-JS static components and precise
  client islands. Tree-shaking works at file granularity.
- **React 18.3 and React 19** peer support.

### New

- Components: `Popover` (+`PopoverTrigger`/`PopoverContent`), `Field`,
  `Spinner`, `Kbd`, `Separator`, `VisuallyHidden`, `AvatarGroup`, `Slot`,
  `Toaster`, `Input` (alias of `TextInput`).
- `toast` API: `toast()`, `.success/.error/.warning/.info/.loading`,
  `.promise`, `.dismiss` — with pause-on-hover, per-position stacking, exit
  animations, and screen-reader announcements.
- `Button asChild` — merge button behavior onto links or any element.
- Uncontrolled modes: `Tabs defaultValue`, `Accordion defaultOpenKey`,
  `Switch defaultChecked`, `RadioGroup defaultValue`.
- Keyboard: WAI-ARIA menu interaction for `Dropdown`/`Menu` (arrows, Home/End,
  typeahead, focus return), roving-tabindex `Tabs` with auto/manual
  activation, combobox pattern (`aria-activedescendant`) for
  `CommandPalette`.
- Overlay engine: portal + collision-aware positioning (flip/shift + arrow),
  shared layer stack (Escape/outside-press dismiss the topmost overlay only),
  ref-counted scroll lock with scrollbar compensation, focus trap with
  restoration.
- Theming: `themeInitScript()` for flash-free hard loads; `getServerTheme`
  now accepts a Next.js `cookies()` store or a raw Cookie header;
  `useThemeSwitcher` hook exposed for custom switchers.
- Hotkeys: `mod` modifier (⌘/Ctrl), form-tag guards, dynamic config arrays,
  `isMacPlatform()`.
- `Textarea autoResize` via CSS `field-sizing` (zero JS), `Chip onRemove`,
  `Table` striped/hover/dense/empty-state/caption, `Skeleton` variants +
  `lines`, `Pagination` numbered pages with ellipsis, `Breadcrumbs maxItems` +
  `separator`, `Stepper` completed states + vertical orientation, `Modal`
  sizes/`showCloseButton`/`dismissible`/`alertdialog`, `Drawer` enter *and*
  exit animations, `TopNav`/`SidebarNav` `linkComponent` for framework links.

### Fixed

- `Modal` crashed during SSR (`createPortal` ran on the server).
- `Tooltip` was clipped by `overflow: hidden` ancestors, only worked with a
  mouse, and ignored WCAG 1.4.13 (no Escape dismissal, no `aria-describedby`).
- Rules-of-hooks violations: conditional `useId` in `TextInput`, conditional
  `useHotkey` in `CycleThemeSwitcher`, loop-of-hooks in `useHotkey` with
  arrays.
- Hard-coded dark-mode colors in `Checkbox`, `RadioGroup`, `Switch`,
  `Skeleton`, `Table`, `Stepper`, `Pagination`, `Accordion`, `CopyButton`,
  `Avatar` made them unreadable in light themes.
- `Select`'s chevron never rendered (malformed data URI).
- `getServerTheme` silently returned the default in ESM runtimes
  (`require('next/headers')` in an ESM module).
- Scroll lock destroyed pre-existing body styles and shifted layout; now
  ref-counted with scrollbar-width compensation.
- `ThemeProvider` re-applied the theme on every render (unstable effect
  dependency).
- Focus was never trapped nor restored by `Modal`/`Drawer`/`CommandPalette`.
- ~800 lines of duplicated logic across the three theme switchers collapsed
  into one shared engine.

### Breaking

- **Import the stylesheet**: add `import '@creo-team/buzz-ui/styles.css'`
  once. Tailwind is no longer required (nor scanned).
- **ESM-only** package (`"type": "module"`, no CJS build).
- `AnimationPresets` and the `types/animations` module are removed. Tooltip
  still accepts (and ignores) `animationVariants`; Modal and Dropdown no
  longer take the prop. Animations are CSS — override the `bz-*`
  keyframes/classes instead.
- The demo components `HotkeyDemo` and `TooltipSizesDemo` are no longer
  exported.
- `client` no longer re-exports react-hot-toast; `toast`/`Toaster` now refer
  to the built-in system (compatible call signatures for common cases).
  `HotToastProvider`/`ToastProvider` still work as deprecated aliases of
  `Toaster`.
- Component DOM/classes changed from Tailwind utility lists to stable `bz-*`
  classes with `data-*` state attributes. `className` passthrough is
  unchanged.

### Migration

```diff
+ import '@creo-team/buzz-ui/styles.css'   // once, at the app root

- import toast, { Toaster } from 'react-hot-toast'
+ import { toast, Toaster } from '@creo-team/buzz-ui/client'

- <Modal isOpen={open} onClose={close} maxWidthClassName="max-w-2xl">
+ <Modal open={open} onClose={close} size="lg">   // old props still work

- const theme = getServerTheme()
+ const theme = getServerTheme(cookies())          // Next.js App Router
```
