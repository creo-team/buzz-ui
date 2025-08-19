# Theming System

The Buzz UI library includes a comprehensive theming system with extensive CSS variable support for complete customization of all components.

## Quick Start

```tsx
import { ThemeProvider } from '@creo-team/buzz-ui/client'
import { createThemeConfig, ThemePreset } from '@creo-team/buzz-ui'

const themes = [
  createThemeConfig(ThemePreset.Light),
  createThemeConfig(ThemePreset.Dark),
]

function App() {
  return (
    <ThemeProvider themes={themes} defaultTheme="light">
      {/* Your app */}
    </ThemeProvider>
  )
}
```

## Complete CSS Variable Reference

All components use CSS variables for theming. You can override any of these variables to customize the appearance of your application.

### Core Color Variables

#### Text Colors
- `--c-text` - Primary text color
- `--c-text-secondary` - Secondary/muted text  
- `--c-text-muted` - Even more muted text
- `--c-text-inverse` - Inverse text (for dark backgrounds)

#### Surface Hierarchy
- `--c-background` - Page background
- `--c-surface` - Card/panel background
- `--c-surface-2` - Secondary surfaces (nested cards, etc.)
- `--c-surface-3` - Tertiary surfaces (code blocks, etc.)
- `--c-surface-overlay` - Modal/dropdown overlay backgrounds

#### Borders and Dividers
- `--c-border` - Default borders
- `--c-border-strong` - Emphasized borders
- `--c-border-subtle` - Subtle borders
- `--c-divider` - Divider lines

#### Interactive States
- `--c-hover` - Hover state backgrounds
- `--c-hover-border` - Hover state borders
- `--c-active` - Active/pressed states
- `--c-selected` - Selected item backgrounds
- `--c-focus` - Focus ring color

### Brand Colors

#### Primary
- `--c-primary` - Primary brand color
- `--c-primary-light` - Light primary background
- `--c-primary-hover` - Primary hover state
- `--c-primary-foreground` - Text on primary backgrounds
- `--c-on-primary` - Alias for primary-foreground
- `--c-primary-ring` - Focus rings for primary elements

### Semantic Colors

#### Success
- `--c-success` - Success color
- `--c-success-light` - Light success background
- `--c-success-hover` - Success hover state
- `--c-success-foreground` - Text on success backgrounds

#### Warning
- `--c-warning` - Warning color
- `--c-warning-light` - Light warning background
- `--c-warning-hover` - Warning hover state
- `--c-warning-foreground` - Text on warning backgrounds

#### Error/Danger
- `--c-error` - Error color
- `--c-error-light` - Light error background
- `--c-error-hover` - Error hover state
- `--c-error-foreground` - Text on error backgrounds
- `--c-danger` - Alias for error
- `--c-danger-hover` - Alias for error-hover

#### Info
- `--c-info` - Info color
- `--c-info-light` - Light info background
- `--c-info-hover` - Info hover state
- `--c-info-foreground` - Text on info backgrounds

### Component-Specific Variables

#### Tooltips
- `--c-tooltip-bg` - Tooltip background
- `--c-tooltip-text` - Tooltip text color
- `--c-tooltip-border` - Tooltip border

#### Modals
- `--c-modal-bg` - Modal background
- `--c-modal-overlay` - Modal overlay/backdrop
- `--c-modal-border` - Modal border

#### Dropdowns
- `--c-dropdown-bg` - Dropdown background
- `--c-dropdown-border` - Dropdown border
- `--c-dropdown-hover` - Dropdown item hover

#### Code Blocks
- `--c-code-block-bg` - Code block background
- `--c-code-block-border` - Code block border
- `--c-code-block-text` - Code block text
- `--c-code-block-line-number` - Line number color

### Layout Variables

#### Shadows
- `--c-shadow-sm` - Small shadow
- `--c-shadow-md` - Medium shadow
- `--c-shadow-lg` - Large shadow
- `--c-shadow-xl` - Extra large shadow

#### Border Radius
- `--c-radius-sm` - Small radius (0.25rem)
- `--c-radius-md` - Medium radius (0.375rem)
- `--c-radius-lg` - Large radius (0.5rem)
- `--c-radius-xl` - Extra large radius (0.75rem)

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

## Best Practices

1. **Use CSS Variables** - Always use CSS variables instead of hard-coded colors
2. **Provide Fallbacks** - Include fallback values when using CSS variables
3. **Test All Themes** - Ensure your custom components work with all themes
4. **Maintain Contrast** - Keep sufficient contrast for accessibility
5. **Use Semantic Colors** - Use success/warning/error for their intended purposes

## Toast Notifications

The library uses `react-hot-toast` directly for toast notifications, which automatically adapts to your theme colors. The toasts will use the CSS variables for consistent styling:

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
