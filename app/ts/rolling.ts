import {Attribute, proficiencyEnum, proficiencyValues, type RollInfo, type RollResult, SuccessEnum} from "./types";

const CRITICAL_SUCCESS_MARGIN = 10;
const CRITICAL_FAILURE_MARGIN = -10;

// Utility function to get active penalty based on attribute type
function getActivePenalty(attrType: Attribute, penalty: number): number {
    return (attrType === Attribute.dex || attrType === Attribute.str) ? penalty : 0;
}

// Utility function to determine critical success/failure modifiers
function getCriticalModifiers(roll: number): { cSuccess: number; cFailure: number } {
    return {
        cSuccess: roll === 20 ? 1 : 0,
        cFailure: roll === 1 ? 1 : 0,
    };
}

export function getProficiencyString(info: RollInfo): string {
    const proficiencyMap: Record<proficiencyEnum, string> = {
        [proficiencyEnum.U]: "",
        [proficiencyEnum.T]: "T",
        [proficiencyEnum.E]: "E",
        [proficiencyEnum.M]: "M",
        [proficiencyEnum.L]: "L",
    };
    return (info.training === proficiencyEnum.U && info.untrainedImprovisation)
        ? "UI"
        : (proficiencyMap[info.training] || "");
}

export function calculateProficiency(level: number, training: proficiencyEnum, untrainedImprovisation: boolean): number {
    if (training === proficiencyEnum.U) {
        if (untrainedImprovisation) {
            return level < 5 ? level - 2 : level < 7 ? level - 1 : level;
        }
        return 0;
    }
    return level + proficiencyValues[training];
}

export function calculateProficiencyFromInfo(info: RollInfo): number {
    return calculateProficiency(info.level, info.training, info.untrainedImprovisation);
}

export function calculateBonus(attrType: Attribute, attrValue: number, itemBonus: number, proficiencyBonus: number, penalty: number): number {
    const activePenalty = getActivePenalty(attrType, penalty);
    return attrValue + activePenalty + itemBonus + proficiencyBonus;
}

export function calculateBonusFromInfo(rollInfo: RollInfo): number {
    const proficiency = calculateProficiencyFromInfo(rollInfo);
    return calculateBonus(rollInfo.attrType, rollInfo.attrValue, rollInfo.item, proficiency, rollInfo.penalty);
}

export function calculateRollResult(dc: number, roll: number, bonus: number, miscMod: number = 0): SuccessEnum {
    const value = roll + bonus + miscMod;
    const {cSuccess, cFailure} = getCriticalModifiers(roll);

    if (value >= dc + CRITICAL_SUCCESS_MARGIN) return SuccessEnum.CS - cFailure; // Critical Success
    if (value >= dc) return SuccessEnum.S + cSuccess - cFailure; // Success
    if (value <= dc + CRITICAL_FAILURE_MARGIN) return SuccessEnum.CF + cSuccess; // Critical Failure
    return SuccessEnum.F - cFailure; // Failure
}

export function calculateRollResultBase(rollInfo: RollInfo): RollResult {
    const proficiency = calculateProficiencyFromInfo(rollInfo);
    const bonus = calculateBonusFromInfo(rollInfo);
    const activePenalty = getActivePenalty(rollInfo.attrType, rollInfo.penalty);

    return {
        proficiency,
        bonus,
        passive: 10 + bonus,
        activePenalty,
    };
}

export function calculateDC(attrValue: number, level: number, training: proficiencyEnum, itemBonus: number): number {
    const proficiency = calculateProficiency(level, training, false);
    const bonus = calculateBonus(Attribute.wis, attrValue, itemBonus, proficiency, 0);
    return 10 + bonus;
}

export function getPrefix(value: number): string {
    return value < 0 ? '' : '+';
}
