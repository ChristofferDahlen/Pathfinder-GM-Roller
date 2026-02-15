import {attEnum, proficiencyEnum, proficiencyValues, type RollInfo, type RollResult, sucessEnum} from "./types";

export function profString(profEnum: proficiencyEnum) {
    return profEnum as string
}

export function getProficiencyString(info: RollInfo): string {
    const proficiencyMap: Record<proficiencyEnum, string> = {
        [proficiencyEnum.U]: "",
        [proficiencyEnum.T]: "T",
        [proficiencyEnum.E]: "E",
        [proficiencyEnum.M]: "M",
        [proficiencyEnum.L]: "L"
    };

    if (info.training === proficiencyEnum.U && info.untrainedImprovisation) {
        return "UI";
    }

    return proficiencyMap[info.training] || "";
}


export function calcProf(lvl: number, training: proficiencyEnum, untrainedImprovisation: boolean ) : number {

    if (training == proficiencyEnum.U){
        if (untrainedImprovisation) {
            if (lvl < 5)
                return lvl - 2;
            if (lvl < 7)
                return lvl - 1;
            return lvl;
        }

        return 0
    }

    return lvl + proficiencyValues[training];

}

export function calcProfByInfo(info: RollInfo) {
    return calcProf(info.level, info.training, info.untrainedImprovisation)
}

export function calcBonus(attrType: attEnum, attValue : number, item: number, prof: number, penalty: number) {
    const activePenalty = (attrType === attEnum.dex || attrType === attEnum.str) ? penalty : 0;
    return attValue + activePenalty + item + prof
}

export function calcBonusByInfo(rollInfo: RollInfo) {
    return calcBonus(rollInfo.attrType, rollInfo.attrValue, rollInfo.item, calcProfByInfo(rollInfo), rollInfo.penalty)
}

export function calculateResultBase(rollInfo : RollInfo) : RollResult {
    const prof = calcProfByInfo(rollInfo);
    const activePenalty = (rollInfo.attrType == attEnum.dex || rollInfo.attrType == attEnum.str) ? rollInfo.penalty : 0;

    const bonus = calcBonusByInfo(rollInfo)

    return {proficiency: prof, bonus: bonus, passive : 10 + bonus, activePenalty: activePenalty }
}

export function getPrefix(value : number) : string {
    if (value < 0)
        return '';
    return '+';
}

export function calculateDC(attValue : number, lvl: number, training: proficiencyEnum, item : number)
{
    const prof = calcProf(lvl, training, false)

    const bonus = calcBonus(attEnum.wis, attValue, item, prof, 0);
    return 10 + bonus;
}

export function calculateRollResult(dc: number, roll: number, bonus: number, misc_mod: number = 0): sucessEnum {
    const value = roll + bonus + misc_mod;
    const cSuccess = (roll === 20) ? 1 : 0;
    const cFailure = (roll === 1) ? 1 : 0;

    //Critical Success
    if (value >= (dc + 10)) {
        return 2 - cFailure
    }
    // Success
    if (value >= dc) {
        return 1 + cSuccess - cFailure
    }
    //Critical failure
    if (value < dc - 10) {
        return -1 + cSuccess
    }

    //failure
    return cSuccess - cFailure
}
