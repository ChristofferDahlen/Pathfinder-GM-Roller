// Class colors for light and dark mode
const classColorMap: Record<string, { light: string; dark: string }> = {
  alchemist:    { light: '#78350f', dark: '#fde68a' }, // amber-200
  barbarian:    { light: '#7f1d1d', dark: '#fca5a5' }, // red-300
  bard:         { light: '#4c1d95', dark: '#ddd6fe' }, // violet-200
  champion:     { light: '#78350f', dark: '#fef08a' }, // yellow-200
  cleric:       { light: '#92400e', dark: '#fef9c3' }, // yellow-100
  druid:        { light: '#14532d', dark: '#bbf7d0' }, // green-200
  fighter:      { light: '#1e3a8a', dark: '#bfdbfe' }, // blue-200
  gunslinger:   { light: '#111827', dark: '#e5e7eb' }, // gray-200
  inventor:     { light: '#0c4a6e', dark: '#bae6fd' }, // sky-200
  investigator: { light: '#134e4a', dark: '#99f6e4' }, // teal-200
  kineticist:   { light: '#164e63', dark: '#a5f3fc' }, // cyan-200
  magus:        { light: '#312e81', dark: '#c7d2fe' }, // indigo-200
  monk:         { light: '#78350f', dark: '#fef08a' }, // yellow-200
  oracle:       { light: '#581c87', dark: '#e9d5ff' }, // purple-200
  psychic:      { light: '#831843', dark: '#fbcfe8' }, // pink-200
  ranger:       { light: '#052e16', dark: '#bbf7d0' }, // green-200
  rogue:        { light: '#0f172a', dark: '#cbd5e1' }, // slate-300
  sorcerer:     { light: '#701a75', dark: '#f5d0fe' }, // fuchsia-200
  summoner:     { light: '#082f49', dark: '#bae6fd' }, // sky-200
  swashbuckler: { light: '#7f1d1d', dark: '#fecaca' }, // red-200
  thaumaturge:  { light: '#431407', dark: '#fed7aa' }, // orange-200
  witch:        { light: '#2e1065', dark: '#c4b5fd' }, // violet-950
  wizard:       { light: '#172554', dark: '#bfdbfe' }, // blue-950
}

export function getClassColor(className: string, dark = false): string | undefined {
  const entry = classColorMap[className.toLowerCase().trim()]
  if (!entry) return undefined
  return dark ? entry.dark : entry.light
}
