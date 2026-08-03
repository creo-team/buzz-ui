/**
 * Server entry — everything here is safe to import in React Server
 * Components. Components without a "use client" directive render with ZERO
 * client JavaScript; the interactive ones (Button, Tabs, Banner, TopNav,
 * Infotip…) are client components that may be composed from RSC and hydrate
 * as islands.
 */

// Zero-JS server components
export * from './cards/card.js'
export * from './badges/badge.js'
export * from './data/chip.js'
export * from './alerts/alert.js'
export * from './navigation/breadcrumbs.js'
export * from './data/skeleton.js'
export * from './data/table.js'
export * from './data/code-box.js'
export * from './feedback/progress.js'
export * from './feedback/circular-progress.js'
export * from './media/avatar.js'
export * from './process/stepper.js'
export * from './layout/footer.js'
export * from './forms/field.js'
export * from './forms/input.js'
export * from './forms/textarea.js'
export * from './forms/select.js'
export * from './forms/checkbox.js'
export * from './forms/radio-group.js'
export * from './primitives/spinner.js'
export * from './primitives/kbd.js'
export * from './primitives/separator.js'
export * from './primitives/visually-hidden.js'
export { Slot, type SlotProps } from './internal/slot.js'

// Server-side theme helpers + shared theme types/constants
export * from './theme/theme-utils.js'
export * from './theme/theme-types.js'

// Interactive components (client islands) kept here for compatibility —
// importing them from a Server Component creates a client boundary.
export * from './forms/slider.js'
export * from './primitives/button.js'
export * from './alerts/banner.js'
export { Tabs, TabPanel, TabsVariant, TabsSize, type TabItem, type TabsProps, type TabPanelProps } from './navigation/tabs.js'
export * from './navigation/top-nav.js'
export * from './overlays/infotip.js'
