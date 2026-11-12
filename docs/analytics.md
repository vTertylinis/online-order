# Analytics events

Destination: GA4 G-G3K8FJ9N8S. These events explicitly target GA4 rather than the Google Ads tag.

- `view_item`: one event per successful navigation to a known product detail route (including direct links and revisits). Uses canonical menu ID/name/category and mode-specific base price, EUR. This counts detail views, not menu-card impressions.
- `ordering_mode_enter`: first completed navigation after app load and whenever mode changes. Count distinct users by mode to compare visitors; event counts represent entries, not unique users. Reloading starts a new entry; a visitor can use both modes.
- `checkout_error`: invalid delivery form, delivery outside opening hours, missing dine-in table, or failed submission. Parameters: `failure_reason`, `checkout_stage`, optional `http_status` (0 means network/browser-level failure). No raw error message, customer data, table number, URL, or order contents are sent. A dine-in submission failure can also mean printing failed after some items reached the server.

All events include `ordering_mode`: `online_order` or `dine_in`. Online order means the delivery/menu route, even while ordering is disabled.

## GA4 reporting setup after deployment

In Admin > Data display > Custom definitions, create event-scoped custom dimensions for:

| Display name | Event parameter |
| --- | --- |
| Ordering mode | ordering_mode |
| Checkout failure reason | failure_reason |
| Checkout stage | checkout_stage |
| Checkout HTTP status | http_status |

Use Events/Explorations for `ordering_mode_enter` and `checkout_error`, and Ecommerce purchases / item reports for `view_item`. Use Total users or Active users with Ordering mode for visitors, not Event count. Custom definitions and new events do not backfill past data; allow processing time for reports.

Validate in GA4 DebugView or Realtime after deployment. Automated tests replace gtag with a spy and send no analytics traffic. Build/test verification does not establish live data delivery. Ad blockers and consent choices can prevent collection.
