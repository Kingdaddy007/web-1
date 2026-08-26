export function getHeroVerticalFocus(aspect: number) {
  if (aspect >= 2) return 0.22;
  if (aspect >= 1.8) return 0.34;
  return 0.5;
}
