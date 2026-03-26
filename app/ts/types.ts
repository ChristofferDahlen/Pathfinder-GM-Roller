export enum Attribute {
    str = "str",
    dex = "dex",
    con = "con",
    int = "int",
    wis = "wis",
    cha = "cha",
}

export const attrFullname = {
    [Attribute.str]: "Strength",
    [Attribute.dex]: "Dexterity",
    [Attribute.con]: "Constitution",
    [Attribute.int]: "Intelligence",
    [Attribute.wis]: "Wisdom",
    [Attribute.cha]: "Charisma",
}


export enum Skills {
    acrobatics = "acrobatics",
    arcana = "arcana",
    athletics = "athletics",
    crafting = "crafting",
    deception = "deception",
    diplomacy = "diplomacy",
    intimidation = "intimidation",
    medicine = "medicine",
    nature = "nature",
    occultism = "occultism",
    performance = "performance",
    religion = "religion",
    society = "society",
    stealth = "stealth",
    survival = "survival",
    thievery = "thievery",
}

export enum DefenseEnum { // Renamed enum to follow PascalCase convention
    Fortitude = "fortitude",
    Reflex = "reflex",
    Will = "will",
}

export const attrBase = {
    [DefenseEnum.Fortitude] : Attribute.con,
    [DefenseEnum.Reflex] : Attribute.dex,
    [DefenseEnum.Will] : Attribute.wis,
    [Skills.acrobatics]: Attribute.dex,
    [Skills.arcana]: Attribute.int,
    [Skills.athletics]: Attribute.str,
    [Skills.crafting]: Attribute.int,
    [Skills.deception]: Attribute.cha,
    [Skills.diplomacy]: Attribute.cha,
    [Skills.intimidation]: Attribute.cha,
    [Skills.medicine]: Attribute.wis,
    [Skills.nature]: Attribute.wis,
    [Skills.occultism]: Attribute.int,
    [Skills.performance]: Attribute.cha,
    [Skills.religion]: Attribute.wis,
    [Skills.society]: Attribute.int,
    [Skills.stealth]: Attribute.dex,
    [Skills.survival]: Attribute.wis,
    [Skills.thievery]: Attribute.dex
}

export enum miscEnum {
    ClassDC = "ClassDC",
    SpellDC = "spellDC",
    perception = "Perception",
    vulnerabilites = "Vulnerabilites"
}

export enum proficiencyLevel {
    Untrained = "0",
    Trained = "2",
    Expert = "4",
    Master = "6",
    Legendary = "8"
}

export const ProficiencyValueMap: Readonly<Record<proficiencyLevel, number>> = {
    [proficiencyLevel.Untrained]: 0,
    [proficiencyLevel.Trained]: 2,
    [proficiencyLevel.Expert]: 4,
    [proficiencyLevel.Master]: 6,
    [proficiencyLevel.Legendary]: 8,
};



export interface iAttribute {
    [Attribute.str]: number,
    [Attribute.dex]: number,
    [Attribute.con]: number,
    [Attribute.int]: number,
    [Attribute.wis]: number,
    [Attribute.cha]: number,
}

export interface iSkillVal {
    classDC: number,
    perception: number,
    [DefenseEnum.Fortitude]: number,
    [DefenseEnum.Will]: number,
    [DefenseEnum.Reflex]: number,
    [Skills.acrobatics]: number,
    [Skills.arcana]: number,
    [Skills.athletics]: number,
    [Skills.crafting]: number,
    [Skills.deception]: number,
    [Skills.diplomacy]: number,
    [Skills.intimidation]: number,
    [Skills.medicine]: number,
    [Skills.nature]: number,
    [Skills.occultism]: number,
    [Skills.performance]: number,
    [Skills.religion]: number,
    [Skills.society]: number,
    [Skills.stealth]: number,
    [Skills.survival]: number,
    [Skills.thievery]: number,
}

export type belowBorder = {
    [key in Skills]?: boolean
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
    proficiency: proficiencyLevel,
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
    proficiency: proficiencyLevel,
}


export type iProficiencies = {
    classDC: proficiencyLevel,
    perception: proficiencyLevel,
    [DefenseEnum.Fortitude]: proficiencyLevel,
    [DefenseEnum.Will]: proficiencyLevel,
    [DefenseEnum.Reflex]: proficiencyLevel,
    [Skills.acrobatics]: proficiencyLevel,
    [Skills.arcana]: proficiencyLevel,
    [Skills.athletics]: proficiencyLevel,
    [Skills.crafting]: proficiencyLevel,
    [Skills.deception]: proficiencyLevel,
    [Skills.diplomacy]: proficiencyLevel,
    [Skills.intimidation]: proficiencyLevel,
    [Skills.medicine]: proficiencyLevel,
    [Skills.nature]: proficiencyLevel,
    [Skills.occultism]: proficiencyLevel,
    [Skills.performance]: proficiencyLevel,
    [Skills.religion]: proficiencyLevel,
    [Skills.society]: proficiencyLevel,
    [Skills.stealth]: proficiencyLevel,
    [Skills.survival]: proficiencyLevel,
    [Skills.thievery]: proficiencyLevel,
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
    languages: Array<string>,
}


const DEFAULT_PROFICIENCY = proficiencyLevel.Untrained;
const DEFAULT_SKILL_VALUE = 0;

// Utility function to create default values
function createDefaultValues<T>(defaultValue: T): Record<string, T> {
    return Object.values(Skills).reduce((acc, key) => {
        acc[key] = defaultValue;
        return acc;
    }, {} as Record<string, T>);
}

// Create default proficiencies
function createDefaultProficiencies(): iProficiencies {
    return {
        classDC: DEFAULT_PROFICIENCY,
        perception: DEFAULT_PROFICIENCY,
        [DefenseEnum.Fortitude]: DEFAULT_PROFICIENCY,
        [DefenseEnum.Reflex]: DEFAULT_PROFICIENCY,
        [DefenseEnum.Will]: DEFAULT_PROFICIENCY,
        ...createDefaultValues(proficiencyLevel.Untrained),
    };
}

// Create default skill values
function createDefaultSkillValues(): iSkillVal {
    return {
        classDC: DEFAULT_SKILL_VALUE,
        perception: DEFAULT_SKILL_VALUE,
        [DefenseEnum.Fortitude]: DEFAULT_SKILL_VALUE,
        [DefenseEnum.Reflex]: DEFAULT_SKILL_VALUE,
        [DefenseEnum.Will]: DEFAULT_SKILL_VALUE,
        ...createDefaultValues(DEFAULT_SKILL_VALUE),
    };
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
        proficiencies: createDefaultProficiencies(),
        item: createDefaultSkillValues(),
        lores: [],
    };
}


export function newParty(): iParty {
    return {name: "", characters: [newCharacter(1), newCharacter(2), newCharacter(3), newCharacter(4)]}
}


export interface iTableDisplay {
    shown: boolean,
    hover: boolean,
}

export interface iSelectedDisplay extends iTableDisplay {
    selected: boolean,
}

export interface RollInfo {
    rollType: string,
    attrType: Attribute,
    attrValue: number,
    training: proficiencyLevel,
    untrainedImprovisation: boolean,
    level: number,
    item: number,
    penalty: number,

}


export interface iSkillTable {
    AC: iTableDisplay,
    [DefenseEnum.Fortitude]: iTableDisplay,
    [DefenseEnum.Reflex]: iTableDisplay,
    [DefenseEnum.Will]: iTableDisplay,
    perception: iSelectedDisplay,
    resistances: iTableDisplay,
    vulnerabilities: iTableDisplay,
    classDC: iTableDisplay,
    spellDC: iTableDisplay,
    [Skills.thievery]: iSelectedDisplay,
    [Skills.acrobatics]: iSelectedDisplay,
    [Skills.arcana]: iSelectedDisplay,
    [Skills.athletics]: iSelectedDisplay,
    [Skills.crafting]: iSelectedDisplay,
    [Skills.deception]: iSelectedDisplay,
    [Skills.diplomacy]: iSelectedDisplay,
    [Skills.intimidation]: iSelectedDisplay,
    [Skills.medicine]: iSelectedDisplay,
    [Skills.nature]: iSelectedDisplay,
    [Skills.occultism]: iSelectedDisplay,
    [Skills.performance]: iSelectedDisplay,
    [Skills.religion]: iSelectedDisplay,
    [Skills.society]: iSelectedDisplay,
    [Skills.stealth]: iSelectedDisplay,
    [Skills.survival]: iSelectedDisplay,
}



