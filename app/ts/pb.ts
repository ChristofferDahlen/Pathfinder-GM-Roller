import {
    Attribute,
    type iCharacter,
    type iDC,
    type iLore,
    type iProficiencies,
    type iVulRes, proficiencyLevel
} from "./types";
import {capitalize} from "vue";

export interface iPBChar {
    build: iPBBuild
}

export interface iPBAbilities {
    [Attribute.str]: number,
    [Attribute.dex]: number,
    [Attribute.con]: number,
    [Attribute.int]: number,
    [Attribute.wis]: number,
    [Attribute.cha]: number,
}

export interface iPBProficiencies {
    "classDC": number,
    "perception": number,
    "fortitude": number,
    "reflex": number,
    "will": number,
    "heavy": number,
    "medium": number,
    "light": number,
    "unarmored": number,
    "advanced": number,
    "martial": number,
    "simple": number,
    "unarmed": number,
    "castingArcane": number,
    "castingDivine": number,
    "castingOccult": number,
    "castingPrimal": number,
    "acrobatics": number,
    "arcana": number,
    "athletics": number,
    "crafting": number,
    "deception": number,
    "diplomacy": number,
    "intimidation": number,
    "medicine": number,
    "nature": number,
    "occultism": number,
    "performance": number,
    "religion": number,
    "society": number,
    "stealth": number,
    "survival": number,
    "thievery": number
}

export interface iSpellsAtLevel {
    spellLevel: number,
    list: string[]
}

export interface iSpellCaster {
    name: string,
    magicTradition: string,
    ability: string,
    proficiency: number,
    spells: Array<iSpellsAtLevel>
}

export interface iPbMod {
    "Status Bonus"? : number,
    "Item Bonus"? : number,
    "Circumstance Bonus"? : number,
}

export interface iPBMods {
    "perception": iPbMod,
    "fortitude": iPbMod,
    "reflex": iPbMod,
    "will": iPbMod,
    "acrobatics": iPbMod,
    "arcana": iPbMod,
    "athletics": iPbMod,
    "crafting": iPbMod,
    "deception": iPbMod,
    "diplomacy": iPbMod,
    "intimidation": iPbMod,
    "medicine": iPbMod,
    "nature": iPbMod,
    "occultism": iPbMod,
    "performance": iPbMod,
    "religion": iPbMod,
    "society": iPbMod,
    "stealth": iPbMod,
    "survival": iPbMod,
    "thievery": iPbMod
}

export interface iPBBuild {
    name: string,
    class: string,
    level: number,
    resistances: Array<string>,
    keyability: string,
    feats: Array<Array<never>>,
    lores: Array<Array<never>>,
    acTotal: iAcTotal,
    abilities: iPBAbilities,
    proficiencies: iPBProficiencies,
    spellCasters: Array<iSpellCaster>
    mods: iPBMods;
}

export interface iAcTotal {
    acTotal: number,
    shieldBonus: string
}


function toModValue(modValue: number): number {
    return Math.floor((modValue - 10) / 2);
}

function getResistanceValue(str: string): iVulRes {
    console.log(str)
    const res = str.split(' ')
    const k = res.slice(0, -1)
    console.log(res.length)
    console.log(k, res[res.length - 1])
    const resis: iVulRes = {name: k.join(' '), value: Number(res[res.length - 1])}
    console.log(resis)
    return resis
}

function find(current: iDC[], newDc: iDC): number {

    for (const c in current) {
        const val = current[c]
        if (val != undefined && val.type == newDc.type && val.name == newDc.name && val.keyAttr == newDc.keyAttr && val.proficiency == newDc.proficiency) {
            return Number(c);
        }
    }
    return -1;
}

function toProfEnum(profAsPbNumber: number): proficiencyLevel {
    if (profAsPbNumber == 2)
        return proficiencyLevel.Trained
    if (profAsPbNumber == 4)
        return proficiencyLevel.Expert
    if (profAsPbNumber == 6)
        return proficiencyLevel.Master
    if (profAsPbNumber == 8)
        return proficiencyLevel.Legendary
    return proficiencyLevel.Untrained
}


export function updateCharacter(char: iCharacter, pbChar: iPBChar) {

    const pbCharBuild = pbChar.build;
    console.log(pbChar)

    console.info("Updating basic information ")

    char.name = pbCharBuild.name;
    char.class = pbCharBuild.class;
    char.level = pbCharBuild.level;
    char.keyAbility = pbCharBuild.keyability as Attribute;

    console.info("Updating source information")
    char.protection.ac = pbCharBuild.acTotal.acTotal;
    char.protection.shield = Number(pbCharBuild.acTotal.shieldBonus);

    console.info("Updating attributes")

    const attKeys = Object.values(Attribute);
    attKeys.forEach(key => {
        const newValue = toModValue(pbCharBuild.abilities[key])

        console.debug("Updating", key, "to", newValue);
        char.attributes[key] = newValue;
    })

    console.info("Updating proficiencies");
    Object.keys(pbCharBuild.proficiencies).forEach(profKey => {
        if (profKey in char.proficiencies) {
            const fromKey = profKey as keyof iPBProficiencies
            const toKey = profKey as keyof iProficiencies
            console.log("Updating", profKey, "to", pbCharBuild.proficiencies[fromKey]);
            char.proficiencies[toKey] = toProfEnum(pbCharBuild.proficiencies[fromKey]);
        }
    })


    console.info("Checking feats")
    char.untrainedImprovisation = false;
    pbCharBuild.feats.forEach(feat => {
        if (feat[0] == "Untrained Improvisation") {
            console.info("Found improved Improvisation")
            char.untrainedImprovisation = true;
        }
    })

    console.info("Updating resistances")
    char.resistances = []
    pbCharBuild.resistances.forEach((resistance) => {
        const res = getResistanceValue(resistance)
        char.resistances.push(res)
    })

    console.info("Updating lore")
    char.lores = [];
    pbCharBuild.lores.forEach(pbLore => {

        const loreName = String(pbLore[0])
        const prof = Number(pbLore[1])

        console.log("Found lore", loreName, prof)
        const lore: iLore = {name: loreName, item: 0, proficiency: toProfEnum(prof)};
        char.lores.push(lore);

    })

    console.info("Sorting Lores")
    char.lores.sort(function (a, b) {
        return capitalize(a.name) > capitalize(b.name) ? 1 : -1;
    })

    console.info("Updating spell details (Spell DC & Shield Spell)")
    char.spellDCs = []
    pbCharBuild.spellCasters.forEach((spellCasting: iSpellCaster) => {
        const newDC: iDC = {
            name: capitalize(spellCasting.magicTradition),
            keyAttr: spellCasting.ability as Attribute,
            type: "spell",
            proficiency: toProfEnum(spellCasting.proficiency),
            item: 0,
        }
        const spI = find(char.spellDCs, newDC)
        if (spI < 0) {
            console.info("Found Spell DC", newDC.name)
            char.spellDCs.push(newDC)
        } else {
            console.warn("Duplicated Spell DC", newDC)
        }
        spellCasting.spells.forEach((spellsAtLvl: iSpellsAtLevel) => {
            if (spellsAtLvl.spellLevel == 0) {
                spellsAtLvl.list.forEach((spell: string) => {
                    if (spell == "Shield") {
                        char.protection.shield = Math.max(char.protection.shield, 1);
                        console.log("Found the Shield Spell")
                    }
                })
            }
        })
    })

    console.info("Processing modifiers (mainly item bonuses)")
    for (const mod in pbCharBuild.mods) {
        console.log(mod)
        if("Item Bonus" in pbCharBuild.mods[mod]) {
            const lowerCaseMod = mod.toLowerCase();
            console.log(char.item)
            console.info("Found Item Bonus: ", mod , " = ",  pbCharBuild.mods[mod]["Item Bonus"], mod in char.item)
            if(lowerCaseMod in char.item) {
                char.item[lowerCaseMod] = pbCharBuild.mods[mod]["Item Bonus"]
                console.info("Set", mod," Item Bonus to", char.item[lowerCaseMod])
            }
        }
    }




    return char;
}


export async function loadFromPB(jsonId: string) {

    const url = 'https://pathbuilder2e.com/json.php?id=' + jsonId;
    let obj = null;
    console.info("Fetching from", url)

    try {
        obj = await (await fetch(url)).json();
    } catch (e) {
        console.error('error', e);
    }

    return obj;
}
