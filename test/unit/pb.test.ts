import { describe, expect, it, beforeEach } from 'vitest'
import { updateCharacter, type iPBChar } from '../../app/ts/pb'
import { newCharacter } from '../../app/ts/types'
import { Attribute, proficiencyLevel } from '../../app/ts/types'

// ── minimal PB fixture ────────────────────────────────────────────────────────

function makePBChar(overrides: Partial<iPBChar['build']> = {}): iPBChar {
  return {
    build: {
      name: 'Test Hero',
      class: 'Fighter',
      level: 5,
      keyability: 'str',
      resistances: [],
      feats: [],
      lores: [],
      languages: ['Common'],
      acTotal: { acTotal: 20, shieldBonus: '0' },
      abilities: { str: 18, dex: 14, con: 16, int: 10, wis: 12, cha: 8 },
      proficiencies: {
        classDC: 2, perception: 4,
        fortitude: 6, reflex: 4, will: 4,
        heavy: 4, medium: 4, light: 4, unarmored: 4,
        advanced: 2, martial: 4, simple: 4, unarmed: 4,
        castingArcane: 0, castingDivine: 0, castingOccult: 0, castingPrimal: 0,
        acrobatics: 2, arcana: 0, athletics: 4, crafting: 0,
        deception: 0, diplomacy: 2, intimidation: 2, medicine: 0,
        nature: 0, occultism: 0, performance: 0, religion: 0,
        society: 0, stealth: 0, survival: 0, thievery: 0,
      },
      spellCasters: [],
      mods: {} as iPBChar['build']['mods'],
      ...overrides,
    },
  }
}

// ── basic info ────────────────────────────────────────────────────────────────

describe('updateCharacter - basic info', () => {
  it('sets name, class, level, keyAbility', () => {
    const char = newCharacter(0)
    updateCharacter(char, makePBChar())
    expect(char.name).toBe('Test Hero')
    expect(char.class).toBe('Fighter')
    expect(char.level).toBe(5)
    expect(char.keyAbility).toBe(Attribute.str)
  })

  it('sets AC and shield from acTotal', () => {
    const char = newCharacter(0)
    updateCharacter(char, makePBChar({ acTotal: { acTotal: 25, shieldBonus: '2' } }))
    expect(char.protection.ac).toBe(25)
    expect(char.protection.shield).toBe(2)
  })
})

// ── attributes ────────────────────────────────────────────────────────────────

describe('updateCharacter - attributes', () => {
  it('converts ability scores to modifiers', () => {
    const char = newCharacter(0)
    updateCharacter(char, makePBChar())
    // str 18 → (18-10)/2 = 4
    expect(char.attributes.str).toBe(4)
    // dex 14 → 2
    expect(char.attributes.dex).toBe(2)
    // con 16 → 3
    expect(char.attributes.con).toBe(3)
    // int 10 → 0
    expect(char.attributes.int).toBe(0)
    // wis 12 → 1
    expect(char.attributes.wis).toBe(1)
    // cha 8 → -1
    expect(char.attributes.cha).toBe(-1)
  })
})

// ── proficiencies ─────────────────────────────────────────────────────────────

describe('updateCharacter - proficiencies', () => {
  it('maps PB proficiency numbers to proficiencyLevel enum', () => {
    const char = newCharacter(0)
    updateCharacter(char, makePBChar())
    expect(char.proficiencies.fortitude).toBe(proficiencyLevel.Master)   // 6
    expect(char.proficiencies.reflex).toBe(proficiencyLevel.Expert)      // 4
    expect(char.proficiencies.will).toBe(proficiencyLevel.Expert)        // 4
    expect(char.proficiencies.acrobatics).toBe(proficiencyLevel.Trained) // 2
    expect(char.proficiencies.arcana).toBe(proficiencyLevel.Untrained)   // 0
  })
})

// ── untrained improvisation ───────────────────────────────────────────────────

describe('updateCharacter - untrained improvisation', () => {
  it('sets untrainedImprovisation=true when feat is present', () => {
    const char = newCharacter(0)
    updateCharacter(char, makePBChar({ feats: [['Untrained Improvisation'] as never] }))
    expect(char.untrainedImprovisation).toBe(true)
  })

  it('leaves untrainedImprovisation=false when feat is absent', () => {
    const char = newCharacter(0)
    updateCharacter(char, makePBChar({ feats: [['Toughness'] as never] }))
    expect(char.untrainedImprovisation).toBe(false)
  })
})

// ── resistances ───────────────────────────────────────────────────────────────

describe('updateCharacter - resistances', () => {
  it('parses resistance strings into name/value pairs', () => {
    const char = newCharacter(0)
    updateCharacter(char, makePBChar({ resistances: ['fire 5', 'cold iron 3'] }))
    expect(char.resistances).toHaveLength(2)
    expect(char.resistances[0]).toEqual({ name: 'fire', value: 5 })
    expect(char.resistances[1]).toEqual({ name: 'cold iron', value: 3 })
  })

  it('clears previous resistances on update', () => {
    const char = newCharacter(0)
    char.resistances = [{ name: 'old', value: 99 }]
    updateCharacter(char, makePBChar({ resistances: [] }))
    expect(char.resistances).toHaveLength(0)
  })
})

// ── lores ─────────────────────────────────────────────────────────────────────

describe('updateCharacter - lores', () => {
  it('parses lore entries and sorts alphabetically', () => {
    const char = newCharacter(0)
    updateCharacter(char, makePBChar({
      lores: [['Warfare', 4], ['Legal', 2]] as never,
    }))
    expect(char.lores).toHaveLength(2)
    expect(char.lores[0]!.name).toBe('Legal')
    expect(char.lores[0]!.proficiency).toBe(proficiencyLevel.Trained)
    expect(char.lores[1]!.name).toBe('Warfare')
    expect(char.lores[1]!.proficiency).toBe(proficiencyLevel.Expert)
  })
})

// ── spell DCs ─────────────────────────────────────────────────────────────────

describe('updateCharacter - spell DCs', () => {
  it('creates a spell DC entry per spell caster', () => {
    const char = newCharacter(0)
    updateCharacter(char, makePBChar({
      spellCasters: [{
        name: 'Arcane', magicTradition: 'arcane', ability: 'int',
        proficiency: 4, spells: [],
      }],
    }))
    expect(char.spellDCs).toHaveLength(1)
    expect(char.spellDCs[0]!.name).toBe('Arcane')
    expect(char.spellDCs[0]!.keyAttr).toBe(Attribute.int)
    expect(char.spellDCs[0]!.proficiency).toBe(proficiencyLevel.Expert)
  })

  it('deduplicates identical spell casters', () => {
    const char = newCharacter(0)
    const caster = { name: 'Arcane', magicTradition: 'arcane', ability: 'int', proficiency: 4, spells: [] }
    updateCharacter(char, makePBChar({ spellCasters: [caster, caster] }))
    expect(char.spellDCs).toHaveLength(1)
  })

  it('sets shield bonus to 1 when Shield cantrip is found', () => {
    const char = newCharacter(0)
    updateCharacter(char, makePBChar({
      spellCasters: [{
        name: 'Arcane', magicTradition: 'arcane', ability: 'int', proficiency: 4,
        spells: [{ spellLevel: 0, list: ['Shield', 'Detect Magic'] }],
      }],
    }))
    expect(char.protection.shield).toBeGreaterThanOrEqual(1)
  })
})

// ── languages ─────────────────────────────────────────────────────────────────

describe('updateCharacter - languages', () => {
  it('copies languages from PB data', () => {
    const char = newCharacter(0)
    updateCharacter(char, makePBChar({ languages: ['Common', 'Elven', 'Draconic'] }))
    expect(char.languages).toEqual(['Common', 'Elven', 'Draconic'])
  })
})
