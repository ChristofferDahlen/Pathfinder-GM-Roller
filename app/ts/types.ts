
export enum Attribute {
    str = "str",
    dex = "dex",
    con = "con",
    int = "int",
    wis = "wis",
    cha = "cha",
}

export const attrFullname = {
    [Attribute.str] : "Strength",
    [Attribute.dex] : "Dexterity",
    [Attribute.con] : "Constitution",
    [Attribute.int] : "Intelligence",
    [Attribute.wis] : "Wisdom",
    [Attribute.cha] : "Charisma",
}


export enum Skill {
    acrobatics = "acrobatics",
    arcana = "arcana" ,
    athletics = "athletics" ,
    crafting = "crafting" ,
    deception = "deception" ,
    diplomacy = "diplomacy" ,
    intimidation = "intimidation" ,
    medicine = "medicine" ,
    nature = "nature" ,
    occultism = "occultism" ,
    performance = "performance" ,
    religion = "religion" ,
    society = "society" ,
    stealth = "stealth" ,
    survival = "survival" ,
    thievery = "thievery" ,
}

export const attrBase = {
    [Skill.acrobatics] : Attribute.dex,
    [Skill.arcana] :  Attribute.int,
    [Skill.athletics] : Attribute.str,
    [Skill.crafting] : Attribute.int,
    [Skill.deception] : Attribute.cha,
    [Skill.diplomacy] : Attribute.cha,
    [Skill.intimidation] : Attribute.cha,
    [Skill.medicine] : Attribute.wis,
    [Skill.nature] : Attribute.wis,
    [Skill.occultism] : Attribute.int,
    [Skill.performance] : Attribute.cha,
    [Skill.religion] : Attribute.wis,
    [Skill.society] : Attribute.int,
    [Skill.stealth] : Attribute.dex,
    [Skill.survival] : Attribute.wis,
    [Skill.thievery] : Attribute.dex
}

export enum miscEnum {
    ClassDC="ClassDC",
    SpellDC="spellDC",
    perception="Perception",
    vulnerabilites = "Vulnerabilites"
}

export enum proficiencyEnum {
    U = "0",
    T = "2",
    E = "4",
    M = "6",
    L = "8"
}

export const proficiencyValues = {
    [proficiencyEnum.U] : 0,
    [proficiencyEnum.T] : 2,
    [proficiencyEnum.E] : 4,
    [proficiencyEnum.M] : 6,
    [proficiencyEnum.L] : 8,
}


export enum SuccessEnum  {
    CF = -1,
    F = 0,
    S = 1,
    CS = 2
}

export const SuccessAsString = {
    [SuccessEnum.CF] : "cf",
    [SuccessEnum.F] : "f",
    [SuccessEnum.S] : "s",
    [SuccessEnum.CS] : "cs",

}

export enum defenseEnum {
    fortitude = "fortitude",
    reflex = "reflex",
    will = "will",
}

export enum castingEnum {
    castingArcane = "castingArcane",
    castingDivine = "castingDivine",
    castingOccult = "castingOccult",
    castingPrimal = "castingPrimal",
}

export enum weaponEnum {
    advanced = "advanced",
    martial = "martial",
    simple = "simple",
    unarmed = "unarmed",
}

export interface iAttribute {
    [Attribute.str] : number,
    [Attribute.dex] : number,
    [Attribute.con] : number,
    [Attribute.int] : number,
    [Attribute.wis] : number,
    [Attribute.cha] : number,
}

export interface iSkillVal {
    classDC: number,
    perception: number,
    [defenseEnum.fortitude] : number,
    [defenseEnum.will] : number,
    [defenseEnum.reflex] : number,
    [Skill.acrobatics] : number,
    [Skill.arcana] :  number,
    [Skill.athletics] : number,
    [Skill.crafting] : number,
    [Skill.deception] : number,
    [Skill.diplomacy] : number,
    [Skill.intimidation] : number,
    [Skill.medicine] : number,
    [Skill.nature] : number,
    [Skill.occultism] : number,
    [Skill.performance] : number,
    [Skill.religion] : number,
    [Skill.society] : number,
    [Skill.stealth] : number,
    [Skill.survival] : number,
    [Skill.thievery] : number,

}

export type belowBorder = {
    [key in Skill]?: boolean
}


export interface iProtection {
    ac: number,
    shield: number
}

export interface iVulRes {
    name: string;
    value: number
}

export interface iLore {
    name: string,
    proficiency: proficiencyEnum,
    item: number
}



export type iCharacters = Array<iCharacter>

export interface iParty {
    name: string,
    characters: iCharacters
}

export interface iDC {
    name: string,
    type: string,
    item: number,
    keyAttr: Attribute,
    proficiency: proficiencyEnum,
}



export type iProficiencies = {
    classDC: proficiencyEnum,
    perception: proficiencyEnum,
    [defenseEnum.fortitude] : proficiencyEnum,
    [defenseEnum.will] : proficiencyEnum,
    [defenseEnum.reflex] : proficiencyEnum,
    [Skill.acrobatics] : proficiencyEnum,
    [Skill.arcana] :  proficiencyEnum,
    [Skill.athletics] : proficiencyEnum,
    [Skill.crafting] : proficiencyEnum,
    [Skill.deception] : proficiencyEnum,
    [Skill.diplomacy] : proficiencyEnum,
    [Skill.intimidation] : proficiencyEnum,
    [Skill.medicine] : proficiencyEnum,
    [Skill.nature] : proficiencyEnum,
    [Skill.occultism] : proficiencyEnum,
    [Skill.performance] : proficiencyEnum,
    [Skill.religion] : proficiencyEnum,
    [Skill.society] : proficiencyEnum,
    [Skill.stealth] : proficiencyEnum,
    [Skill.survival] : proficiencyEnum,
    [Skill.thievery] : proficiencyEnum,
}

export interface iCharacter {
    key: string,
    name: string,
    playerName: string,
    class?: string,
    dualClass?: string,
    level: number,
    keyAbility: Attribute,
    attributes: iAttribute,
    protection: iProtection,
    resistances: Array<iVulRes>,
    vulnerabilities: Array<iVulRes>,
    hasClassDC: boolean,
    untrainedImprovisation: boolean,
    checkPenalty: number,
    spellDCs: Array<iDC>,
    proficiencies: iProficiencies,
    item: iSkillVal,
    lores: Array<iLore>,
}


function newProfVal(): iProficiencies {
    return {
        classDC: proficiencyEnum.U,
        perception: proficiencyEnum.U,
        fortitude: proficiencyEnum.U,
        reflex: proficiencyEnum.U,
        will: proficiencyEnum.U,
        acrobatics: proficiencyEnum.U,
        arcana: proficiencyEnum.U,
        athletics: proficiencyEnum.U,
        crafting: proficiencyEnum.U,
        deception: proficiencyEnum.U,
        diplomacy: proficiencyEnum.U,
        intimidation: proficiencyEnum.U,
        medicine: proficiencyEnum.U,
        nature: proficiencyEnum.U,
        occultism: proficiencyEnum.U,
        performance: proficiencyEnum.U,
        religion: proficiencyEnum.U,
        society: proficiencyEnum.U,
        stealth: proficiencyEnum.U,
        survival: proficiencyEnum.U,
        thievery: proficiencyEnum.U,
    }
}


function newSkillVal(): iSkillVal {
    return {
        classDC: 0,
        perception: 0,
        fortitude: 0,
        reflex: 0,
        will: 0,
        acrobatics: 0,
        arcana: 0,
        athletics: 0,
        crafting: 0,
        deception: 0,
        diplomacy: 0,
        intimidation: 0,
        medicine: 0,
        nature: 0,
        occultism: 0,
        performance: 0,
        religion: 0,
        society: 0,
        stealth: 0,
        survival: 0,
        thievery: 0,
    }
}

export function newCharacter(n: number): iCharacter {
    return {
        key: "",
        name: ("char " + n),
        playerName: "",
        level: 1,
        keyAbility: Attribute.str,
        attributes: {
            str: 0,
            dex: 0,
            con: 0,
            int: 0,
            wis: 0,
            cha: 0,
        },
        protection: {
            ac: 0,
            shield: 0
        },
        resistances: [],
        vulnerabilities: [],
        hasClassDC: true,
        untrainedImprovisation: false,
        checkPenalty: 0,
        spellDCs: [],
        proficiencies: newProfVal(),
        item: newSkillVal(),
        lores: [],
    };
}


export function newParty(): iParty {
    return { name: "",  characters: [newCharacter(1), newCharacter(2), newCharacter(3), newCharacter(4)]}
}

export interface iProficiencyOption {
    name: string,
    value: number,
}


export interface iTableDisplay {
    shown : boolean,
    hover : boolean,
}

export interface iSelectedDisplay extends iTableDisplay {
    selected: boolean,
}

export interface RollInfo {
    rollType: string,
    attrType : Attribute,
    attrValue: number,
    training: proficiencyEnum,
    untrainedImprovisation: boolean,
    level: number,
    item: number,
    penalty: number,

}

export type RollResult = {
    bonus: number,
    proficiency: number,
    passive: number,
    activePenalty: number,
    roll?: number,
    total?: number,
    result?: SuccessEnum,
}



export interface iSkillTable {
    AC: iTableDisplay,
    [defenseEnum.fortitude] : iTableDisplay,
    [defenseEnum.reflex] : iTableDisplay,
    [defenseEnum.will] : iTableDisplay,
    perception : iSelectedDisplay,
    resistances: iTableDisplay,
    vulnerabilities: iTableDisplay,
    classDC: iTableDisplay,
    spellDC: iTableDisplay,
    [Skill.thievery] : iSelectedDisplay,
    [Skill.acrobatics] : iSelectedDisplay,
    [Skill.arcana] :  iSelectedDisplay,
    [Skill.athletics] : iSelectedDisplay,
    [Skill.crafting] : iSelectedDisplay,
    [Skill.deception] : iSelectedDisplay,
    [Skill.diplomacy] : iSelectedDisplay,
    [Skill.intimidation] : iSelectedDisplay,
    [Skill.medicine] : iSelectedDisplay,
    [Skill.nature] : iSelectedDisplay,
    [Skill.occultism] : iSelectedDisplay,
    [Skill.performance] : iSelectedDisplay,
    [Skill.religion] : iSelectedDisplay,
    [Skill.society] : iSelectedDisplay,
    [Skill.stealth] : iSelectedDisplay,
    [Skill.survival] : iSelectedDisplay,
}



