# Theming System

Buzz UI is themed entirely through CSS custom properties. The shipped
stylesheet (`@creo-team/buzz-ui/styles.css`) defines every token for six
built-in themes — `light`, `dark`, `midnight`, `forest`, `ocean`, `umbro` —
selected via `data-theme` on `<html>` (a matching class is also applied).

## Quick Start

```tsx
// 1. Import the stylesheet once (tokens + component styles)
import '@creo-team/buzz-ui/styles.css'

// 2. Add a switcher anywhere
import { ThemeSwitcher } from '@creo-team/buzz-ui/client'

<ThemeSwitcher />
```

Theme choice persists in a cookie, so the server can render the right theme on
the next request.

## Flicker-free SSR

Render the persisted theme on the server and guard against stale cached HTML
with a tiny inline script:

```tsx
// app/layout.tsx (Next.js App Router)
import { cookies } from 'next/headers'
import { getServerTheme, themeInitScript } from '@creo-team/buzz-ui/server'

export default async function RootLayout({ children }) {
	// `await` is required on Next 15 (async cookies) and harmless on Next 14.
	const theme = getServerTheme(await cookies(), 'light')
	return (
		<html lang="en" data-theme={theme} className={theme}>
			<head>
				<script dangerouslySetInnerHTML={{ __html: themeInitScript(theme) }} />
			</head>
			<body>{children}</body>
		</html>
	)
}
```

`getServerTheme` also accepts a raw `Cookie` header string, so it works in any
framework: `getServerTheme(request.headers.get('cookie') ?? '')`.

Pass the value to any switcher as `initialTheme` to skip its mount fallback:

```tsx
<ThemeSwitcher initialTheme={theme} />
```

## Switcher components

| Component | UI |
| --- | --- |
| `ThemeSwitcher` | Segmented pills (up to 3 themes) |
| `EnhancedThemeSwitcher` | Pills + dropdown for the rest |
| `CycleThemeSwitcher` | One button that cycles |

All share one engine (`useThemeSwitcher`) — cookie persistence, DOM
application, Alt+T cycling, and a toast announcement. Build your own switcher
on the same hook:

```tsx
import { useThemeSwitcher } from '@creo-team/buzz-ui/client'

const { theme, setTheme, cycle } = useThemeSwitcher({
	themes: [{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }],
})
```

## App-level context (optional)

```tsx
import { ThemeProvider, useTheme } from '@creo-team/buzz-ui/client'

<ThemeProvider defaultTheme="light">…</ThemeProvider>
const { theme, setTheme } = useTheme()
```

## CSS Variable Reference

These are the tokens the shipped stylesheet defines per theme and that every
component consumes. Override any of them under your own theme selector.

### Core

| Token | Purpose |
| --- | --- |
| `--c-background` | Page background |
| `--c-text` / `--c-text-secondary` / `--c-text-muted` | Text hierarchy |
| `--c-surface` / `--c-surface-2` / `--c-surface-3` | Surface hierarchy (cards → nested → code) |
| `--c-border` / `--c-border-strong` | Borders |
| `--c-hover` / `--c-active` | Interactive state backgrounds |
| `--c-focus` | Focus outline color (page-level `:focus-visible`) |

### Brand

| Token | Purpose |
| --- | --- |
| `--c-primary` / `--c-primary-hover` | Primary color + hover |
| `--c-primary-light` | Light primary background (badges, active nav) |
| `--c-on-primary` | Text on primary backgrounds |
| `--c-primary-ring` | Focus rings |

### Semantic

| Token | Purpose |
| --- | --- |
| `--c-success` / `--c-success-light` | Success + light background |
| `--c-warning` / `--c-warning-light` | Warning + light background |
| `--c-danger` / `--c-danger-light` | Danger/error + light background |
| `--c-info` / `--c-info-light` | Info + light background |
| `--c-on-success` / `--c-on-danger` | Text on success/danger buttons (default `#fff`) |

### Component overrides (optional, with fallbacks)

| Token | Falls back to |
| --- | --- |
| `--c-tooltip-bg` / `--c-tooltip-text` / `--c-tooltip-border` | surface / text / border |
| `--c-modal-bg` / `--c-modal-overlay` / `--c-modal-border` | surface / `rgba(0,0,0,.6)` / border |
| `--c-dropdown-bg` / `--c-dropdown-border` / `--c-dropdown-hover` | surface / border / hover |

### Shape & elevation

| Token | Purpose |
| --- | --- |
| `--radius-sm` … `--radius-2xl` | Radius scale (6–16px) |
| `--shadow-sm` … `--shadow-xl` | Elevation scale |
| `--bz-ease` / `--bz-duration` | Motion timing |

## Creating Custom Themes

### Method 1: Override Individual Variables

```css
html[data-theme="custom"] {
  --c-primary: #ff6b35;
  --c-primary-hover: #ff5722;
  --c-primary-light: #fff3f0;
  
  --c-surface: #fafafa;
  --c-surface-2: #f5f5f5;
  --c-surface-3: #eeeeee;
  
  --c-tooltip-bg: #333333;
  --c-tooltip-text: #ffffff;
}
```

### Method 2: Use Theme Configuration

```tsx
import { createThemeConfig, ThemePreset } from '@creo-team/buzz-ui'

const customTheme = createThemeConfig(ThemePreset.Light, {
  label: 'Custom Light',
  colors: {
    primary: '#ff6b35',
    primaryHover: '#ff5722',
    primaryLight: '#fff3f0',
    
    surface: '#fafafa',
    surface2: '#f5f5f5',
    surface3: '#eeeeee',
    
    tooltipBg: '#333333',
    tooltipText: '#ffffff',
  }
})
```

### Method 3: Create From Scratch

```tsx
const brandTheme = {
  value: 'brand',
  label: 'Brand Theme',
  icon: 'palette', // or a React component
  colors: {
    // Text colors
    text: '#2c3e50',
    textSecondary: '#5a6c7d',
    textMuted: '#95a5a6',
    textInverse: '#ffffff',
    
    // Surfaces
    background: '#ffffff',
    surface: '#ffffff',
    surface2: '#f8f9fa',
    surface3: '#e9ecef',
    surfaceOverlay: 'rgba(255, 255, 255, 0.95)',
    
    // Borders
    border: '#dee2e6',
    borderStrong: '#adb5bd',
    borderSubtle: '#f1f3f5',
    
    // Interactive
    hover: '#f8f9fa',
    hoverBorder: '#adb5bd',
    active: '#e9ecef',
    selected: '#e3f2fd',
    focus: 'rgba(66, 153, 225, 0.5)',
    
    // Brand colors
    primary: '#3498db',
    primaryLight: '#ebf5fb',
    primaryHover: '#2980b9',
    primaryForeground: '#ffffff',
    
    // Component-specific
    tooltipBg: '#2c3e50',
    tooltipText: '#ffffff',
    tooltipBorder: 'rgba(44, 62, 80, 0.1)',
    
    modalBg: '#ffffff',
    modalOverlay: 'rgba(0, 0, 0, 0.5)',
    modalBorder: '#dee2e6',
    
    dropdownBg: '#ffffff',
    dropdownBorder: '#dee2e6',
    dropdownHover: '#f8f9fa',
    
    codeBlockBg: '#282c34',
    codeBlockBorder: '#3e4451',
    codeBlockText: '#abb2bf',
    codeBlockLineNumber: '#5c6370',
    
    // Shadows
    shadowSm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    shadowMd: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    shadowLg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    shadowXl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
    
    // Radius
    radiusSm: '0.25rem',
    radiusMd: '0.375rem',
    radiusLg: '0.5rem',
    radiusXl: '0.75rem',
  }
}
```

## Component-Specific Theming

### Tooltips

Tooltips automatically adjust their position to stay within the viewport and use dedicated CSS variables. The max-width varies by size:
- **Compact (sm)**: max 320px (20rem)
- **Comfortable (md)**: max 576px (36rem)  
- **Spacious (lg)**: max 896px (56rem) - Perfect for extensive help text and documentation

```css
/* Custom tooltip styling */
html[data-theme="custom"] {
  --c-tooltip-bg: #1a1a1a;
  --c-tooltip-text: #ffffff;
  --c-tooltip-border: rgba(255, 255, 255, 0.1);
}
```

### Modals

Modals use overlay and background variables for proper theming:

```css
html[data-theme="custom"] {
  --c-modal-bg: #ffffff;
  --c-modal-overlay: rgba(0, 0, 0, 0.75);
  --c-modal-border: #e0e0e0;
}
```

### Code Blocks

Code blocks have their own color scheme for syntax highlighting:

```css
html[data-theme="custom"] {
  --c-code-block-bg: #011627;
  --c-code-block-border: #0d2847;
  --c-code-block-text: #d6deeb;
  --c-code-block-line-number: #5e7186;
}
```

## Applying Themes at Runtime

```tsx
import { applyThemeColors } from '@creo-team/buzz-ui'

// Apply theme colors dynamically
applyThemeColors({
  value: 'custom',
  label: 'Custom',
  colors: {
    primary: '#ff6b35',
    // ... other colors
  }
})
```

## Built-in Themes

The library includes 6 built-in themes:

- **Light** - Clean, bright theme
- **Dark** - Modern dark theme
- **Midnight** - Deep blue dark theme
- **Forest** - Nature-inspired green theme
- **Ocean** - Calming blue theme
- **Umbro** - Premium glassmorphic theme

Each theme provides a complete set of CSS variables for consistent styling across all components.

## Styles: ten looks-and-feels, independent of color

Color theme answers *light or dark, which brand color*. **Style** answers
*what personality does this product have* — corner radius, elevation
character, border weight, surface treatment (opaque vs. glass), spacing
density and motion feel, as one coherent preset. The two compose freely:
six color themes x ten styles is sixty distinct looks from one stylesheet.

Style is selected via `data-style` — on `<html>` for the whole app, or on
**any container** for a scoped section (every trait is an inherited custom
property). It writes only the style-axis tokens (`--radius-*`, `--shadow-*`,
`--bz-*`); it never touches a color token.

| Preset | Personality |
| --- | --- |
| `soft` | The shipped default — unmodified `:root` values. Upgrading consumers see no change unless they opt in. |
| `crisp` | Enterprise instrument panel: 2px corners, conservative shadows, compact density, keyboard-first focus. |
| `sharp` | Architectural precision: tight corners, hairline-ring elevation instead of blur. |
| `flat` | Quiet utility: hairlines and ink, shadows almost abolished, no hover lift. |
| `depth` | Cinematic layered elevation: stacked three-layer shadows; cards let elevation carry the edge. |
| `glass` | Liquid translucency: blurred, saturated surfaces, specular top edge, capsule controls. Falls back to opaque without `backdrop-filter` support, and honors `prefers-reduced-transparency`. |
| `round` | Warm and plush: generous corners, diffuse glow, gentle overshoot motion. |
| `puff` | Soft-extruded: controls pressed out of the page; both shadow poles derive from the theme background. |
| `toy` | Chunky and bouncy: pills with a physical 3D bottom edge that collapses on press. |
| `brutal` | Neo-brutalism: zero radius, 2px ink borders, hard offset shadows, slam press. |

```tsx
import { StyleSwitcher } from '@creo-team/buzz-ui/client'

<StyleSwitcher /> // a picker whose tiles are real scoped previews
```

It persists to its own `style` cookie and reads it back with
`getServerStyle` for the same flicker-free SSR pattern as the color theme:

```tsx
// app/layout.tsx
import { cookies } from 'next/headers'
import { getServerStyle, styleInitScript } from '@creo-team/buzz-ui/server'
import { StyleSwitcher } from '@creo-team/buzz-ui/client'

export default async function RootLayout({ children }) {
	const style = getServerStyle(await cookies(), 'soft')
	return (
		<html data-style={style}>
			<head>
				<script dangerouslySetInnerHTML={{ __html: styleInitScript(style) }} />
			</head>
			<body>
				<StyleSwitcher initialStyle={style} />
				{children}
			</body>
		</html>
	)
}
```

### Locking a style in, scoping, extending

The switcher is a convenience — the mechanism is inherited custom
properties under attribute selectors, so all of these work with no JS:

```html
<!-- Whole app, forever -->
<html data-style="glass">

<!-- One section only -->
<div data-style="brutal">…</div>
```

```css
/* Your own eleventh preset */
[data-style='blueprint'] {
	--radius-sm: 0; --radius-md: 0; --radius-lg: 0;
	--bz-border-w: 1px;
	--bz-border-c: var(--c-info);
	--shadow-md: 0 0 0 0 transparent; /* never `none` — it voids composed shadow lists */
	--bz-duration: 100ms;
}
```

Style-axis tokens a preset may override:

| Token | Purpose | Default |
| --- | --- | --- |
| `--radius-sm` … `--radius-2xl` | Radius scale | 6–16px |
| `--bz-control-radius` | Button radius override (e.g. `999px` pills) | unset (per-size radii) |
| `--shadow-sm` … `--shadow-xl` | Elevation scale (full shadow lists) | standard |
| `--bz-border-w` | Surface border width | `1px` |
| `--bz-border-c` / `--bz-border-c-strong` | Surface border colors (indirection over theme tokens) | `var(--c-border)` / `var(--c-border-strong)` |
| `--bz-surface-bg` | Floating/raised surface background | `var(--c-surface)` |
| `--bz-surface-filter` | `backdrop-filter` on floating surfaces | `none` |
| `--bz-overlay-bg` | Modal/drawer/palette backdrop | unset (component literals) |
| `--bz-density` | Multiplies base whitespace (never font size) | `1` |
| `--bz-ease` / `--bz-duration` | Micro-interaction motion | standard |
| `--bz-anim` | Multiplies entrance/exit animation durations | `1` |

Two caveats worth knowing:

- Portaled overlays (menus, modals, toasts) render under `<body>`, so they
  escape a container-scoped style. `data-style` on `<html>` is the
  supported way to style overlays.
- Glass reads best over imagery or gradients; over a flat background it
  simply looks like a subtle card, which is the correct graceful floor.

## Best Practices

1. **Use CSS Variables** - Always use CSS variables instead of hard-coded colors
2. **Provide Fallbacks** - Include fallback values when using CSS variables
3. **Test All Themes** - Ensure your custom components work with all themes
4. **Maintain Contrast** - Keep sufficient contrast for accessibility
5. **Use Semantic Colors** - Use success/warning/error for their intended purposes

## Toast Notifications

Toasts are built in (zero dependencies) and consume the same tokens, so they
adapt to every theme automatically:

```tsx
import { toast } from '@creo-team/buzz-ui/client'

// Toasts automatically use theme colors
toast.success('Operation successful!')
toast.error('Something went wrong')
```

## Migration Guide

If you're migrating from hard-coded colors to CSS variables:

1. Replace color values with CSS variables
2. Add fallback values for safety
3. Test with multiple themes
4. Update any custom CSS

Example migration:

```css
/* Before */
.custom-component {
  background: #ffffff;
  border: 1px solid #e0e0e0;
}

/* After */
.custom-component {
  background: var(--c-surface, #ffffff);
  border: 1px solid var(--c-border, #e0e0e0);
}
```
