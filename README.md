# Online Order

A mobile-first food ordering app for **21 Ierissos**, built with Angular and Ionic and deployed to GitHub Pages. It supports two ordering flows from a single codebase:

- **Delivery** — customers browse the menu, build a cart, enter a delivery address (with Google Maps), and place an order.
- **Dine-in** — customers scan a QR code at the table (`21ierissos.gr/#/dinein/home`), order, and the order is routed to their table.

## Tech Stack

- **[Angular](https://angular.dev) 20** — standalone components with lazy-loaded routes
- **[Ionic](https://ionicframework.com) 8** — mobile UI framework
- **[Capacitor](https://capacitorjs.com) 7** — native runtime / build wrapper
- **[ngx-translate](https://github.com/ngx-translate/core)** — i18n
- **Google Maps JavaScript API** — address selection for delivery
- **TypeScript 5.9**

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

- Node.js (LTS) and npm
- Ionic CLI (optional): `npm install -g @ionic/cli`

### Install

```bash
npm install
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
npm run lint
```

## Deployment

The app is hosted on GitHub Pages at **[21ierissos.gr](https://21ierissos.gr)** (see `public/CNAME`), built with [`angular-cli-ghpages`](https://github.com/angular-schule/angular-cli-ghpages).
