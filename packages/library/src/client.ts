"use client"

/**
 * Client entry — interactive components, overlays, hooks and the theme
 * system. Import from '@creo-team/buzz-ui/client' inside client components,
 * or from the root entry anywhere.
 */

// Overlays
export * from './overlays/tooltip.js'
export * from './overlays/popover.js'
export * from './overlays/modal.js'
export * from './overlays/drawer.js'
export * from './overlays/sheet.js'
export * from './overlays/dropdown.js'
export * from './overlays/command-palette.js'
export * from './overlays/infotip.js'

// Toasts (zero-dependency, replaces react-hot-toast)
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

// Theme system
export { ThemeProvider, useTheme, type ThemeConfig, type ThemeProviderProps } from './theme/theme-provider.js'
export { ThemeSwitcher, type ThemeConfig as SwitcherThemeConfig, type ThemeSwitcherProps } from './theme/theme-switcher.js'
export { ShapeSwitcher, type ShapeSwitcherProps } from './theme/shape-switcher.js'
export { useShapeSwitcher, type UseShapeSwitcherOptions } from './theme/use-shape-switcher.js'
export {
	Shape,
	ALL_SHAPES,
	SHAPE_COOKIE_NAME,
	setShapeCookie,
	getShapeFromCookie,
	type ShapeConfig,
} from './theme/shape-types.js'
export { getServerShape, shapeInitScript } from './theme/shape-utils.js'
export { EnhancedThemeSwitcher, type EnhancedThemeConfig, type EnhancedThemeSwitcherProps } from './theme/enhanced-theme-switcher.js'
export { CycleThemeSwitcher, type CycleThemeConfig, type CycleThemeSwitcherProps } from './theme/cycle-theme-switcher.js'
export { useThemeSwitcher, resolveThemeIcon, smartThemeIcon, type AnyThemeConfig } from './theme/use-theme-switcher.js'
export {
	Theme,
	ThemeIcon,
	DEFAULT_THEMES,
	ALL_THEMES,
	THEME_COOKIE_NAME,
	setThemeCookie,
	getThemeFromCookie,
	type ThemeConfig as ThemeTypesConfig,
} from './theme/theme-types.js'
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

// Interactive controls
export * from './forms/slider.js'
export * from './forms/combobox.js'
export * from './inputs/switch.js'
export * from './primitives/button.js'
export * from './primitives/fab.js'
export * from './disclosure/accordion.js'
export * from './alerts/banner.js'
export * from './navigation/menu.js'
export * from './navigation/pagination.js'
export * from './navigation/sidebar-nav.js'
export * from './navigation/tabs.js'
export * from './navigation/top-nav.js'
export * from './utils/copy.js'
export * from './feedback/circular-progress.js'

// Server-safe primitives, re-exported here so client-focused imports (Kbd
// next to useHotkey, Field around a custom control) work from one entry.
export * from './primitives/kbd.js'
export * from './primitives/spinner.js'
export * from './primitives/separator.js'
export * from './primitives/visually-hidden.js'
export * from './forms/field.js'

// Hooks
export * from './hooks/use-hotkey.js'
export * from './hooks/use-modal-query.js'
export { useReducedMotion } from './internal/use-reduced-motion.js'
export { Portal, type PortalProps } from './internal/portal.js'
export type { Side, Align } from './internal/use-position.js'
