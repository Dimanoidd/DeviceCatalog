# Mini Device Catalog

## Requirements

- Node.js 22+
- npm

## Installation

```bash
npm install
npm run dev
```

The application will be available at:

```
http://localhost:3000
```

---

# Project Structure

```
app/
components/
pages/
server/
shared/
```

---

# Key Decisions

## SSR

The catalog page is server-side rendered to provide fast initial rendering and SEO-friendly output.

## Server-side filtering

Filtering and sorting are implemented in the Nitro API instead of the client. This keeps the browser logic simple and follows the assignment requirements.

## Shared validation

Zod schemas are shared between the client and the server so both sides use the same data contract.

## URL as source of truth

Catalog filters are synchronized with URL query parameters. This allows filtered views to be shared and restored after page reload.

## Reusable components

The DeviceCard component is designed as a reusable component with typed props and CSS custom properties for theming.

---

# Trade-offs

Because of the assignment time limit, I intentionally:

- kept the API file-based instead of introducing a repository/service layer;
- used simple numeric price inputs instead of a range slider;
- did not add global state management because the URL already stores the filter state;
- implement i18n. For now, persisting the selected language in cookies is unnecessary, as it is 
    not required at this stage.

---

# AI Usage

AI tools were used as a development assistant for:

- understanding the assignment;
- discussing architecture alternatives;
- generating implementation drafts;
- reviewing TypeScript types;
- reviewing accessibility and responsive layout.

All generated suggestions were reviewed and adapted before being included in the final solution.

Additional AI artifacts are available `AI_artifacts.md`.

---

# Future Improvements

With additional time I would implement:

- pagination;
- search by device name;
- unit/component tests;
- image optimization;
- API pagination;
- caching;
- animations for loading states;
- localization (RO/RU/EN).