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

---

## Plans & decisions

### FilterPanel
- `FilterPanel.vue` currently has **only a `<script setup>`** — no template. Models: `brand`, `minPrice`, `maxPrice`; prop `availableBrands: string[]`.
- Proposed adding a full template (brand `<select>`, min/max price inputs, "Clear" reset button with a `reset()` handler and a `hasFilters` computed) plus matching CSS. **Rejected by user** — `FilterPanel.vue` left untouched, `FilterPanel.css` still empty.
- **Open item:** FilterPanel still needs markup + CSS. Planned class names: `filter`, `filter_head`, `filter_title`, `filter_reset`, `filter_group`, `filter_label`, `filter_select`, `filter_price`, `filter_price_sep`, `filter_input`.

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
- Began migrating `DeviceCard.css` off an invented `--color_accent` onto real tokens (`--color_primary`, `--shadow_card`). Applied for the hover state; the badge/stock/discount token migration edit was **rejected/interrupted**, so those still use hardcoded hex + fallbacks.

---

## Open items / TODO
- Build FilterPanel template + `FilterPanel.css`.
- Finish migrating `DeviceCard.css` badges/stock/discount to tokens (`--badge_top_bg`, `--badge_new_bg`, `--badge_sale_bg`, `--badge_fg`, `--color_price`, `--color_old_price`) — pending user go-ahead.
- `nuxt.config.ts` reads `theme-init.js` into `themeInit` but never injects it into `app.head.script` — flash-of-wrong-theme not yet prevented.
- No `:root` price rendering in `DeviceCard.vue` yet (only discount % is shown; `priceMDL` / `oldPriceMDL` not rendered).
