import {Attribute, proficiencyLevel, ProficiencyValueMap, type RollInfo} from "./types";


export enum RollOutcome {
    CF = -1,
    F = 0,
    S = 1,
    CS = 2
}

export type RollResult = {
    bonus: number,
    proficiency: number,
    passive: number,
    activePenalty: number,
    roll?: number,
    total?: number,
    result?: RollOutcome,
}

export const SuccessAsString = {
    [RollOutcome.CF]: "cf",
    [RollOutcome.F]: "f",
    [RollOutcome.S]: "s",
    [RollOutcome.CS]: "cs",

}

const CRITICAL_MARGIN = 10;

// Utility function to get active penalty based on attribute type
function getActivePenalty(attrType: Attribute, penalty: number): number {
    return (attrType === Attribute.dex || attrType === Attribute.str) ? penalty : 0;
}

// Utility function to determine critical success/failure modifiers
export function getCriticalModifiers(roll: number): { cSuccess: number; cFailure: number } {
    return {
        cSuccess: roll === 20 ? 1 : 0,
        cFailure: roll === 1 ? 1 : 0,
    };
}

export function getProficiencyString(info: RollInfo): string {
    const proficiencyMap: Record<proficiencyLevel, string> = {
        [proficiencyLevel.Untrained]: "",
        [proficiencyLevel.Trained]: "T",
        [proficiencyLevel.Expert]: "E",
        [proficiencyLevel.Master]: "M",
        [proficiencyLevel.Legendary]: "L",
    };
    return (info.training === proficiencyLevel.Untrained && info.untrainedImprovisation)
        ? "UI"
        : (proficiencyMap[info.training] || "");
}

export function calculateProficiency(level: number, training: proficiencyLevel, untrainedImprovisation: boolean): number {
    if (training === proficiencyLevel.Untrained) {
        if (untrainedImprovisation) {
            return level < 5 ? level - 2 : level < 7 ? level - 1 : level;
        }
        return 0;
    }
    return level + ProficiencyValueMap[training];
}

export function evaluateRollBonuses(rollInfo: RollInfo): RollResult {
    const proficiency = evaluateProficiency(rollInfo);
    const bonus = calculateBonus(rollInfo.attrType, rollInfo.attrValue, rollInfo.item, proficiency, rollInfo.penalty);
    const activePenalty = getActivePenalty(rollInfo.attrType, rollInfo.penalty);

    return {
        proficiency,
        bonus,
        passive: 10 + bonus,
        activePenalty,
    };
}

export function evaluateProficiency(info: RollInfo): number {
    return calculateProficiency(info.level, info.training, info.untrainedImprovisation);
}

export function calculateBonus(attrType: Attribute, attrValue: number, itemBonus: number, proficiencyBonus: number, penalty: number): number {
    const activePenalty = getActivePenalty(attrType, penalty);
    return attrValue + activePenalty + itemBonus + proficiencyBonus;
}

export function calculateBonusFromInfo(rollInfo: RollInfo): number {
    const proficiency = evaluateProficiency(rollInfo);
    return calculateBonus(rollInfo.attrType, rollInfo.attrValue, rollInfo.item, proficiency, rollInfo.penalty);
}

export function calculateDcFromInfo(rollInfo: RollInfo): number {
    return 10 + calculateBonusFromInfo(rollInfo);
}

export function calculateRollResult(dc: number, roll: number, bonus: number): RollOutcome {
    const value = roll + bonus;
    const {cSuccess, cFailure} = getCriticalModifiers(roll);

    if (value >= dc + CRITICAL_MARGIN)
        return RollOutcome.CS - cFailure; // Critical Success
    if (value >= dc)
        return RollOutcome.S + cSuccess - cFailure; // Success
    if (value >= dc - CRITICAL_MARGIN)
        return RollOutcome.F + cSuccess - cFailure; //Failure
    return RollOutcome.CF + cSuccess; // Critical Failure
}

export function calculateDC(attrType: Attribute, attrValue: number, level: number, training: proficiencyLevel, itemBonus: number): number {
    const proficiency = calculateProficiency(level, training, false);
    const bonus = calculateBonus(attrType, attrValue, itemBonus, proficiency, 0);
    return 10 + bonus;
}

export function getPrefix(value: number): string {
    return value < 0 ? '' : '+';
}
