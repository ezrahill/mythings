// Round-robin colour set for areas/tags, per docs/design.md.
export const SWATCH_COLORS = [
  '#2FB380',
  '#AF52DE',
  '#30B0C7',
  '#E5484D',
  '#F2A93B',
  '#5E5CE6',
  '#FF6B9D',
  '#8E8E93',
]

export function swatchColor(index: number): string {
  return SWATCH_COLORS[index % SWATCH_COLORS.length]
}
