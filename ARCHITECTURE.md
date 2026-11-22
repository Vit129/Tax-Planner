# Tax-Planner Architecture

## Layers and dependency rules

The application uses six layers. Dependencies point inward toward configuration and calculation, then outward through the composition step to the UI and browser integrations.

| Layer | Folder / entry files | May import | Rules |
|---|---|---|---|
| Logic | `src/logic/` | Other logic modules, `src/config/`, and `@vit129/thai-tax-core` | Keep calculations and transformations independent of React, DOM, browser storage, and UI components. |
| Config | `src/config/` | Other config modules and `@vit129/tax-ui` token exports | `strings.js` is the source for user-facing copy; `colors.js` is the only place for color literals; `typography.js` is the only place for literal font sizes and font families. `taxRules.js` holds tax-year and deduction constants and may read labels from `strings.js`. |
| Strings | `src/config/strings.js` | None | Keep user-facing labels, messages, month names, and prompt copy here; UI components read the values instead of defining copy inline. |
| IO | `src/io/` | Browser storage APIs | Keep browser persistence access here. Callers use the storage functions rather than accessing `localStorage` directly. |
| UI | `src/ui/` | Config, `src/easyTaxAdapter.js`, and `@vit129/tax-ui` | Render the interface and handle presentation events. Keep tax calculations in logic and use config tokens and strings. |
| Composition | `src/App.jsx`; mounted by `src/main.jsx` | Logic, config, IO, `src/easyTaxAdapter.js`, and UI | Wire application state, persistence, handlers, and the top-level UI. `src/main.jsx` mounts `App` and applies theme CSS variables. |

`src/easyTaxAdapter.js` translates between the app's state shape, shared tax-core calculations, and shared UI helpers. It is an integration module used by composition and UI; it does not replace the pure calculation modules in `src/logic/`.

### Literal placement

- User-facing text belongs in `src/config/strings.js`.
- Color values, including theme CSS color values, belong in `src/config/colors.js`; other styles consume color tokens.
- Literal font-size and font-family values belong in `src/config/typography.js`; styles consume typography tokens or CSS variables.
- Check changes by reviewing them against this layer table. To find direct browser-storage access, run `rg -n 'localStorage' src`; access should remain in `src/io/`.

## Application wiring

`src/main.jsx` imports `src/App.jsx`, applies the theme variables from `src/config/colors.js`, and mounts the React root. `src/App.jsx` owns top-level app state, uses `src/io/storage.js` for persistence, calls logic and adapter functions, and passes state and handlers to `src/ui/EasyTaxApp.jsx`. There is no `src/ui/App.jsx` in the current tree.

## Shared packages

Vite aliases `@vit129/thai-tax-core` and `@vit129/tax-ui` to the sibling `My-Investment-Port/packages` source directories. The application imports tax calculations from the former and UI primitives and tokens from the latter. See `vite.config.js` for the alias paths.

## Verification

Run `npm test` for the Vitest unit tests and `npm run build` for the production bundle. Review code changes against the layer table above.
