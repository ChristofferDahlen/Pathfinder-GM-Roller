import {calculateRollResult, RollOutcome, getCriticalModifiers, evaluateRollBonuses} from '../../app/ts/rolling';
import {expect, test} from 'vitest';
import {Attribute, proficiencyLevel, ProficiencyValueMap} from "../../app/ts/types";

test('Crit modifier N20', () => {
    const {cSuccess, cFailure} = getCriticalModifiers(20)
    expect(cSuccess).toBe(1);
    expect(cFailure).toBe(0);

})
test('Crit modifer nothing', () => {
    for (let i = 2; i < 20; i++) {
        const {cSuccess, cFailure} = getCriticalModifiers(i)
        expect(cSuccess).toBe(0);
        expect(cFailure).toBe(0);
    }
})
test('Crit modifer N1', () => {
    const {cSuccess, cFailure} = getCriticalModifiers(1)
    expect(cSuccess).toBe(0);
    expect(cFailure).toBe(1);
})


test('CS: dc 10, total: 20, ', () => {
    expect(calculateRollResult(10, 18, 2)).toBe(RollOutcome.CS);
});

test('CS: dc 20, total: 30, ', () => {
    expect(calculateRollResult(20, 18, 12)).toBe(RollOutcome.CS);
});

test('CS: dc 30, total: 40, ', () => {
    expect(calculateRollResult(30, 18, 22)).toBe(RollOutcome.CS);
});

test('CS: dc 10, total: 10, NT', () => {
    expect(calculateRollResult(10, 20, -10)).toBe(RollOutcome.CS);
});

test('CS: dc 20, total: 20, NT', () => {
    expect(calculateRollResult(20, 20, 0)).toBe(RollOutcome.CS);
});

test('CS: dc 30, total: 30, NT', () => {
    expect(calculateRollResult(30, 20, 10)).toBe(RollOutcome.CS);
});

// Successes

test('S: dc 10, total: 10, ', () => {
    expect(calculateRollResult(10, 8, 2)).toBe(RollOutcome.S);
});

test('S: dc 20, total: 20, ', () => {
    expect(calculateRollResult(20, 8, 12)).toBe(RollOutcome.S);
});

test('S: dc 30, total: 30, ', () => {
    expect(calculateRollResult(30, 8, 22)).toBe(RollOutcome.S);
});

//with Natural 20
test('S: dc 10, total: 0, N20', () => {
    expect(calculateRollResult(10, 20, -20)).toBe(RollOutcome.S);
});

test('S: dc 20, total: 10, N20', () => {
    expect(calculateRollResult(20, 20, -10)).toBe(RollOutcome.S);
});

test('S: dc 30, total: 20, N20', () => {
    expect(calculateRollResult(30, 20, 0)).toBe(RollOutcome.S);
});

//with Natural 1
test('S: dc 10, total: 20, N1', () => {
    expect(calculateRollResult(10, 1, 19)).toBe(RollOutcome.S);
});

test('S: dc 20, total: 30, N1', () => {
    expect(calculateRollResult(20, 1, 29)).toBe(RollOutcome.S);
});

test('S: dc 30, total: 40, N1', () => {
    expect(calculateRollResult(30, 1, 39)).toBe(RollOutcome.S);
});

// Failures

test('F: dc 10, total: 9, ', () => {
    expect(calculateRollResult(10, 8, 1)).toBe(RollOutcome.F);
});

test('F: dc 20, total: 19, ', () => {
    expect(calculateRollResult(20, 8, 11)).toBe(RollOutcome.F);
});

test('F: dc 30, total: 29, ', () => {
    expect(calculateRollResult(30, 8, 21)).toBe(RollOutcome.F);
});

//with Natural 20
test('F: dc 10, total: -1, N20', () => {
    expect(calculateRollResult(10, 20, -21)).toBe(RollOutcome.F);
});

test('F: dc 20, total: 9, N20', () => {
    expect(calculateRollResult(20, 20, -11)).toBe(RollOutcome.F);
});

test('F: dc 30, total: 19, N20', () => {
    expect(calculateRollResult(30, 20, -1)).toBe(RollOutcome.F);
});

//with Natural 1
test('F: dc 10, total: 10, N1', () => {
    expect(calculateRollResult(10, 1, 9)).toBe(RollOutcome.F);
});

test('F: dc 20, total: 20, N1', () => {
    expect(calculateRollResult(20, 1, 19)).toBe(RollOutcome.F);
});

test('F: dc 30, total: 30, N1', () => {
    expect(calculateRollResult(30, 1, 29)).toBe(RollOutcome.F);
});


test("Staged results no natrual", () => {
    for (let i = 2; i <= 4; i++) {
        expect(calculateRollResult(15, i, 0)).toBe(RollOutcome.CF);
    }

    for (let i = 5; i <= 14; i++) {
        expect(calculateRollResult(15, i, 0)).toBe(RollOutcome.F);
    }

    for (let i = 15; i <= 19; i++) {
        expect(calculateRollResult(15, i, 0)).toBe(RollOutcome.S);
    }
})


test("Staged results N20 (total 20 -> 29)", () => {
    for (let i = 0; i <= 9; i++) {
        expect(calculateRollResult(40, 20, i)).toBe(RollOutcome.F);
    }
})

test("Staged results N20 (total 30 -> 39)", () => {

    for (let i = 10; i <= 19; i++) {
        expect(calculateRollResult(40, 20, i)).toBe(RollOutcome.S);
    }
})

test("Staged results N20 (total 40 -> 49)", () => {

    for (let i = 20; i <= 30; i++) {
        expect(calculateRollResult(40, 20, i)).toBe(RollOutcome.CS);
    }
})

test("Staged results N1 (total 10 -> 19) F", () => {
    for (let i = 9; i <= 18; i++) {
        expect(calculateRollResult(20, 1, i)).toBe(RollOutcome.CF);
    }
})

test("Staged results N1 (total 20 -> 29) F", () => {

    for (let i = 19; i <= 28; i++) {
        expect(calculateRollResult(20, 1, i)).toBe(RollOutcome.F);
    }
})
test("Staged results N1 (total 30 -> 32) F", () => {

    for (let i = 29; i <= 31; i++) {
        expect(calculateRollResult(20, 1, i)).toBe(RollOutcome.S);
    }
})


test("Test trained", () => {
    const level = 10;
    const attValue = 14;
    const attType = Attribute.dex;
    const penatly = 0;
    const activePenalty = (attType === Attribute.dex || attType === Attribute.str) ? penatly : 0;
    const proficency = proficiencyLevel.Trained;
    const item = 10;


    const r = evaluateRollBonuses({
        untrainedImprovisation: false,
        level: level,
        attrValue: attValue,
        penalty: penatly,
        item: item,
        training: proficency
    })

    const bonus = level + attValue + ProficiencyValueMap[proficency] + item;
    const passive = bonus + 10

    expect(r.bonus).toBe(bonus)
    expect(r.passive).toBe(passive)
    expect(r.activePenalty).toBe(activePenalty)


})
