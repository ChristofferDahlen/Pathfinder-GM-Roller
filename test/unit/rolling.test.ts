import { describe, expect, it } from 'vitest'
import {
  calculateBonus,
  calculateBonusFromInfo,
  calculateDC,
  calculateDcFromInfo,
  calculateProficiency,
  calculateRollResult,
  getCriticalModifiers,
  getProficiencyString,
  RollOutcome,
} from '../../app/ts/rolling'
import { Attribute, proficiencyLevel, type RollInfo } from '../../app/ts/types'

// ── helpers ──────────────────────────────────────────────────────────────────

function makeRollInfo(overrides: Partial<RollInfo> = {}): RollInfo {
  return {
    rollType: 'test',
    attrType: Attribute.wis,
    attrValue: 3,
    training: proficiencyLevel.Trained,
    untrainedImprovisation: false,
    level: 5,
    item: 0,
    penalty: 0,
    ...overrides,
  }
}

// ── getCriticalModifiers ──────────────────────────────────────────────────────

describe('getCriticalModifiers', () => {
  it('returns cSuccess=1 on a natural 20', () => {
    expect(getCriticalModifiers(20)).toEqual({ cSuccess: 1, cFailure: 0 })
  })

  it('returns cFailure=1 on a natural 1', () => {
    expect(getCriticalModifiers(1)).toEqual({ cSuccess: 0, cFailure: 1 })
  })

  it('returns zeros for any other roll', () => {
    for (const roll of [2, 10, 19]) {
      expect(getCriticalModifiers(roll)).toEqual({ cSuccess: 0, cFailure: 0 })
    }
  })
})

// ── calculateProficiency ──────────────────────────────────────────────────────

describe('calculateProficiency', () => {
  it('returns 0 for untrained without UI', () => {
    expect(calculateProficiency(10, proficiencyLevel.Untrained, false)).toBe(0)
  })

  it('UI below level 5 returns level - 2', () => {
    expect(calculateProficiency(4, proficiencyLevel.Untrained, true)).toBe(2)
  })

  it('UI at level 5 or 6 returns level - 1', () => {
    expect(calculateProficiency(5, proficiencyLevel.Untrained, true)).toBe(4)
    expect(calculateProficiency(6, proficiencyLevel.Untrained, true)).toBe(5)
  })

  it('UI at level 7+ returns level', () => {
    expect(calculateProficiency(7, proficiencyLevel.Untrained, true)).toBe(7)
    expect(calculateProficiency(20, proficiencyLevel.Untrained, true)).toBe(20)
  })

  it('trained = level + 2', () => {
    expect(calculateProficiency(5, proficiencyLevel.Trained, false)).toBe(7)
  })

  it('expert = level + 4', () => {
    expect(calculateProficiency(5, proficiencyLevel.Expert, false)).toBe(9)
  })

  it('master = level + 6', () => {
    expect(calculateProficiency(5, proficiencyLevel.Master, false)).toBe(11)
  })

  it('legendary = level + 8', () => {
    expect(calculateProficiency(5, proficiencyLevel.Legendary, false)).toBe(13)
  })
})

// ── getProficiencyString ──────────────────────────────────────────────────────

describe('getProficiencyString', () => {
  it('returns empty string for untrained without UI', () => {
    expect(getProficiencyString(makeRollInfo({ training: proficiencyLevel.Untrained }))).toBe('')
  })

  it('returns "UI" for untrained with UI', () => {
    expect(getProficiencyString(makeRollInfo({
      training: proficiencyLevel.Untrained,
      untrainedImprovisation: true,
    }))).toBe('UI')
  })

  it.each([
    [proficiencyLevel.Trained, 'T'],
    [proficiencyLevel.Expert, 'E'],
    [proficiencyLevel.Master, 'M'],
    [proficiencyLevel.Legendary, 'L'],
  ])('%s → "%s"', (training, expected) => {
    expect(getProficiencyString(makeRollInfo({ training }))).toBe(expected)
  })
})

// ── calculateBonus ────────────────────────────────────────────────────────────

describe('calculateBonus', () => {
  it('applies check penalty only for str/dex attributes', () => {
    const penalty = -2
    expect(calculateBonus(Attribute.str, 3, 1, 7, penalty)).toBe(3 + penalty + 1 + 7)
    expect(calculateBonus(Attribute.dex, 3, 1, 7, penalty)).toBe(3 + penalty + 1 + 7)
    expect(calculateBonus(Attribute.con, 3, 1, 7, penalty)).toBe(3 + 1 + 7) // no penalty
    expect(calculateBonus(Attribute.wis, 3, 1, 7, penalty)).toBe(3 + 1 + 7)
  })

  it('sums attr + item + proficiency correctly', () => {
    expect(calculateBonus(Attribute.wis, 4, 2, 9, 0)).toBe(15)
  })
})

// ── calculateBonusFromInfo / calculateDcFromInfo ──────────────────────────────

describe('calculateBonusFromInfo', () => {
  it('matches manual calculation', () => {
    const info = makeRollInfo({ attrValue: 3, item: 1, level: 5, training: proficiencyLevel.Trained })
    // proficiency = 5 + 2 = 7, bonus = 3 + 0 + 1 + 7 = 11
    expect(calculateBonusFromInfo(info)).toBe(11)
  })
})

describe('calculateDcFromInfo', () => {
  it('is 10 + bonus', () => {
    const info = makeRollInfo({ attrValue: 3, item: 1, level: 5, training: proficiencyLevel.Trained })
    expect(calculateDcFromInfo(info)).toBe(10 + calculateBonusFromInfo(info))
  })
})

// ── calculateDC ───────────────────────────────────────────────────────────────

describe('calculateDC', () => {
  it('returns 10 + attr + proficiency + item', () => {
    // level 5, trained (+2) → prof = 7; attr = 3; item = 1 → DC = 10 + 3 + 7 + 1 = 21
    expect(calculateDC(Attribute.wis, 3, 5, proficiencyLevel.Trained, 1)).toBe(21)
  })
})

// ── calculateRollResult ───────────────────────────────────────────────────────

describe('calculateRollResult', () => {
  const dc = 15

  it('critical success: total >= dc + 10', () => {
    expect(calculateRollResult(dc, 10, 15)).toBe(RollOutcome.CS) // 25 >= 25 ✓
    expect(calculateRollResult(dc, 5, 20)).toBe(RollOutcome.CS)  // 25 >= 25 ✓
  })

  it('success: total >= dc but < dc + 10', () => {
    expect(calculateRollResult(dc, 10, 5)).toBe(RollOutcome.S)  // 15 >= 15, < 25 ✓
    expect(calculateRollResult(dc, 8, 7)).toBe(RollOutcome.S)   // 15 >= 15, < 25 ✓
  })

  it('failure: total >= dc - 10 but < dc', () => {
    expect(calculateRollResult(dc, 5, 0)).toBe(RollOutcome.F) // 5 >= 5 ✓, < 15 ✓
  })

  it('critical failure: total < dc - 10', () => {
    expect(calculateRollResult(dc, 1, 0)).toBe(RollOutcome.CF) // 1 < 5
  })

  it('natural 20 upgrades result by 1', () => {
    // roll=20, bonus=0, total=20 vs dc=15 → normally CS (>=25? no, 20>=15 = S, +cSuccess=1 → CS)
    expect(calculateRollResult(dc, 20, 0)).toBe(RollOutcome.CS)
  })

  it('natural 1 downgrades result by 1', () => {
    // roll=1, bonus=20, total=21 vs dc=15 → normally CS (21>=25? no → S, -cFailure → F)
    expect(calculateRollResult(dc, 1, 20)).toBe(RollOutcome.F)
  })

  it('natural 1 on a critical success downgrades to success', () => {
    // roll=1, bonus=30, total=31 vs dc=15 → CS - cFailure = S
    expect(calculateRollResult(dc, 1, 30)).toBe(RollOutcome.S)
  })
})
