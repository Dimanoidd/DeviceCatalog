# AI Artifacts — DeviceCatalog

Log of AI-assisted work: prompts, conventions, plans and decisions.

---

## Project conventions (agreed)

These apply to every `.vue`, `.css` and `.ts` file:

- **CSS class names** — words separated by a single underscore `_`, lowercase only (e.g. `device_card_media`).
- **CSS variables / design tokens** — same rule: single `_`, lowercase (e.g. `--color_surface`, `--space_4`, `--badge_top_bg`).
- **Functions** — camelCase (e.g. `discountPercent`, `reset`).
- **Parameters** — meaningful names, no single-letter parameters.
- **Loop counters** — when the variable is semantically an index, name it `index`.

---

## Prompts (chronological)

1. `generate css for FilterPanel in FilterPanel.css`
2. `create css for DeviceCard`
3. Naming rules (see *Project conventions* above).
4. `generate constants`
5. `save in AI_artifacts.md all about we discuss like prompts, plans ...`
6. `propose how in dynamic mode open page by slug and show information about item`
7. `create app/pages/devices/[slug].vue and css`
8. `when click slug is not open` (bug report)
9. `error in nitro routes` (bug report)
10. `update AI_artifacts`
11. `verify the application for dead code`

---

## Plans & decisions

### FilterPanel
- Started script-only. An earlier proposal to add the template + CSS was **rejected**.
- **Now fully implemented** (by the user). Props: `availableBrands: string[]`, `priceRange: {min,max}`, `resultCount: number`. Models: `brand`, `minPrice`, `maxPrice`, `sort`. Has `sortLabels` map, `reset()`, and `hasActiveFilters` computed.
- Markup: a `<form role="search">` with three `fieldset` groups (Brand `<select>`, Price min/max range, Sort `<select>`) plus a footer with a result `<output>` and conditional "Reset filters" button. Class prefix `filter_panel_*` (uses a `visually_hidden` label class). `FilterPanel.css` is written.

### DeviceCard
- `DeviceCard.vue` already had a complete template (classes: `device_card`, `device_card_out`, `device_card_media`, `device_card_img`, `device_card_placeholder`, `device_card_badge`, `device_card_stock`, `device_card_body`, `device_card_brand`, `device_card_title`, `device_card_link`, `device_card_prices`, `device_card_discount`, `device_card_actions`).
- Wrote **`DeviceCard.css`** covering all of the above:
  - Card surface + border + `--radius_lg`; hover/focus-within lift.
  - `4/3` media with `object-fit: contain`; gradient letter placeholder for the image `@error` fallback.
  - Badge span rendered via `content` per `data-badge` — `top` / `new` / `sale` (matches `BADGES` in `shared/types.ts`).
  - Out-of-stock chip, discount pill, stretched-link overlay (whole card clickable) with `actions` kept above it via `z-index`.
  - Reduced-motion handling; `-webkit-backdrop-filter` prefix added.

### Design tokens / constants
- `app/assets/css/main.css` **already contains** the full token system: slate scale (50–950), brand (400/500/600), semantic colors (green/amber/red/sky), spacing (`--space_1..6`), radii (`--radius_sm/md/lg`), `--font_sans`, `--shadow_card`, `--focus_ring`, semantic color aliases, badge tokens, and light + `:root[data-theme='dark']` themes.
- **Problem found:** `main.css` was never imported, so tokens resolved to nothing at runtime.
- **Fix applied:** registered it in `nuxt.config.ts` → `css: ['~/assets/css/main.css']`.
- Began migrating `DeviceCard.css` off an invented `--color_accent` onto real tokens (`--color_primary`, `--shadow_card`). **Resolved:** the user finished the migration — `DeviceCard.css` now uses `--color_primary`, `--shadow_card`, `--badge_*`, `--color_price`, `--color_old_price`, `--color_outofstock`, switched the hover to `:has(.device_card_link:hover)`, added `position: relative`, and added `device_card_price` / `device_card_old` classes.
- `nuxt.config.ts` now also injects the `themeInit` script into `app.head.script` (flash-of-wrong-theme prevention) alongside the `css` registration.

### Device detail page (dynamic route)
- **Proposed** `/devices/:slug`: a `[slug]` API route + `app/pages/devices/[slug].vue`, linking cards via DeviceCard's existing `to` prop and stretched `::after` link. Recommended fetching via API (server util `getDeviceBySlug` can't be imported client-side) and a real 404.
- **Implemented** `app/pages/devices/[slug].vue` (+ `slug.css`). Final version (user-reworked):
  - Fetches the single-device endpoint `useFetch('/api/devices/${slug}')`, reactive to the route param.
  - On error, sets a real 404 response status on the server and renders a `detail_missing` panel (404 / "Device not found" / back link).
  - Renders breadcrumb, media (with brand-letter placeholder fallback), brand/model, price + old price + discount (`discountPercent` / `formatMdl`), stock state via `data-in-stock`, and a `<dl>` specs list driven by a `specLabels` map (works across the discriminated union — smartphone/wearable vs. accessory).
  - Full SEO/OG meta from the device.
  - CSS class prefix `detail_*` (note: not `device_detail_*` — the user's rework uses `detail_`).

### API routing saga (the "not read json" + "nitro routes" bugs)
- **"JSON not read":** handler was named `server/api/devices/devices.get.ts` → Nitro route `/api/devices/devices`, but the app fetches `/api/devices` → 404, so `devicesSchema.parse()` never ran. Fix: renamed to `server/api/devices/index.get.ts`. The JSON, import path, and schema were all correct.
- **"click slug not open":** two bugs — (1) card linked to `/device/${slug}` (singular) but the route is `/devices/:slug`; fixed in `index.vue`. (2) page fetched `/api/devices/${slug}` but no `[slug]` handler existed; created `server/api/devices/[slug].get.ts` using `getDeviceBySlug` + 404.
- **"error in nitro routes":** the list handler had been moved to `server/api/index.get.ts` → route `/api`, so `/api/devices` had no handler and the generated `.nuxt/types/nitro-routes.d.ts` was stale/corrupted. Fix: moved it back to `server/api/devices/index.get.ts` and ran `npx nuxi prepare` to regenerate types.

### Catalog grid (`index.vue`)
- The listing now renders a `listing_results` section with `DeviceCard`s in a `listing_grid`, plus a skeleton loading state (`v-for="index in 6"`) and error/empty states. FilterPanel is passed `sort`, `price-range`, `result-count` in addition to brand/price models.

---

## Current API + routes
- `GET /api/devices` → `server/api/devices/index.get.ts` (list, query-filtered/sorted, facets).
- `GET /api/devices/:slug` → `server/api/devices/[slug].get.ts` (single device, 404 if unknown).
- Page `/` → catalog grid; page `/devices/:slug` → detail.

---

## Dead-code verification (prompt 11)

Full read-through of every `.ts`/`.vue` file, tracing each symbol's references. Nothing removed yet — findings only (user paused the cleanup decision).

**Confirmed dead:**
- `index.vue:9` — `refresh` destructured from `useFetch`, never used.
- `index.vue:15` — `isEmpty` computed, never referenced in the template.
- `useTheme.ts:26` — `setTheme: apply` returned, no consumer (ThemeToggle uses only `theme` + `toggle`).
- `shared/types.ts:44` — `Category` type export, never imported.
- `shared/types.ts:45` — `Badge` type export, never imported.
- `shared/types.ts:3-4` — `CATEGORIES` + `categorySchema`; `deviceSchema` uses inline `z.literal(...)`, so their only consumer is the unused `Category` type → whole chain dead.

**Loose end (not dead, but incomplete):** `index.vue:46-48` — the `v-if="error"` (`listing_state`) block renders an empty `<div>` (no message); and with `isEmpty` unused, an empty result set renders an empty `<ul>` (no "no results" state).

**Verified clean:** `format.ts`, `server/utils/devices.ts` (all exports), `useDeviceFilters.ts`, both API routes, all component locals; all 7 CSS files exist, non-empty, imported — no orphans.

---

## Open items / TODO
- Decide dead-code cleanup scope (locals only 1–2 / all 1–6 / none). Pending user choice.
- `index.vue` error block is empty (no message) and the empty-results state is missing (`isEmpty` was written for it but never wired up).
- Detail page fetches per-slug via API (good), but consider prefetch/caching if the list is already loaded.
- FilterPanel uses a `visually_hidden` class and `index.vue`/`app.vue` use `container` / `app_*` classes — confirm these are defined globally (not obviously in `main.css`/`app.css`).
