
export enum attEnum {
    str = "str",
    dex = "dex",
    con = "con",
    int = "int",
    wis = "wis",
    cha = "cha",
}

export const attrFullname = {
    [attEnum.str] : "Strength",
    [attEnum.dex] : "Dexterity",
    [attEnum.con] : "Constitution",
    [attEnum.int] : "Intelligence",
    [attEnum.wis] : "Wisdom",
    [attEnum.cha] : "Charisma",
}


export enum skillEnum {
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
    [skillEnum.acrobatics] : attEnum.dex,
    [skillEnum.arcana] :  attEnum.int,
    [skillEnum.athletics] : attEnum.str,
    [skillEnum.crafting] : attEnum.int,
    [skillEnum.deception] : attEnum.cha,
    [skillEnum.diplomacy] : attEnum.cha,
    [skillEnum.intimidation] : attEnum.cha,
    [skillEnum.medicine] : attEnum.wis,
    [skillEnum.nature] : attEnum.wis,
    [skillEnum.occultism] : attEnum.int,
    [skillEnum.performance] : attEnum.cha,
    [skillEnum.religion] : attEnum.wis,
    [skillEnum.society] : attEnum.int,
    [skillEnum.stealth] : attEnum.dex,
    [skillEnum.survival] : attEnum.wis,
    [skillEnum.thievery] : attEnum.dex
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


export enum sucessEnum  {
    CF = -1,
    F = 0,
    S = 1,
    CS = 2
}

export const sucessAsString = {
    [sucessEnum.CF] : "cf",
    [sucessEnum.F] : "f",
    [sucessEnum.S] : "s",
    [sucessEnum.CS] : "cs",

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
    [attEnum.str] : number,
    [attEnum.dex] : number,
    [attEnum.con] : number,
    [attEnum.int] : number,
    [attEnum.wis] : number,
    [attEnum.cha] : number,
}

export interface iSkillVal {
    classDC: number,
    perception: number,
    [defenseEnum.fortitude] : number,
    [defenseEnum.will] : number,
    [defenseEnum.reflex] : number,
    [skillEnum.acrobatics] : number,
    [skillEnum.arcana] :  number,
    [skillEnum.athletics] : number,
    [skillEnum.crafting] : number,
    [skillEnum.deception] : number,
    [skillEnum.diplomacy] : number,
    [skillEnum.intimidation] : number,
    [skillEnum.medicine] : number,
    [skillEnum.nature] : number,
    [skillEnum.occultism] : number,
    [skillEnum.performance] : number,
    [skillEnum.religion] : number,
    [skillEnum.society] : number,
    [skillEnum.stealth] : number,
    [skillEnum.survival] : number,
    [skillEnum.thievery] : number,

}

export type belowBorder = {
    [key in skillEnum]?: boolean
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
    keyAttr: attEnum,
    proficiency: proficiencyEnum,
}



export type iProficiencies = {
    classDC: proficiencyEnum,
    perception: proficiencyEnum,
    [defenseEnum.fortitude] : proficiencyEnum,
    [defenseEnum.will] : proficiencyEnum,
    [defenseEnum.reflex] : proficiencyEnum,
    [skillEnum.acrobatics] : proficiencyEnum,
    [skillEnum.arcana] :  proficiencyEnum,
    [skillEnum.athletics] : proficiencyEnum,
    [skillEnum.crafting] : proficiencyEnum,
    [skillEnum.deception] : proficiencyEnum,
    [skillEnum.diplomacy] : proficiencyEnum,
    [skillEnum.intimidation] : proficiencyEnum,
    [skillEnum.medicine] : proficiencyEnum,
    [skillEnum.nature] : proficiencyEnum,
    [skillEnum.occultism] : proficiencyEnum,
    [skillEnum.performance] : proficiencyEnum,
    [skillEnum.religion] : proficiencyEnum,
    [skillEnum.society] : proficiencyEnum,
    [skillEnum.stealth] : proficiencyEnum,
    [skillEnum.survival] : proficiencyEnum,
    [skillEnum.thievery] : proficiencyEnum,
}

export interface iCharacter {
    key: string,
    name: string,
    playerName: string,
    class?: string,
    dualClass?: string,
    level: number,
    keyAbility: attEnum,
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
        keyAbility: attEnum.str,
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
    attrType : attEnum,
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
    result?: sucessEnum,
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
    [skillEnum.thievery] : iSelectedDisplay,
    [skillEnum.acrobatics] : iSelectedDisplay,
    [skillEnum.arcana] :  iSelectedDisplay,
    [skillEnum.athletics] : iSelectedDisplay,
    [skillEnum.crafting] : iSelectedDisplay,
    [skillEnum.deception] : iSelectedDisplay,
    [skillEnum.diplomacy] : iSelectedDisplay,
    [skillEnum.intimidation] : iSelectedDisplay,
    [skillEnum.medicine] : iSelectedDisplay,
    [skillEnum.nature] : iSelectedDisplay,
    [skillEnum.occultism] : iSelectedDisplay,
    [skillEnum.performance] : iSelectedDisplay,
    [skillEnum.religion] : iSelectedDisplay,
    [skillEnum.society] : iSelectedDisplay,
    [skillEnum.stealth] : iSelectedDisplay,
    [skillEnum.survival] : iSelectedDisplay,
}



