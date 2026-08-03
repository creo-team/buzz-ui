/**
 * Root entry — the full component library.
 *
 * For fine-grained React Server Component control:
 *  - '@creo-team/buzz-ui/server' → RSC-safe subset (zero-JS where possible)
 *  - '@creo-team/buzz-ui/client' → interactive components and hooks
 *
 * Both re-export the same modules, so mixing entries never duplicates code.
 */

// Server-safe components
export * from './cards/card.js'
export * from './badges/badge.js'
export * from './data/chip.js'
export * from './alerts/alert.js'
export * from './navigation/breadcrumbs.js'
export * from './data/skeleton.js'
export * from './data/table.js'
export * from './data/code-box.js'
export * from './feedback/progress.js'
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
export * from './theme/theme-utils.js'
export * from './theme/theme-types.js'

// Interactive components
export * from './forms/slider.js'
export * from './primitives/button.js'
export * from './alerts/banner.js'
export * from './navigation/top-nav.js'
export * from './navigation/tabs.js'
export * from './navigation/menu.js'
export * from './navigation/pagination.js'
export * from './navigation/sidebar-nav.js'
export * from './inputs/switch.js'
export * from './disclosure/accordion.js'
export * from './utils/copy.js'
export * from './feedback/circular-progress.js'

// Overlays
export * from './overlays/tooltip.js'
export * from './overlays/popover.js'
export * from './overlays/modal.js'
export * from './overlays/drawer.js'
export * from './overlays/sheet.js'
export * from './overlays/dropdown.js'
export * from './overlays/command-palette.js'
export * from './overlays/infotip.js'
export {
	toast,
	Toaster,
	ToastProvider,
	useToast,
	type ToastOptions,
	type ToastItem,
	type ToastPosition,
	type ToastVariant,
	type ToasterProps,
	type ToastPromiseMessages,
} from './overlays/toast.js'
export { HotToastProvider } from './overlays/toast-provider.js'

// Theme system (client side)
export { ThemeProvider, useTheme, type ThemeProviderProps } from './theme/theme-provider.js'
export { ThemeSwitcher, type ThemeSwitcherProps } from './theme/theme-switcher.js'
export { EnhancedThemeSwitcher, type EnhancedThemeConfig, type EnhancedThemeSwitcherProps } from './theme/enhanced-theme-switcher.js'
export { CycleThemeSwitcher, type CycleThemeConfig, type CycleThemeSwitcherProps } from './theme/cycle-theme-switcher.js'
export { useThemeSwitcher, resolveThemeIcon, smartThemeIcon, type AnyThemeConfig } from './theme/use-theme-switcher.js'
export {
	ThemePreset,
	createThemeConfig,
	createStandardThemes,
	createLightDarkThemes,
	generateThemeCSS,
	applyThemeColors,
	THEME_PRESETS,
	type ThemeConfigWithPreset,
	type ThemeColorPalette,
} from './theme/theme-presets.js'

// Hooks & utilities
export * from './hooks/use-hotkey.js'
export * from './hooks/use-modal-query.js'
export { useReducedMotion } from './internal/use-reduced-motion.js'
export { Portal, type PortalProps } from './internal/portal.js'
export type { Side, Align } from './internal/use-position.js'
export { cx } from './internal/cx.js'
