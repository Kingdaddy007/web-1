# Mistakes to Avoid — TTA Designs Project

### 1. Template Literal Escaping in Script Generation
- **Pattern:** When generating browser JavaScript files via shell scripts or string wrappers, unescaped `${...}` and `%` inside strings can get stripped or corrupted, resulting in browser syntax errors (`Unexpected token '{'` or `Unexpected token '%'`).
- **Correction:** Always use direct string concatenation (`+`) or verify generated scripts with an automated headless browser (Playwright) check before declaring completion.

### 2. Typographic Identity Deconstruction
- **Pattern:** Never guess or substitute external fonts for custom wordmarks when an approved raster/vector master exists.
- **Correction:** Decompose masks, clip paths, and layer slices directly from the approved alpha master (`tta-wordmark-black-transparent-provisional.png`).

### 3. Separation vs. Superimposition in TTA Lockup
- **Pattern:** Never treat the vertical hairline as a divider separating `TTA` and `DESIGNS`.
- **Correction:** The vertical line must always penetrate directly through the left body and inner counter of the letter `D`.
