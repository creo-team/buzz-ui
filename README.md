# Buzz UI

A lean, elegant, **zero-dependency** React component library — server-first,
SSR-safe, themeable with CSS tokens — plus a Next.js showcase app.

## ⚠️ Disclaimer

⚠️ **This project is under very active development.**
⚠️ **Expect bugs and breaking changes.**
⚠️ **Do not use this in production without thorough testing.**
⚠️ **Always follow best practices for component library versioning!**

## Repository layout

- `packages/library` – the component library (`@creo-team/buzz-ui`)
- `apps/site` – Next.js site that showcases components

## Getting started

```bash
# install
npm install

# build the library (required once before running the site)
npm run -w @creo-team/buzz-ui build

# develop (runs the Next.js showcase)
npm run dev

# test + typecheck everything
npm test && npm run typecheck
```

## Using the library

```bash
npm i @creo-team/buzz-ui
```

```tsx
// once, at your app root
import '@creo-team/buzz-ui/styles.css'

import { Card, Button } from '@creo-team/buzz-ui'
// RSC-safe subset (zero client JS for static components):
// import { Card, Table } from '@creo-team/buzz-ui/server'
// Interactive components and hooks:
// import { Modal, toast, useHotkey } from '@creo-team/buzz-ui/client'
```

See [`packages/library/README.md`](./packages/library/README.md) for the full
tour, [`THEMING.md`](./packages/library/THEMING.md) for tokens and themes, and
[`CHANGELOG.md`](./packages/library/CHANGELOG.md) for release notes.

## Design principles

- **Zero dependencies** — no animation/toast/icon/CSS-in-JS libraries; the
  platform is enough
- **Server Components first** — static components ship no client JS;
  interactivity is isolated into islands
- **Accessibility by default** — WAI-ARIA interaction patterns, focus
  management, reduced-motion support
- **Zero-runtime styling** — one stylesheet, CSS custom-property tokens,
  stable `bz-*`/`data-*` styling hooks
- **Minimal props, sensible defaults** — controlled and uncontrolled modes
  everywhere
- No semicolons, tabs preferred in code style

## License

MIT
