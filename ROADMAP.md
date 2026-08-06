# Buzz UI Component Library Roadmap

## Overview

This roadmap outlines the planned features and components for the Buzz UI component library. We're focusing on creating elegant, simple, and reusable components with excellent developer experience.

## Current Focus

- ✅ **Zero-dependency architecture** — dropped framer-motion, react-hot-toast, react-hotkeys-hook, lucide-react
- ✅ **Shipped stylesheet + design tokens** — `styles.css` with all themes; the package works standalone
- ✅ **React Server Components** — per-file ESM build preserving `use client`; static components ship zero JS
- ✅ **Accessibility pass** — focus trapping/restoration, layered dismissal, APG keyboard patterns
- ✅ **Overlay engine** — portal positioning with collision handling for tooltips, popovers, menus
- ✅ **Built-in toast system** — imperative API, promise tracking, pause-on-hover

## Components to be Added

### Phase 1: Core Form Components
- [x] **Radio Group** — accessible fieldset semantics, descriptions, vertical/horizontal
- [x] **Switch Toggle** — sizes, labels, forms integration, controlled/uncontrolled
- [x] **Popover** — composable anchored panel (trigger/content)
- [x] **Field** — shared label/help/error wiring for custom controls
- [x] **Slider** — native-range based: marks, keyboard steps, commit events, forms
- [x] **Floating Action Button (FAB)** — `Fab` wraps Button (variants, hotkeys, asChild) pinned to a screen corner

### Phase 2: Navigation & Layout
- [x] **Pagination** — numbered pages, ellipsis collapsing, compact mode
- [x] **Stepper** — completed states, descriptions, vertical orientation
- [x] **Breadcrumb improvements** — `maxItems` collapsing, custom separators, aria-current
- [x] **Combobox / Autocomplete** — filterable select built on the overlay engine (ARIA combobox pattern, controlled/uncontrolled, async-ready)

### Phase 3: Advanced Components
- [ ] **Date Picker** — full-featured calendar with range selection
- [ ] **Time Picker** — elegant time selection interface
- [ ] **Data Grid** — advanced table with sorting, filtering, and virtualization
- [ ] **Rich Text Editor** — WYSIWYG editor with markdown support

### Phase 4: Utility Components
- [ ] **Color Picker** — HSL/RGB color selection with presets
- [ ] **File Upload** — drag-and-drop with progress indicators
- [ ] **Image Gallery** — lightbox with zoom and navigation
- [ ] **Timeline** — vertical/horizontal timeline displays

## Improvements to Existing Components

### Done
- [x] **Modal** — focus trap + restore, sizes, alertdialog, SSR-safe portal, exit animations
- [x] **Dropdown** — full keyboard navigation, typeahead, portal positioning
- [x] **Toast** — positions, variants, actions, promise API, custom templates
- [x] **Tooltip** — keyboard focus support, Escape dismissal, collision-aware positioning, hoverable content
- [x] **Tabs** — roving tabindex, uncontrolled mode, automatic panel wiring
- [x] **Progress** — CSS-driven indeterminate + striped animations
- [x] **Sidebar Navigation** — clearer selected state, framework links, a11y labels

### Planned
- [ ] **Card** — more layout variations and hover effects
- [ ] **CommandPalette** — recent commands, nested pages
- [ ] **Table** — column sorting helpers

## Design Principles

All components follow these core principles:

1. **Simplicity First** — clean, minimal interfaces without unnecessary complexity
2. **Elegant Aesthetics** — frosted glass effects, smooth CSS animations, modern design
3. **Accessibility** — WCAG 2.1 AA compliance, keyboard navigation, ARIA support
4. **Performance** — zero dependencies, tree-shaking, zero-runtime styling, RSC-first
5. **Developer Experience** — TypeScript support, comprehensive docs, copy-paste examples

## Contributing

We welcome contributions! If you'd like to help implement any of these components:

1. Check the [GitHub Issues](https://github.com/creo-team/buzz-ui/issues) for open tasks
2. Review our [Contributing Guide](./CONTRIBUTING.md)
3. Join our [Discord Community](https://discord.gg/buzz-ui) for discussions

## Versioning Strategy

- **Minor releases** (0.x.0) - New components and features
- **Patch releases** (0.0.x) - Bug fixes and small improvements
- **Major releases** (x.0.0) - Breaking changes (rare, with migration guides)

## Feedback

Have suggestions for the roadmap? We'd love to hear from you:

- Open a [GitHub Discussion](https://github.com/creo-team/buzz-ui/discussions)
- Tweet us [@buzz_ui](https://twitter.com/buzz_ui)
- Email: feedback@buzz-ui.dev

---

*Last updated: August 2026*
*This roadmap is subject to change based on community feedback and priorities.*
