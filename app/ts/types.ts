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


export enum Skill {
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
    [Skill.acrobatics]: Attribute.dex,
    [Skill.arcana]: Attribute.int,
    [Skill.athletics]: Attribute.str,
    [Skill.crafting]: Attribute.int,
    [Skill.deception]: Attribute.cha,
    [Skill.diplomacy]: Attribute.cha,
    [Skill.intimidation]: Attribute.cha,
    [Skill.medicine]: Attribute.wis,
    [Skill.nature]: Attribute.wis,
    [Skill.occultism]: Attribute.int,
    [Skill.performance]: Attribute.cha,
    [Skill.religion]: Attribute.wis,
    [Skill.society]: Attribute.int,
    [Skill.stealth]: Attribute.dex,
    [Skill.survival]: Attribute.wis,
    [Skill.thievery]: Attribute.dex
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
    [Skill.acrobatics]: number,
    [Skill.arcana]: number,
    [Skill.athletics]: number,
    [Skill.crafting]: number,
    [Skill.deception]: number,
    [Skill.diplomacy]: number,
    [Skill.intimidation]: number,
    [Skill.medicine]: number,
    [Skill.nature]: number,
    [Skill.occultism]: number,
    [Skill.performance]: number,
    [Skill.religion]: number,
    [Skill.society]: number,
    [Skill.stealth]: number,
    [Skill.survival]: number,
    [Skill.thievery]: number,
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
    [Skill.acrobatics]: proficiencyLevel,
    [Skill.arcana]: proficiencyLevel,
    [Skill.athletics]: proficiencyLevel,
    [Skill.crafting]: proficiencyLevel,
    [Skill.deception]: proficiencyLevel,
    [Skill.diplomacy]: proficiencyLevel,
    [Skill.intimidation]: proficiencyLevel,
    [Skill.medicine]: proficiencyLevel,
    [Skill.nature]: proficiencyLevel,
    [Skill.occultism]: proficiencyLevel,
    [Skill.performance]: proficiencyLevel,
    [Skill.religion]: proficiencyLevel,
    [Skill.society]: proficiencyLevel,
    [Skill.stealth]: proficiencyLevel,
    [Skill.survival]: proficiencyLevel,
    [Skill.thievery]: proficiencyLevel,
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
    return Object.values(Skill).reduce((acc, key) => {
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
    [defenseEnum.fortitude]: iTableDisplay,
    [defenseEnum.reflex]: iTableDisplay,
    [defenseEnum.will]: iTableDisplay,
    perception: iSelectedDisplay,
    resistances: iTableDisplay,
    vulnerabilities: iTableDisplay,
    classDC: iTableDisplay,
    spellDC: iTableDisplay,
    [Skill.thievery]: iSelectedDisplay,
    [Skill.acrobatics]: iSelectedDisplay,
    [Skill.arcana]: iSelectedDisplay,
    [Skill.athletics]: iSelectedDisplay,
    [Skill.crafting]: iSelectedDisplay,
    [Skill.deception]: iSelectedDisplay,
    [Skill.diplomacy]: iSelectedDisplay,
    [Skill.intimidation]: iSelectedDisplay,
    [Skill.medicine]: iSelectedDisplay,
    [Skill.nature]: iSelectedDisplay,
    [Skill.occultism]: iSelectedDisplay,
    [Skill.performance]: iSelectedDisplay,
    [Skill.religion]: iSelectedDisplay,
    [Skill.society]: iSelectedDisplay,
    [Skill.stealth]: iSelectedDisplay,
    [Skill.survival]: iSelectedDisplay,
}



