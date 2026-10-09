# Online Order

A mobile-first food ordering app for **21 Ierissos**, built with Angular and Ionic and deployed to GitHub Pages. It supports two ordering flows from a single codebase:

- **Delivery** — customers browse the menu, build a cart, enter a delivery address (with Google Maps), and place an order.
- **Dine-in** — customers scan a QR code at the table (`21ierissos.gr/#/dinein/home`), order, and the order is routed to their table.

## Tech Stack

- **[Angular](https://angular.dev) 22.2** — standalone components with lazy-loaded routes and block control flow
- **[Ionic](https://ionicframework.com) 8** — mobile UI framework
- **[Capacitor](https://capacitorjs.com) 7** — native runtime / build wrapper
- **[ngx-translate](https://github.com/ngx-translate/core)** — i18n
- **Google Maps JavaScript API** — address selection for delivery
- **TypeScript 6.0**

## Features

- Menu browsing with item detail pages
- Cart management (`CartService`)
- Delivery address entry backed by Google Maps (`AddressPage`, `GoogleMapsLoaderService`)
- Dine-in table flow with success confirmation (`dinein-table`, `dinein-success`)
- Mode switching between delivery and dine-in (`ModeService`)
- Multi-language support: Bulgarian, German, Greek, English, Romanian, Serbian (`src/assets/i18n`)
- Runtime configuration via `ConfigService`

## Project Structure

```
src/app/
├── home/            Menu / landing page
├── item-detail/     Single item view
├── cart/            Cart page
├── address/         Delivery address (Google Maps)
├── dinein-table/    Dine-in table selection
├── dinein-success/  Dine-in order confirmation
├── offers/          Offers
├── services/        Cart, config, mode, table, dine-in order, maps loader, i18n loader
├── models/          Shared types
├── utils/           Helpers
└── app.routes.ts    Route definitions
```

## Routes

| Path                 | Page              | Flow     |
| -------------------- | ----------------- | -------- |
| `/home`              | Home (menu)       | Delivery |
| `/item/:id`          | Item detail       | Delivery |
| `/address`           | Delivery address  | Delivery |
| `/cart`              | Cart              | Delivery |
| `/dinein/home`       | Home (menu)       | Dine-in  |
| `/dinein/item/:id`   | Item detail       | Dine-in  |
| `/dinein/cart`       | Cart              | Dine-in  |
| `/dinein/table`      | Table selection   | Dine-in  |
| `/dinein/success`    | Order confirmation| Dine-in  |

## Getting Started

### Prerequisites

- Node.js `^22.22.3`, `^24.15.0`, or `>=26.0.0` and npm `>=10.9.0` (see `.nvmrc`)
- Ionic CLI (optional): `npm install -g @ionic/cli`

### Install

```bash
npm ci
```

### Run locally

```bash
npm start
```

The app runs at `http://localhost:4200`.

### Build

```bash
npm run build
```

### Test & lint

```bash
npm test
npm run test:ci
npm run lint
```

`test:ci` runs the Vitest suite once in headless Chrome using Playwright. Install Chrome or set
`CHROME_BIN` to a compatible Chromium executable before running it.
No separate Playwright browser download is required. Use `npm ci` to install the
versions recorded in `package-lock.json`, and commit the lockfile with dependency
changes.

## Angular 22 migration

The project was upgraded sequentially from Angular 20 through 21 to 22 using the
official Angular CLI migrations. Framework and CLI packages use 22.2.2,
TypeScript uses 6.0, Angular ESLint uses 22, and Ionic's Angular toolkit uses 13.
Build, serve, i18n extraction, and Vitest tests use the `@angular/build` builders.
Lint uses ESLint's flat configuration in `eslint.config.cjs`.
Capacitor core/CLI remain on version 7 (7.6.9), and `webDir` points to the actual
Angular build output, `dist/online-order/browser`. The GitHub Pages builder uses
version 3, which supports Angular CLI 22.

Templates use `@if`/`@for`, and Angular-managed classes use `inject()` for dependency
injection. Startup uses `provideAppInitializer()` and the supported browser testing
APIs; unused animations and dynamic browser-platform packages were removed.

The application explicitly retains Zone.js change detection and
`ChangeDetectionStrategy.Eager` for existing components. This preserves Ionic
navigation, mutable page state, and asynchronous translation updates after Angular
22 changed the default to `OnPush`. The shared polyfills entry loads Ionic's Zone
flags before Zone.js in the app and through `src/test-setup.ts` in tests. Existing reactive and
template-driven forms remain supported.

Browser targets follow Angular 22's widely available baseline of 2026-05-07;
older browsers/WebViews outside that baseline are no longer targeted. TypeScript
uses bundler module resolution and an explicit `src/*` path mapping instead of the
deprecated `baseUrl` option. Strict template checks remain enabled.

Validation: `npm ci` has no deprecated-package warnings. Production build, lint,
and all six headless Chrome tests pass. The initial bundle is about
985 kB, above the existing 600 kB warning budget and below the 1.2 MB error budget.
`npm audit --omit=dev` reports no vulnerabilities. The full audit still reports
six high-severity findings in the GitHub Pages tooling dependency chain through
`braces`. There is currently no patched release for
[GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm).
The suggested forced fix would downgrade deployment tooling and is not applied.

## Deployment

The app is hosted on GitHub Pages at **[21ierissos.gr](https://21ierissos.gr)** (see `public/CNAME`), built with [`angular-cli-ghpages`](https://github.com/angular-schule/angular-cli-ghpages).
