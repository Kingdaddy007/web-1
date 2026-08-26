# Common Patterns — TTA Designs Project

### 1. Deterministic Motion Controllers
- **Structure:** Use deterministic timeline evaluation where `evaluateFrame(t)` maps any timestamp $t \in [0, T]$ directly to element styles, transforms, and clip-paths.
- **Benefits:** Enables precise scrubbing, frame-accurate previews, instant replay, and effortless reduced-motion switching without animation frame state drift.
- **Easing Standard:** Use high-order restrained easing curves such as `cubic-bezier(0.16, 1, 0.3, 1)` or `power2.out` for architectural weight and authority.

### 2. Reduced Motion Fallback Pattern
- **Standard:** Check `window.matchMedia('(prefers-reduced-motion: reduce)')`. When active, hold black stillness for $\le 300\text{ms}$, followed by a brief ($250\text{ms}$) opacity fade directly to the complete static artwork.
