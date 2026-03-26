import { describe, it, expect } from 'vitest'
import { getClassColor } from '../../app/ts/classColors'

describe('getClassColor', () => {
  it('returns a light color for a known class', () => {
    expect(getClassColor('fighter')).toBeDefined()
    expect(getClassColor('fighter')).toMatch(/^#[0-9a-f]{6}$/i)
  })

  it('returns a dark color when dark=true', () => {
    const light = getClassColor('fighter', false)
    const dark = getClassColor('fighter', true)
    expect(dark).toBeDefined()
    expect(dark).not.toBe(light)
  })

  it('is case-insensitive', () => {
    expect(getClassColor('Fighter')).toBe(getClassColor('fighter'))
    expect(getClassColor('WIZARD')).toBe(getClassColor('wizard'))
  })

  it('trims whitespace', () => {
    expect(getClassColor('  druid  ')).toBe(getClassColor('druid'))
  })

  it('returns undefined for unknown class', () => {
    expect(getClassColor('unknownclass')).toBeUndefined()
    expect(getClassColor('')).toBeUndefined()
  })

  it('returns a color for every defined PF2e class', () => {
    const classes = [
      'alchemist', 'barbarian', 'bard', 'champion', 'cleric', 'druid',
      'fighter', 'gunslinger', 'inventor', 'investigator', 'kineticist',
      'magus', 'monk', 'oracle', 'psychic', 'ranger', 'rogue', 'sorcerer',
      'summoner', 'swashbuckler', 'thaumaturge', 'witch', 'wizard',
    ]
    for (const cls of classes) {
      expect(getClassColor(cls), `missing light color for ${cls}`).toBeDefined()
      expect(getClassColor(cls, true), `missing dark color for ${cls}`).toBeDefined()
    }
  })

  it('all colors are valid hex strings', () => {
    const classes = [
      'alchemist', 'barbarian', 'bard', 'champion', 'cleric', 'druid',
      'fighter', 'gunslinger', 'inventor', 'investigator', 'kineticist',
      'magus', 'monk', 'oracle', 'psychic', 'ranger', 'rogue', 'sorcerer',
      'summoner', 'swashbuckler', 'thaumaturge', 'witch', 'wizard',
    ]
    const hexPattern = /^#[0-9a-f]{6}$/i
    for (const cls of classes) {
      expect(getClassColor(cls)).toMatch(hexPattern)
      expect(getClassColor(cls, true)).toMatch(hexPattern)
    }
  })
})
